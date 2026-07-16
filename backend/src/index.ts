import "dotenv/config";
import express from "express";
import cors from "cors";

import fs from "node:fs";
import path from "node:path";

import { clerkMiddleware } from "@clerk/express";
import { clerkWebhookHandler } from "./webhooks/clerk";
import { getEnv } from "./lib/env";

const env = getEnv();
const app = express();

const rawJson = express.raw({ type: "application/json", limit: "1mb" });

app.post("/webhooks/clerk", rawJson, (req, res) => {
    void clerkWebhookHandler(req, res);
});

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

const publicDir = path.join(process.cwd(), "public");

if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));

    // Marshrut xatosini oldini olish uchun "app.get('*')" o'rniga "app.use" ishlatamiz
    app.use((req, res, next) => {
        // Faqat GET yoki HEAD so'rovlari uchun ishlaydi
        if (req.method !== "GET" && req.method !== "HEAD") {
            return next();
        }

        // API yoki Webhook yo'llarini o'tkazib yuboramiz
        if (req.path.startsWith("/api") || req.path.startsWith("/webhooks")) {
            return next();
        }

        // Qolgan barcha so'rovlar uchun index.html ni qaytaramiz
        res.sendFile(path.join(publicDir, "index.html"), (err) => {
            if (err) next(err);
        });
    });
}

app.listen(env.PORT, () => console.log("Listening on port:", env.PORT));