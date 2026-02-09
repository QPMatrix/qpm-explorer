export interface FileNode {
  name: string
  is_dir: boolean
  size: number
}

export interface ExplorerView {
  current_path: string
  items: FileNode[]
  can_go_back: boolean
  can_go_forward: boolean
  can_go_up: boolean
}

export interface SystemPath {
  label: string
  path: string
  icon: string
}

export interface Favorite {
  id: number
  path: string
  label: string
  icon: string
}
