"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const namespace_1 = require("./__utilities__/namespace");
const { port } = require("./config");
// console.log(server)
namespace_1.server.listen(port, () => console.log(`Server is running on port ${port}`));
