"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expressError_1 = require("./expressError");
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const messages_1 = __importDefault(require("./routes/messages"));
const court_locations_1 = __importDefault(require("./routes/court_locations"));
const auth_2 = require("./middleware/auth");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*", // Allows requests from any origin (for development)
}));
app.use(express_1.default.json());
app.use(auth_2.authenticateJWT);
app.use('/auth', auth_1.default);
app.use('/users', users_1.default);
app.use('/messages', messages_1.default);
app.use('/court_locations', court_locations_1.default);
/** Handle 404 errors -- this matches everything */
app.use((req, res, next) => {
    return next(new expressError_1.NotFoundError());
});
/** Generic error handler; anything unhandled goes here. */
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== "test")
        console.error(err.stack);
    const status = err.status || 500;
    let message;
    if (err.error) {
        message = err.error;
    }
    else {
        message = err.stack;
    }
    res.status(status).json({
        error: { message, status },
    });
});
exports.default = app;
