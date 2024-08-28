import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import { TicketItemProperties, TicketProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces
import { DatabaseObject } from './DatabaseObject'; // Import DatabaseObject from the same directory
import { TicketItem } from './TicketItem';

interface fullTicket extends TicketProperties {
    customer_name: string;
    table_name: string | null;
};

export class Ticket extends DatabaseObject {

    static tableName = 'ticket';

    constructor(
        public tab_id: string,
        public restaurant_id: string,
        public comments: string,
        public iat: Date = new Date,
        public status: 'in-progress' | 'completed' | null = null,
        public time_completed: Date | null = null,
        public id: string | undefined = undefined,
    ) {
        const properties: TicketProperties = {
            id,
            comments,
            restaurant_id,
            status,
            time_completed,
            tab_id,
            iat,
        };
        super(properties);
    }

    static async getActiveTicketsByRestaurantID(Id: string): Promise<fullTicket[]> {
        try {
            const res = await db.query(`
                SELECT t.*, tab.customer_name, rt.table_name
                FROM Ticket t
                JOIN Tab tab ON t.tab_id = tab.id
                LEFT JOIN restaurant_table rt ON tab.restaurant_table_id = rt.id
                WHERE t.restaurant_id = $1 AND t.status = 'in-progress'
                ORDER BY t.iat ASC;
            `, [Id]);
            const tickets: fullTicket[] = res.rows.map((row: fullTicket): fullTicket => {
                const ticket = new Ticket(row.tab_id, row.restaurant_id, row.comments, row.iat, row.status, row.time_completed, row.id,);
                ticket.customer_name = row.customer_name;
                ticket.table_name = row.table_name;
                return ticket as any as fullTicket;
            })
            return tickets;
        } catch (err) {
            // Handle or throw error
            throw err;
        };
    };

    static async getTicketsByTabIDs(IdArray: string[]) {
        try {
            const res = await db.query(`SELECT * FROM Ticket WHERE tab_id = ANY($1)`, [IdArray]);

            const tables: Ticket[] = res.rows.map((row: TicketProperties) => { return new Ticket(row.tab_id, row.restaurant_id, row.comments, row.iat, row.status, row.time_completed, row.id) })
            return tables;
        } catch (err) {
            // Handle or throw error
            throw err;
        };
    };

    async getTicketItems(): Promise<TicketItem[]> {
        try {
            // Query the TicketItem table for instances belonging to this Ticket
            const res = await db.query('SELECT * FROM Ticket_item WHERE ticket_id = $1', [this.id]);

            // Map over the resulting rows and turn each one into a new MenuSection instance
            const menuSections: TicketItem[] = res.rows.map((row: TicketItemProperties) => new TicketItem(row.menu_item_variation_id, row.ticket_id, row.tab_id, row.comments, row.prep_time_required, row.price, row.item_name, row.variation_description, row.id,))
            return menuSections;
        } catch (err) {
            throw err;
        };
    };
}

module.exports = {
    Ticket
};