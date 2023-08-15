import dotenv from "dotenv";

dotenv.config();

const config = {
  databaseURL: process.env.DATABASE_URL,
  secretKey: process.env.SECRET_KEY,
};

export default config;