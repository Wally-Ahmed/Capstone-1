import { JSONSchemaType } from 'ajv';

interface Menu {
    menu_title: string;
    menu_section_title: string;
    position: number;
    menu_item_root_name: string;
    base_price: number | string;
    menu_item_root_description: string;
    prep_time_required: boolean;
    menu_item_variation_description: string;
    price_difference: number | string;
}

const menuSchema: JSONSchemaType<Menu> = {
    type: "object",
    properties: {
        menu_title: { type: "string" },
        menu_section_title: { type: "string" },
        position: { type: "number" },
        menu_item_root_name: { type: "string" },
        base_price: {
            oneOf: [
                { type: "number" },
                { type: "string" }
            ]
        },
        menu_item_root_description: { type: "string" },
        prep_time_required: { type: "boolean" },
        menu_item_variation_description: { type: "string" },
        price_difference: {
            oneOf: [
                { type: "number" },
                { type: "string" }
            ]
        },
    },
    required: [],
    additionalProperties: false, // Ensures that no properties other than those listed are allowed.
};

export default menuSchema;
