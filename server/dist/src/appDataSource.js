"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
const Updoot_1 = require("./entities/Updoot");
const path_1 = __importDefault(require("path"));
const constant_1 = require("./constant");
let portNumber = Number(process.env.DATABASE_PORT);
exports.dataSource = new typeorm_1.DataSource({
    type: "postgres",
    port: portNumber,
    url: process.env.DATABASE_URL,
    synchronize: !constant_1.__prod__,
    logging: !constant_1.__prod__,
    migrations: [path_1.default.join(__dirname, "./migrations/*")],
    entities: [Post_1.Post, User_1.User, Updoot_1.Updoot],
});
//# sourceMappingURL=appDataSource.js.map