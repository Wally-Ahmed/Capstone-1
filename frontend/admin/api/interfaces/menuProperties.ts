interface DatabaseObjectProperties {
    id?: string,  // UUID as a string
}

interface MenuProperties extends DatabaseObjectProperties {
    menu_title: string;
    restaurant_id: string;
}

interface MenuSectionProperties extends DatabaseObjectProperties {
    menu_id: string;
    position: number;
    menu_section_title: string;
}

interface MenuItemRootProperties extends DatabaseObjectProperties {
    menu_section_id: string;
    position: number;
    menu_item_root_name: string;
    base_price: number;
    menu_item_root_description: string;
    prep_time_required: boolean;
}

interface MenuItemVariationProperties extends DatabaseObjectProperties {
    menu_item_root_id: string;
    menu_item_variation_description: string;
    price_difference: number;
}

export interface fullItemRoot extends MenuItemRootProperties {
    id: string,
    MenuItemVariations: MenuItemVariationProperties[],
}

export interface fullMenuSection extends MenuSectionProperties {
    id: string,
    MenuItemRoots: fullItemRoot[],
}

export interface fullMenu {
    id: string,
    menu_title: string,
    MenuSections: fullMenuSection[],
}

