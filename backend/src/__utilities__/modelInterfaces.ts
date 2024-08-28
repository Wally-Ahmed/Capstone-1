import { DatabaseObject } from '../models/DatabaseObject'

export interface DatabaseObjectProperties {
    id?: string,  // UUID as a string
}

export interface RestaurantProperties extends DatabaseObjectProperties {
    restaurant_name: string;
    restaurant_address: string;
    email: string;
    phone_number: string;
    password_hash: string;
    auth_token_hash: string | null; // Optional field
    active_layout_id: string | null; // Optional field
    time_zone: string | null; // Optional field
    time_until_first_reservation_minutes: number; // Optional field
    time_until_last_reservation_minutes: number; // Optional field
    reservation_duration_minutes: number; // Optional field
    monday_opening: string | null; // Optional field
    tuesday_opening: string | null; // Optional field
    wednesday_opening: string | null; // Optional field
    thursday_opening: string | null; // Optional field
    friday_opening: string | null; // Optional field
    saturday_opening: string | null; // Optional field
    sunday_opening: string | null; // Optional field
    monday_closing: string | null; // Optional field
    tuesday_closing: string | null; // Optional field
    wednesday_closing: string | null; // Optional field
    thursday_closing: string | null; // Optional field
    friday_closing: string | null; // Optional field
    saturday_closing: string | null; // Optional field
    sunday_closing: string | null; // Optional field
}

export interface RestaurantInterfaceProperties extends DatabaseObjectProperties {
    interface_name: string;
    time_created: Date;
    link_code: string | null;
    token_code: string | null;
    restaurant_id: string;
    tablemap_permission: boolean,
    tab_permission: boolean,
    kitchen_permission: boolean,
    shift_permission: boolean,
}

export interface TipPoolProperties extends DatabaseObjectProperties {
    restaurant_id: string;
    date: Date;
    amount: number;
}

export interface LayoutProperties extends DatabaseObjectProperties {
    layout_name: string;
    restaurant_id: string;
}

export interface SectionProperties extends DatabaseObjectProperties {
    section_name: string;
    width: number;
    height: number;
    position: number;
    layout_id: string;
}

export interface RestaurantTableProperties extends DatabaseObjectProperties {
    table_name: string;
    table_status: string;
    reservable: boolean;
    seats: number;
    x: number;
    y: number;
    section_id: string;
}

export interface ReservationProperties extends DatabaseObjectProperties {
    party_size: number;
    reservation_time: Date;
    guest_name: string;
    guest_ip: string | null;
    guest_phone: string;
    guest_email: string;
    confirmation_status: string | null;
    restaurant_table_id: string | null;
    restaurant_id: string;
}

export interface EmployeeProperties extends DatabaseObjectProperties {
    employee_name: string;
    employee_email: string;
    employee_phone: string;
    password_hash: string;
    employee_code: string | null;
    auth_token1: string | null,
    auth_token2: string | null,
    auth_token3: string | null,
    auth_token4: string | null,
}

export interface RestaurantEmployeeProperties extends DatabaseObjectProperties {
    employee_rank: string;
    employee_code: string;
    employment_status: string;
    employee_id: string;
    restaurant_id: string;
}

export interface ShiftProperties extends DatabaseObjectProperties {
    start_date_time: Date;
    restaurant_id: string;
    tip_pool_id: string;
    restaurant_employee_id: string;
    end_date_time: Date | null;
    exit_code: string | null;
}

export interface ShiftModificationProperties {
    shift_id: string;
    modification_time: Date;
    modification_by_restaurant_employee_id: string;
}

export interface RankPermissionProperties {
    rank: string;
}

export interface ExitCodeProperties {
    code: string;
}

export interface MenuProperties extends DatabaseObjectProperties {
    menu_title: string;
    restaurant_id: string;
}

export interface MenuSectionProperties extends DatabaseObjectProperties {
    menu_id: string;
    position: number;
    menu_section_title: string;
}

export interface MenuItemRootProperties extends DatabaseObjectProperties {
    menu_section_id: string;
    position: number;
    menu_item_root_name: string;
    base_price: number;
    menu_item_root_description: string;
    prep_time_required: boolean;
}

export interface MenuItemVariationProperties extends DatabaseObjectProperties {
    menu_item_root_id: string;
    menu_item_variation_description: string;
    price_difference: number;
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

export interface TicketProperties extends DatabaseObjectProperties {
    comments: string;
    tab_id: string;
    restaurant_id: string;
    time_completed: Date | null;
    status: 'in-progress' | 'completed' | null;
    iat: Date;
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

export interface DeliveryTicketProperties extends DatabaseObjectProperties {
    comments: string;
    time_submitted: Date;
    time_completed: Date | null;
}

export interface DeliveryTicketItemProperties extends DatabaseObjectProperties {
    comments: string;
    kitchen_status: string;
    delivery_ticket_id: string;
    menu_item_variation_id: string;
}

export interface DatabaseObjectConstructor extends DatabaseObjectProperties {
    new(properties: DatabaseObjectProperties): DatabaseObject;
    tableName: string;  // Static property for table name
    getTableName(): string;  // Static method to get the table name
    findById(id: string): Promise<DatabaseObject | null>;  // Static method to find a record by ID
    getAll(): Promise<DatabaseObject[]>;  // Static method to get all records
}

export interface JoinTableConstructor extends DatabaseObjectProperties {
    findById(id: string): Promise<DatabaseObject | null>;
    findByPK(pk1: string, pk2: string): Promise<DatabaseObject | null>;
    // Add any other static methods or properties if needed
}