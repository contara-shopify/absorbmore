export type EditorStore = {
    load_section_id: string;
    unload_section_id: string;
    select_section_id: string;
    reorder_section_id: string;
    deselect_block_id: string;
    deselect_section_id: string;
    select_block_id: string;
    inspector: boolean;
};
declare module "alpinejs" {
    interface Magics<T> {
        $editor: EditorStore;
    }
}
