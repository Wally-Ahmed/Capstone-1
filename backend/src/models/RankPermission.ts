import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import { RankPermissionProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces

export class RankPermission {

    static tableName = 'rank_permission';

    constructor(public rank: string) {
        const properties: RankPermissionProperties = { rank };
        Object.assign(this, properties);
    }
}

module.exports = {
    RankPermission
};