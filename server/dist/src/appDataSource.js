"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
require("dotenv-safe/config");
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
let portNumber = Number(process.env.DATABASE_PORT);
console.log(typeof portNumber);
exports.dataSource = new typeorm_1.DataSource({
    type: "postgres",
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME_PREFIX,
    synchronize: true,
    logging: true,
    entities: [Post_1.Post, User_1.User],
});
//# sourceMappingURL=appDataSource.js.map