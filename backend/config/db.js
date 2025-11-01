import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

export default async function connectDB () {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connection error", error);
        process.exit(1);
    }
}