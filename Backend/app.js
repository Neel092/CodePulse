import express from "express";
import authRoutes from "./src/routes/auth.routes.js";
import cookieParser from "cookie-parser";
import progressRoutes from "./src/routes/progress.routes.js";
import syncRoutes from "./src/routes/sync.routes.js";
import contestRoutes from "./src/routes/contest.routes.js";
import cors from "cors";

const app = express();

// middleware FIRST
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            "http://localhost:3000", 
            "http://localhost:3001", 
            "http://localhost:3002", 
            "http://localhost:3003", 
            "http://localhost:3004",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
            "http://127.0.0.1:3002",
            "http://127.0.0.1:3003",
            "http://127.0.0.1:3004"
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://localhost:')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());


app.use(cookieParser());
app.use((req, res, next) => {
    console.log("Incoming:", req.method, req.url);
    next();
});

// routes AFTER
app.get('/', (req, res) => {
    console.log("HIT ROOT");
    res.send("This is root from app.js");
});

app.get('/api/test', (req, res) => {
    res.send("API is working correctly");
});


app.use("/api/auth", authRoutes);

app.use("/api/progress", progressRoutes);

app.use("/api/sync", syncRoutes);

app.use("/api/contests", contestRoutes);

export default app;