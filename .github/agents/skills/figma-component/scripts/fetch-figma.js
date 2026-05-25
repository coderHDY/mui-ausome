import fs from 'fs';
import path from 'path';

// 1. 从 Figma 页面 URL 解析出 FILE_KEY 和 NODE_ID
// 支持格式: https://www.figma.com/design/{FILE_KEY}/...?node-id=35-267
function parseFigmaUrl(figmaUrl) {
  const url = new URL(figmaUrl);
  // pathname: /design/{FILE_KEY}/name 或 /file/{FILE_KEY}/name
  const fileKey = url.pathname.split('/').filter(Boolean)[1];
  // node-id 在 URL 中用 - 分隔，API 中用 :
  const nodeId = url.searchParams.get('node-id')?.replace('-', ':') ?? null;
  if (!fileKey) throw new Error(`无法从 URL 解析 FILE_KEY: ${figmaUrl}`);
  return { fileKey, nodeId };
}

// 优先级：命令行参数 > 环境变量
// 用法：node <SKILL_DIR>/scripts/fetch-figma.js "https://www.figma.com/design/..."
//   或：FIGMA_URL="https://..." node <SKILL_DIR>/scripts/fetch-figma.js
// 注：<SKILL_DIR> 为本文件所在目录的路径（相对于项目根目录或绝对路径均可）
const FIGMA_URL = process.argv[2] || process.env.FIGMA_URL || null;

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;

async function fetchFigmaNode() {
  if (!FIGMA_TOKEN) {
    console.error('❌ 缺少 FIGMA_API_KEY 环境变量，请在 ~/.zshrc 中添加: export FIGMA_API_KEY=你的token');
    process.exit(1);
  }
  if (!FIGMA_URL) {
    console.error('❌ 缺少 Figma URL，请通过以下方式传入：');
    console.error('   node <SKILL_DIR>/scripts/fetch-figma.js "https://www.figma.com/design/..."');
    console.error('   或设置环境变量: export FIGMA_URL="https://..."');
    process.exit(1);
  }

  const { fileKey: FILE_KEY, nodeId: NODE_ID } = parseFigmaUrl(FIGMA_URL);
  console.log(`🔑 解析到 FILE_KEY: ${FILE_KEY}, NODE_ID: ${NODE_ID}`);
  const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${NODE_ID}`;
  
  try {
    console.log('🚀 正在从 Figma 远程抓取节点数据...');
    const response = await fetch(url, {
      headers: { 'X-Figma-Token': FIGMA_TOKEN }
    });

    // 修复：检查 HTTP 响应状态
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Figma API 请求失败 [${response.status}]: ${errorBody}`);
    }

    const data = await response.json();
    
    // 提取核心节点（API 响应的 key 用 - 分隔，请求参数用 : 分隔）
    const nodeKey = NODE_ID;
    console.log(nodeKey, data.nodes);
    if (!data.nodes || !data.nodes[nodeKey]) {
      throw new Error(`节点 ${NODE_ID} 不存在于文件 ${FILE_KEY} 中`);
    }
    const rawNode = data.nodes[nodeKey].document;
    
    // 2. 核心清洗：模仿 Framelink MCP，只保留大模型关心的布局和样式
    const cleanedData = simplifyNode(rawNode);
    
    // 3. 写入本地项目，供本地 Copilot Agent 读取
    //    文件名使用 node_<nodeId> 命名，保证项目内唯一（同一节点复写，不同节点共存）
    const targetDir = path.join(process.cwd(), '.figma_context');
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);

    const safeNodeId = NODE_ID.replace(':', '-');          // 35:267 → 35-267
    const outputFile = `node_${safeNodeId}.json`;
    const outputPath = path.join(targetDir, outputFile);

    fs.writeFileSync(outputPath, JSON.stringify(cleanedData, null, 2));
    console.log(`✅ 数据抓取并精简成功！已存至 .figma_context/${outputFile}`);
    console.log(`   NODE_ID: ${NODE_ID}  →  文件: ${outputFile}`);
  } catch (error) {
    console.error('❌ 抓取失败:', error);
  }
}

// 简化算法：递归过滤无用元数据，提取 Auto Layout、尺寸和颜色
function simplifyNode(node) {
  if (!node) return null;

  const result = {
    // --- 节点标识 ---
    id: node.id,
    name: node.name,
    type: node.type,                     // INSTANCE / FRAME / TEXT / VECTOR ...
    componentId: node.componentId,       // INSTANCE 关联的 Master 组件 ID

    // --- 布局核心（对应 MUI Box / Stack flexbox 属性）---
    layoutMode: node.layoutMode,         // HORIZONTAL / VERTICAL
    primaryAxisAlignItems: node.primaryAxisAlignItems,   // justifyContent
    counterAxisAlignItems: node.counterAxisAlignItems,   // alignItems
    layoutGrow: node.layoutGrow,         // 0 | 1 → flexGrow
    layoutAlign: node.layoutAlign,       // 'STRETCH' | 'INHERIT' → alignSelf
    paddingLeft: node.paddingLeft,
    paddingRight: node.paddingRight,
    paddingTop: node.paddingTop,
    paddingBottom: node.paddingBottom,
    itemSpacing: node.itemSpacing,       // gap

    // --- 尺寸 ---
    width: node.absoluteBoundingBox?.width,
    height: node.absoluteBoundingBox?.height,

    // --- 变体与状态（INSTANCE 专属，对应 MUI 的 variant / color / size props）---
    componentProperties: node.componentProperties,  // { "Type": "Primary", "State": "Default" }

    // --- 样式 Token 绑定（标记该节点绑定了哪个全局 Style Token，非硬编码色值）---
    styles: node.styles,  // { fill: "S:xxx", stroke: "S:yyy", text: "S:zzz" }

    // --- 颜色 fills ---
    fills: node.fills?.map(f => ({ type: f.type, color: f.color, opacity: f.opacity })),

    // --- 文本内容与排版 ---
    characters: node.characters,
    style: node.style ? {
      fontSize: node.style.fontSize,
      fontWeight: node.style.fontWeight,
      fontFamily: node.style.fontFamily,
      lineHeightPx: node.style.lineHeightPx,
      textAlignHorizontal: node.style.textAlignHorizontal,
    } : undefined,
  };

  // 递归处理子节点
  if (node.children) {
    result.children = node.children.map(child => simplifyNode(child)).filter(Boolean);
  }

  // 剔除 undefined / null 字段，精简体积
  return JSON.parse(JSON.stringify(result));
}

fetchFigmaNode();
