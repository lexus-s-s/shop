import express from "express";
import cors from "cors";
import productsRouter from './routes/products.routes.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", productsRouter)

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(3000, () => {
    console.log("Сервер запущен на http://localhost:3000");
});