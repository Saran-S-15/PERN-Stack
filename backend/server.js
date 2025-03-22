import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { isSpoofedBot } from "@arcjet/inspect";

import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet()); //helmet is a security middleware that helps you protect your app by setting various HTTP headers
app.use(morgan("dev")); //log the requests

app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 1 });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ error: "Too Many Requests" });
            } else if (decision.reason.isBot()) {
                return res.status(403).json({ error: "No bots allowed" });
            } else {
                return res.status(403).json({ error: "Forbidden" });
            }
        }

        if (decision.results.some(isSpoofedBot)) {
            return res.status(403).json({ error: "Forbidden" });
        }

        next();
    } catch (error) {
        console.error("Error in protection middleware:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.use("/api/products", productRoutes);

async function initDb() {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
        console.log("POSTGREL Database Connected");
    } catch (error) {
        console.log("Error connecting to Database", error);
    }
}

initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on the PORT: ${PORT}`);
    });
})