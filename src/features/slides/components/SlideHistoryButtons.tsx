import { IconButton, Tooltip } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { useSlideEditorStore } from '../model/store/slide-editor-store';

export function SlideHistoryButtons() {
  const canUndo = useSlideEditorStore((s) => s.historyPast.length > 0);
  const canRedo = useSlideEditorStore((s) => s.historyFuture.length > 0);
  const undo = useSlideEditorStore((s) => s.undo);
  const redo = useSlideEditorStore((s) => s.redo);

  return (
    <>
      <Tooltip title="撤销 (⌘Z)" placement="left">
        <span>
          <IconButton
            aria-label="撤销"
            onClick={undo}
            disabled={!canUndo}
            size="large"
          >
            <UndoIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="重做 (⌘⇧Z)" placement="left">
        <span>
          <IconButton
            aria-label="重做"
            onClick={redo}
            disabled={!canRedo}
            size="large"
          >
            <RedoIcon />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
}
