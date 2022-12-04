"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticated = void 0;
const apollo_server_1 = require("apollo-server");
const Authenticated = ({ context }, next) => {
    if (!context.req.session.userId) {
        throw new apollo_server_1.AuthenticationError("You must be logged in");
    }
    return next();
};
exports.Authenticated = Authenticated;
//# sourceMappingURL=Authenticated.js.map