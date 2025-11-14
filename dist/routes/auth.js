"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authService_1 = require("../services/authService");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/signup", async (req, res, next) => {
    try {
        const { email, password, tenantName } = req.body;
        const result = await (0, authService_1.signup)({ email, password, tenantName });
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.authRouter.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await (0, authService_1.login)({ email, password });
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=auth.js.map