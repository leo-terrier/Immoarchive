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
exports.queryDataBase = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const mysql2_1 = require("mysql2");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '.env') });
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    decimalNumbers: true
});
pool.getConnection()
    .then(() => {
    // eslint-disable-next-line no-console
    console.log('Can reach database');
})
    .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
});
function queryDataBase(query, values = []) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parametrizedQuery = (0, mysql2_1.format)(query, values);
            //console.log(parametrizedQuery)
            const [data] = yield pool.query(parametrizedQuery);
            return data;
        }
        catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
        }
    });
}
exports.queryDataBase = queryDataBase;
