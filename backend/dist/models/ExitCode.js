"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExitCode = void 0;
class ExitCode {
    constructor(code) {
        this.code = code;
        const properties = { code };
        Object.assign(this, properties);
    }
}
exports.ExitCode = ExitCode;
ExitCode.tableName = 'exitCode';
module.exports = {
    ExitCode
};
