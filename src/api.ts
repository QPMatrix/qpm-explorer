import { invoke } from "@tauri-apps/api/core";
import { ExplorerView } from "./types";

export const rustApi = {
    getCurrentView: () => invoke<ExplorerView>('get_current_view'),
    openFolder: (name: string) => invoke<ExplorerView>('open_folder', { name }),
    back: () => invoke<ExplorerView>('go_back'),
    delete:(name:string)=> invoke<ExplorerView>('delete_item',{name})
}