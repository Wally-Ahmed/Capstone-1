import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import { ExitCodeProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces

export class ExitCode {

    static tableName = 'exitCode';

    constructor(public code: string) {
        const properties: ExitCodeProperties = { code };
        Object.assign(this, properties);
    }
}

module.exports = {
    ExitCode
};