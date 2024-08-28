"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftModification = void 0;
class ShiftModification {
    constructor(shift_id, modification_time, modification_by_restaurant_employee_id) {
        this.shift_id = shift_id;
        this.modification_time = modification_time;
        this.modification_by_restaurant_employee_id = modification_by_restaurant_employee_id;
        const properties = {
            shift_id,
            modification_time,
            modification_by_restaurant_employee_id
        };
        Object.assign(this, properties);
    }
}
exports.ShiftModification = ShiftModification;
ShiftModification.tableName = 'shift_modification';
module.exports = {
    ShiftModification
};
