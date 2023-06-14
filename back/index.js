"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const getDeals_1 = require("./getDeals");
const validatorMiddleware_1 = require("./validatorMiddleware");
exports.app = (0, express_1.default)();
dotenv_1.default.config();
exports.app.use((0, cors_1.default)());
const port = process.env.PORT;
exports.app.get('/deals', validatorMiddleware_1.validators, validatorMiddleware_1.checkValidators, getDeals_1.getDeals);
if (process.env.CLOUD_FUNCTION === 'false') {
    exports.app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}
