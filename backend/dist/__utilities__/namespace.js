"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.shiftNsp = exports.kitchenNsp = exports.tabNsp = exports.tablemapNsp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const expressError_1 = require("./expressError");
const io_1 = require("./io");
const RestaurantInterface_1 = require("../models/RestaurantInterface");
// console.log('hit', io)
// const nsp = io.of('/namespace');
// nsp.on("connection", (socket) => {
//     console.log(`User connected: ${socket.id} nsp`)
// })
exports.tablemapNsp = io_1.io.of('/tablemap');
exports.tablemapNsp.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = socket.handshake.auth.token;
    try {
        if (!token) {
            throw new expressError_1.UnauthorizedError('No token provided');
        }
        ;
        const { user: restaurantInterface } = yield RestaurantInterface_1.RestaurantInterface.authorize(token);
        if (!restaurantInterface) {
            throw new expressError_1.UnauthorizedError('Invalid Token');
        }
        ;
        const decoded = jsonwebtoken_1.default.verify(token, config_1.secretKey);
        // Check if decoded is an object and has the 'id' properties
        if (!(typeof decoded === 'object' && decoded.id)) {
            throw new expressError_1.UnauthorizedError('Invalid token');
        }
        const user = yield RestaurantInterface_1.RestaurantInterface.findById(decoded.id);
        if (user === null) {
            throw new expressError_1.UnauthorizedError('Invalid or expired token');
        }
        if (token !== user.interface_token) {
            throw new expressError_1.UnauthorizedError('Invalid token');
        }
        socket.user = user;
        next();
    }
    catch (err) {
        next(new Error('Invalid JWT'));
    }
}));
exports.tablemapNsp.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = socket.user;
        if (!user.tablemap_permission) {
            throw new Error();
        }
        next();
    }
    catch (err) {
        next(new expressError_1.UnauthorizedError('This interface does not have tablemap permissions'));
    }
    ;
}));
exports.tablemapNsp.on('connection', (socket) => {
    const user = socket.user;
    socket.join(user.id);
});
exports.tabNsp = io_1.io.of('/tab');
exports.tabNsp.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = socket.handshake.auth.token;
    try {
        if (!token) {
            throw new expressError_1.UnauthorizedError('No token provided');
        }
        ;
        const { user: restaurantInterface } = yield RestaurantInterface_1.RestaurantInterface.authorize(token);
        if (!restaurantInterface) {
            throw new expressError_1.UnauthorizedError('Invalid Token');
        }
        ;
        const decoded = jsonwebtoken_1.default.verify(token, config_1.secretKey);
        // Check if decoded is an object and has the 'id' and 'col' properties
        if (!(typeof decoded === 'object' && decoded.id)) {
            throw new expressError_1.UnauthorizedError('Invalid token');
        }
        const user = yield RestaurantInterface_1.RestaurantInterface.findById(decoded.id);
        if (user === null) {
            throw new expressError_1.UnauthorizedError('Invalid or expired token');
        }
        if (token !== user.interface_token) {
            throw new expressError_1.UnauthorizedError('Invalid token');
        }
        socket.user = user;
        next();
    }
    catch (err) {
        next(new Error('Invalid JWT'));
    }
}));
exports.tabNsp.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = socket.user;
        if (!user.tab_permission) {
            throw new Error();
        }
        next();
    }
    catch (err) {
        next(new expressError_1.UnauthorizedError('This interface does not have tab permissions'));
    }
}));
exports.tabNsp.on('connection', (socket) => {
    const user = socket.user;
    socket.join(user.id);
});
exports.kitchenNsp = io_1.io.of('/kitchenView');
exports.kitchenNsp.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = socket.handshake.auth.token;
    try {
        if (!token) {
            throw new expressError_1.UnauthorizedError('No token provided');
        }
        ;
        const { user: restaurantInterface } = yield RestaurantInterface_1.RestaurantInterface.authorize(token);
        if (!restaurantInterface) {
            throw new expressError_1.UnauthorizedError('Invalid Token');
        }
        ;
        const decoded = jsonwebtoken_1.default.verify(token, config_1.secretKey);
        // Check if decoded is an object and has the 'id' and 'col' properties
        if (!(typeof decoded === 'object' && decoded.id)) {
            throw new expressError_1.UnauthorizedError('Invalid token');
        }
        const user = yield RestaurantInterface_1.RestaurantInterface.findById(decoded.id);
        if (user === null) {
            throw new expressError_1.UnauthorizedError('Invalid or expired token');
        }
        if (token !== user.interface_token) {
            throw new expressError_1.UnauthorizedError('Invalid token');
        }
        socket.user = user;
        next();
    }
    catch (err) {
        next(new Error('Invalid JWT'));
    }
}));
exports.kitchenNsp.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = socket.user;
        if (!user.kitchen_permission) {
            throw new Error();
        }
        next();
    }
    catch (err) {
        next(new expressError_1.UnauthorizedError('This interface does not have kitchen permissions'));
    }
}));
exports.kitchenNsp.on('connection', (socket) => {
    const user = socket.user;
    socket.join(user.id);
});
exports.shiftNsp = io_1.io.of('/shift');
exports.shiftNsp.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = socket.handshake.auth.token;
    try {
        if (!token) {
            throw new expressError_1.UnauthorizedError('No token provided');
        }
        ;
        const { user: restaurantInterface } = yield RestaurantInterface_1.RestaurantInterface.authorize(token);
        if (!restaurantInterface) {
            throw new expressError_1.UnauthorizedError('Invalid Token');
        }
        ;
        const decoded = jsonwebtoken_1.default.verify(token, config_1.secretKey);
        console.log('hitter');
        // Check if decoded is an object and has the 'id' and 'col' properties
        if (!(typeof decoded === 'object' && decoded.id)) {
            throw new expressError_1.UnauthorizedError('Invalid token');
        }
        const user = yield RestaurantInterface_1.RestaurantInterface.findById(decoded.id);
        if (user === null) {
            throw new expressError_1.UnauthorizedError('Invalid or expired token');
        }
        if (token !== user.interface_token) {
            throw new expressError_1.UnauthorizedError('Invalid token');
        }
        socket.user = user;
        next();
    }
    catch (err) {
        next(new Error('Invalid JWT'));
    }
}));
exports.shiftNsp.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = socket.user;
        if (!user.shift_permission) {
            throw new Error();
        }
        next();
    }
    catch (err) {
        next(new expressError_1.UnauthorizedError('This interface does not have shift permissions'));
    }
}));
exports.shiftNsp.on('connection', (socket) => {
    const user = socket.user;
    socket.join(user.id);
});
exports.server = io_1.socketServer;
// module.exports = { tablemapNsp, tabNsp, kitchenNsp, shiftNsp };
