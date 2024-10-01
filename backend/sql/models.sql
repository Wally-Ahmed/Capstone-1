-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS Rank_permission, Employment_status, Table_status, Time_zone, Exit_code, Tab_status, Ticket_status, Restaurant, Restaurant_interface, Tip_pool, Employee, Restaurant_Employee, Shift, Shift_modification, Layout, Section, Restaurant_table, Reservation, Menu, Menu_section, Menu_item_root, Menu_item_variation, Tab, Ticket, Ticket_item, Delivery_ticket, Delivery_ticket_item CASCADE;

-- Dependency Tables

CREATE TABLE Rank_permission (
    rank VARCHAR(255) PRIMARY KEY
); -- admin, manager, employee

CREATE TABLE Employment_status (
    status VARCHAR(255) PRIMARY KEY
); -- active, suspended,

CREATE TABLE Table_status (
    status VARCHAR(255) PRIMARY KEY
); -- available, occupied, on-hold

CREATE TABLE Time_zone (
    code VARCHAR(255) PRIMARY KEY
); -- ADT, AKDT, AKST, AST, CDT, CST, EDT, EST, HDT, HST, MDT, MST, NDT, NST, PDT, PST

CREATE TABLE Exit_code (
    code VARCHAR(255) PRIMARY KEY,
    description TEXT NOT NULL
); -- employee-exit | Exited by employee, manager-exit | Exited by manager

CREATE TABLE Tab_status (
    status VARCHAR(255) PRIMARY KEY
); -- open, resolved

CREATE TABLE Ticket_status (
    status VARCHAR(255) PRIMARY KEY
); -- in-progress, completed



-- Restaurant Info

CREATE TABLE Restaurant (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_name VARCHAR(255) NOT NULL,
    restaurant_address VARCHAR(255) NOT NULL,    
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    auth_token_hash TEXT,
    active_layout_id UUID, -- Layout table is not yet defined so fk refference is not enforced until it is

    -- Schedule info
    time_zone VARCHAR(255),
    FOREIGN KEY (time_zone) REFERENCES Time_zone(code), --
    time_until_first_reservation_minutes INTEGER,
    time_until_last_reservation_minutes INTEGER,
    reservation_duration_minutes INTEGER,

    -- Opening times
    monday_opening TIME,
    tuesday_opening TIME,
    wednesday_opening TIME,
    thursday_opening TIME,
    friday_opening TIME,
    saturday_opening TIME,
    sunday_opening TIME,

    -- Closing times
    monday_closing TIME,
    tuesday_closing TIME,
    wednesday_closing TIME,
    thursday_closing TIME,
    friday_closing TIME,
    saturday_closing TIME,
    sunday_closing TIME
);

CREATE TABLE Restaurant_interface (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interface_name VARCHAR(255),
    time_created TIMESTAMPTZ NOT NULL,
    link_code VARCHAR(255),
    token_code TEXT,
    tablemap_permission BOOLEAN NOT NULL,
    tab_permission BOOLEAN NOT NULL,
    kitchen_permission BOOLEAN NOT NULL,
    shift_permission BOOLEAN NOT NULL,
    sumup_oauth2_access_token TEXT,
    sumup_oauth2_refresh_token TEXT,
    sumup_oauth2_code TEXT,
    sumup_solo_id TEXT,
    sumup_merchant_code TEXT,
    restaurant_id UUID NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(id) --
);

CREATE TABLE Tip_pool (
    restaurant_id UUID,
    date DATE,
    id UUID UNIQUE,
    amount DECIMAL(8, 2),
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(id), --
    PRIMARY KEY (restaurant_id, date)
);

-- Employee Info

CREATE TABLE Employee (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_name VARCHAR(255) NOT NULL,    
    employee_email VARCHAR(255) UNIQUE NOT NULL,
    employee_phone VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    employee_code TEXT UNIQUE,
    auth_token1 TEXT,
    auth_token2 TEXT,
    auth_token3 TEXT,
    auth_token4 TEXT
);

