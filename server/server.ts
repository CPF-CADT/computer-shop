import express from 'express'
import dotenv from 'dotenv'
import cros from 'cors'
import productRouter from './routes/ProductRouter';
import { BrandRouter, categoryRouter,typeProducRouter } from './routes/CategoryTypeRoute';
dotenv.config();
const app = express();
app.use(cros())
app.use(express.json());


app.use('/api/product',productRouter)
app.use('/api/category',categoryRouter)
app.use('/api/type-product',typeProducRouter)
app.use('/api/brand',BrandRouter)


const PORT =  process.env.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});