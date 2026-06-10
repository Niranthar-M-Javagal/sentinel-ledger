"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fraud_service_1 = require("../services/fraud.service");
const router = express_1.default.Router();
router.get("/fraud-events", async (_req, res) => {
    try {
        const events = await (0, fraud_service_1.getFraudEvents)();
        return res.json(events);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});
exports.default = router;
