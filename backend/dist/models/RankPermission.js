"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankPermission = void 0;
class RankPermission {
    constructor(rank) {
        this.rank = rank;
        const properties = { rank };
        Object.assign(this, properties);
    }
}
exports.RankPermission = RankPermission;
RankPermission.tableName = 'rank_permission';
module.exports = {
    RankPermission
};