CREATE TABLE Restaurant_Employee (
    id UUID UNIQUE,
    employee_code VARCHAR(255) UNIQUE NOT NULL, 
    employee_rank VARCHAR(255) NOT NULL, 
    FOREIGN KEY (employee_rank) REFERENCES Rank_permission(rank), --
    employment_status VARCHAR(255) NOT NULL, 
    FOREIGN KEY (employment_status) REFERENCES Employment_status(status), --
    employee_id UUID NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(id), --
    restaurant_id UUID NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(id), --
    PRIMARY KEY (employee_id, restaurant_id)
);

CREATE TABLE Shift (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    start_date_time TIMESTAMPTZ NOT NULL,
    end_date_time TIMESTAMPTZ,
    exit_code VARCHAR(255),
    FOREIGN KEY (exit_code) REFERENCES Exit_code(code), --
    tip_pool_id UUID,
    FOREIGN KEY (tip_pool_id) REFERENCES Tip_pool(id), --
    restaurant_employee_id UUID NOT NULL,
    FOREIGN KEY (restaurant_employee_id) REFERENCES Restaurant_Employee(id), --
    restaurant_id UUID,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(id) --
);

CREATE TABLE Shift_modification (
    shift_id UUID,
    modification_time TIMESTAMPTZ NOT NULL,
    modification_by_restaurant_employee_id UUID,
    FOREIGN KEY (modification_by_restaurant_employee_id) REFERENCES Restaurant_Employee(id), --
    FOREIGN KEY (shift_id) REFERENCES Shift(id), --
    PRIMARY KEY (shift_id, modification_time)
);

-- Tables and Reservation

CREATE TABLE Layout (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    layout_name VARCHAR(255) NOT NULL,
    restaurant_id UUID NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(id) --
);
-- Adding the active_layout_id foreign key constraint after both tables have been created
ALTER TABLE Restaurant
ADD CONSTRAINT FK_Restaurant_Layout FOREIGN KEY (active_layout_id) REFERENCES Layout(id) ON DELETE SET NULL;

CREATE TABLE Section (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_name VARCHAR(255) NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    position INT NOT NULL,
    layout_id UUID NOT NULL,
    FOREIGN KEY (layout_id) REFERENCES Layout(id) ON DELETE CASCADE -- on delete cascade
);

CREATE TABLE Restaurant_table (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(255) NOT NULL,
    seats INT NOT NULL,
    x INT,
    y INT,
    table_status VARCHAR(255) NOT NULL, 
    FOREIGN KEY (table_status) REFERENCES table_status(status), --
    reservable BOOLEAN NOT NULL,
    section_id UUID NOT NULL,
    FOREIGN KEY (section_id) REFERENCES Section(id) ON DELETE CASCADE -- on delete cascade
);

CREATE TABLE Reservation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    party_size INT NOT NULL,
    reservation_time TIMESTAMPTZ NOT NULL,
    confirmation_status VARCHAR(255), -- needs a dependency table
    guest_name VARCHAR(255) NOT NULL,
    guest_ip VARCHAR(255),    
    guest_phone VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    Restaurant_table_id UUID,
    FOREIGN KEY (Restaurant_table_id) REFERENCES Restaurant_table(id) ON DELETE SET NULL, -- set to null if deleted
    Restaurant_id UUID NOT NULL,
    FOREIGN KEY (Restaurant_id) REFERENCES Restaurant(id) --
);

-- Menu

CREATE TABLE Menu (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_title VARCHAR(255) NOT NULL,
    restaurant_id UUID NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(id) --
);

CREATE TABLE Menu_section (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    position INT NOT NULL,
    menu_section_title VARCHAR(255) NOT NULL,
    menu_id UUID NOT NULL,
    FOREIGN KEY (menu_id) REFERENCES Menu(id) ON DELETE CASCADE -- on delete cascade
);

