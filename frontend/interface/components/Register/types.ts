
// types.ts

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
    MenuItemVariations: MenuItemVariationProperties[],
}

export interface fullMenuSection extends MenuSectionProperties {
    MenuItemRoots: fullItemRoot[],
}

export interface fullMenu {
    menu_title: string,
    MenuSections: fullMenuSection[],
}







export interface TicketItemProperties extends DatabaseObjectProperties {
    item_name: string;
    variation_description: string;
    comments: string;
    price: number;
    prep_time_required: boolean;
    ticket_id: string;
    menu_item_variation_id: string;
    tab_id: string;
}

export interface TicketProperties extends DatabaseObjectProperties {
    comments: string;
    tab_id: string;
    restaurant_id: string;
    time_completed: Date | null;
    status: string | null;
}

export interface TabProperties extends DatabaseObjectProperties {
    customer_name: string;
    discount: number;
    calculated_tax: number | null;
    total_tip: number | null;
    tab_status: string;
    server_restaurant_employee_id: string;
    restaurant_table_id: string | null;
    restaurant_id: string;
}

export interface fullTicket extends TicketProperties {
    id: string;
    ticketItems: TicketItemProperties[];
}

export interface fullTab extends TabProperties {
    id: string;
    server_name: string;
    table_name: string;
    tickets: fullTicket[];
}

interface DatabaseObjectProperties {
    id?: string,  // UUID as a string
}