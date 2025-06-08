"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const ProductRouter_1 = __importDefault(require("./routes/ProductRouter"));
const CategoryTypeRoute_1 = require("./routes/CategoryTypeRoute");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/product', ProductRouter_1.default);
app.use('/api/category', CategoryTypeRoute_1.categoryRouter);
app.use('/api/type-product', CategoryTypeRoute_1.typeProducRouter);
app.use('/api/brand', CategoryTypeRoute_1.BrandRouter);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
