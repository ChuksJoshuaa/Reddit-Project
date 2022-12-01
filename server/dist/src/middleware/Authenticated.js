"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticated = void 0;
const Authenticated = ({ context }, next) => {
    if (!context.req.session.userId) {
        throw new Error("Not unathenticated");
    }
    return next();
};
exports.Authenticated = Authenticated;
//# sourceMappingURL=Authenticated.js.map