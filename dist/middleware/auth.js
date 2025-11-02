"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.authenticate = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const jwt_1 = require("../utils/jwt");
const authenticate = (context) => {
    if (!context.user) {
        throw new apollo_server_express_1.AuthenticationError("Non authentifié");
    }
    return context.user;
};
exports.authenticate = authenticate;
const getUser = (token) => {
    if (!token)
        return null;
    try {
        // Enlever "Bearer " si présent
        const cleanToken = token.replace("Bearer ", "");
        return (0, jwt_1.verifyToken)(cleanToken);
    }
    catch (error) {
        return null;
    }
};
exports.getUser = getUser;
