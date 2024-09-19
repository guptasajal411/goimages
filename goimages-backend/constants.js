import dotenv from "dotenv";
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const ORIGIN1 = process.env.ORIGIN1;
export const ORIGIN2 = process.env.ORIGIN2;
export const PORT = process.env.PORT;