import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./src/config/db.config.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

console.log("PORT:", PORT);
console.log("Attempting to connect to MongoDB...");
connectDB()
    .then(() => {
        console.log(" MongoDB connected successfully");

        app.on("error", (error) => {
            console.error(" app connection failed : ", error);
        })

        console.log("Starting express server...");
        app.listen(PORT, () => {
            console.log(` Server is running at port : ${PORT}`);
        })
    })
    .catch((error) => {
        console.error("DB connection problem in index.js file : ", error);
        process.exit(1);
    });


