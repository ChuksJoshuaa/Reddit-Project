"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("./constant");
const Post_1 = require("./entities/Post");
const path_1 = __importDefault(require("path"));
require("dotenv-safe/config");
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post_1.Post],
    dbName: process.env.DATABASE_URL,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    debug: !constant_1.__prod__,
    type: "postgresql",
    allowGlobalContext: !constant_1.__prod__,
};
//# sourceMappingURL=mikro-orm.config.js.map