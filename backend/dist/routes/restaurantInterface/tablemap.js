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
const express_1 = __importDefault(require("express"));
const expressError_1 = require("../../__utilities__/expressError");
const authenticateToken_1 = require("../../__utilities__/authenticateToken");
const RestaurantTable_1 = require("../../models/RestaurantTable");
const namespace_1 = require("../../__utilities__/namespace");
const validateSchema_1 = require("../../__utilities__/validateSchema");
const tableSchema_1 = __importDefault(require("./schemas/tableSchema"));
const router = express_1.default.Router();
router.use(express_1.default.json());
router.route('/table/:table_id/')
    .patch(authenticateToken_1.authenticateInterface, (0, validateSchema_1.validateSchema)(tableSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantInterface = req.restaurantInterface;
    try {
        const { table_id } = req.params;
        const { table_status } = req.body;
        if (!table_status) {
            throw new expressError_1.BadRequestError("Required parameters are missing.");
        }
        ;
        const restaurantTable = yield RestaurantTable_1.RestaurantTable.findById(table_id);
        if (!restaurantTable) {
            throw new expressError_1.NotFoundError('Table not found');
        }
        ;
        restaurantTable.table_status = table_status;
        yield restaurantTable.save();
        namespace_1.tablemapNsp.to(restaurantInterface.restaurant_id).emit('update');
        return res.sendStatus(200);
    }
    catch (err) {
        namespace_1.tablemapNsp.to(restaurantInterface.restaurant_id).emit('update');
        next(err);
    }
    ;
}));
exports.default = router;