CREATE TABLE Menu_item_root (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    position INT NOT NULL,
    menu_item_root_name VARCHAR(255) NOT NULL,
    base_price DECIMAL(8, 2) NOT NULL,
    menu_item_root_description VARCHAR(255) NOT NULL,
    prep_time_required BOOLEAN NOT NULL,
    menu_section_id UUID NOT NULL,
    FOREIGN KEY (menu_section_id) REFERENCES Menu_section(id) ON DELETE CASCADE -- on delete cascade
);

CREATE TABLE Menu_item_variation (
    menu_item_root_id UUID,
    menu_item_variation_description VARCHAR(255),
    price_difference DECIMAL(8, 2) NOT NULL,
    id UUID UNIQUE,
    FOREIGN KEY (menu_item_root_id) REFERENCES Menu_item_root(id) ON DELETE CASCADE, -- on delete cascade
    PRIMARY KEY (menu_item_root_id, menu_item_variation_description)
);

-- Tab and ticket

CREATE TABLE Tab (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255),
    discount DECIMAL(8, 2) NOT NULL,
    calculated_tax DECIMAL(8, 2),
    total_tip DECIMAL(8, 2),
    time_completed TIMESTAMPTZ,
    transaction_id TEXT,
    tab_status VARCHAR(255),
    FOREIGN KEY (tab_status) REFERENCES Tab_status(status), --
    server_restaurant_employee_id UUID NOT NULL,
    FOREIGN KEY (server_restaurant_employee_id) REFERENCES Restaurant_Employee(id) ON DELETE SET NULL, -- set to null if deleted
    Restaurant_table_id UUID,
    FOREIGN KEY (Restaurant_table_id) REFERENCES Restaurant_table(id) ON DELETE SET NULL, -- set to null if deleted
    restaurant_id UUID NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(id) --
);

CREATE TABLE Ticket (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comments VARCHAR(255) NOT NULL,
    iat TIMESTAMPTZ NOT NULL,
    time_completed TIMESTAMPTZ,
    status VARCHAR(255),
    FOREIGN KEY (status) REFERENCES Ticket_status(status), --
    tab_id UUID NOT NULL,
    FOREIGN KEY (tab_id) REFERENCES Tab(id) ON DELETE SET NULL, -- on delete cascade
    restaurant_id UUID NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(id) --
);

CREATE TABLE Ticket_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name VARCHAR(255) NOT NULL,
    variation_description VARCHAR(255) NOT NULL,
    comments VARCHAR(255),
    price DECIMAL(8, 2) NOT NULL,
    prep_time_required BOOLEAN NOT NULL,
    ticket_id UUID NOT NULL,
    FOREIGN KEY (ticket_id) REFERENCES Ticket(id) ON DELETE SET NULL, -- on delete cascade
    menu_item_variation_id UUID NOT NULL,
    FOREIGN KEY (menu_item_variation_id) REFERENCES Menu_item_variation(id) ON DELETE SET NULL, -- on delete cascade
    tab_id UUID NOT NULL,
    FOREIGN KEY (tab_id) REFERENCES Tab(id) ON DELETE SET NULL -- on delete cascade
);

-- Delivery Ticket

CREATE TABLE Delivery_ticket (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comments VARCHAR(255),
    time_submitted TIMESTAMPTZ NOT NULL,
    time_completed TIMESTAMPTZ NOT NULL
);

CREATE TABLE Delivery_ticket_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comments VARCHAR(255),
    kitchen_status VARCHAR(255) NOT NULL,
    delivery_ticket_id UUID NOT NULL,
    FOREIGN KEY (delivery_ticket_id) REFERENCES Delivery_ticket(id) ON DELETE SET NULL, -- on delete cascade
    menu_item_variation_id UUID NOT NULL,
    FOREIGN KEY (menu_item_variation_id) REFERENCES Menu_item_variation(id) ON DELETE SET NULL, -- on delete cascade
    restaurant_id UUID NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(id) --
);
