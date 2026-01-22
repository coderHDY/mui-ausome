export type DataStatus = 'active' | 'inactive' | 'draft' | 'archived';

export interface DataRecord {
  id: string;
  name: string;
  category: string;
  status: DataStatus;
  owner: string;
  updatedAt: string;
  createdAt: string;
  description?: string;
}
