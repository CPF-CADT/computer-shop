import express from 'express'
import dotenv from 'dotenv'
import cros from 'cors'
import productRouter from './routes/ProductRouter';
dotenv.config();
const app = express();
app.use(cros())
app.use(express.json());


app.use('/api/product',productRouter)

const PORT =  process.env.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});