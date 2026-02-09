export interface FileNode {
  name: string;
  is_dir: boolean;
  size: number;
}

export interface ExplorerView {
  current_path: string;
  items: FileNode[];
  can_go_back: boolean;
}