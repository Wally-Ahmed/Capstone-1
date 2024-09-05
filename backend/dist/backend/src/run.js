"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const namespace_1 = require("./__utilities__/namespace");
const config_1 = require("./config");
// console.log(server)
namespace_1.server.listen(config_1.port, () => console.log(`Server is running on port ${config_1.port}`));
