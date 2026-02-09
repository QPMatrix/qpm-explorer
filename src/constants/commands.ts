export const COMMANDS = {
  // File operations
  GET_CURRENT_VIEW: 'get_current_view',
  OPEN_FOLDER: 'open_folder',
  GO_BACK: 'go_back',
  DELETE_ITEM: 'delete_item',
  CREATE_FOLDER: 'create_folder',
  CREATE_FILE: 'create_file',
  RENAME_ITEM: 'rename_item',
  SEARCH_FILES: 'search_files',
  
  // System operations
  GET_SYSTEM_PATHS: 'get_system_paths',
  GET_ALL_FAVORITES: 'get_all_favorites',
  ADD_NEW_FAVORITE: 'add_new_favorite',
  REMOVE_EXISTING_FAVORITE: 'remove_existing_favorite',
} as const

export type CommandName = typeof COMMANDS[keyof typeof COMMANDS]
