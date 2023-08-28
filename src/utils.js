import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { createServer } from "http";
import { Server } from "socket.io";
import { connect } from "mongoose";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';

dotenv.config();


export const __filename = fileURLToPath (import.meta.url);
export const __dirname = path.dirname (__filename);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + "/public/");
    },
    filename:(req, file, cb) => {
        cb(null, file.originalname);
    },
});


export async function connectMongo() {
    try {
        const mongoURI = process.env.MONGO_DB_URI;
        if (!mongoURI) {
            throw new Error('MongoDB URI not found in .env file');
        }

        await connect(mongoURI);
        console.log('Connected to MongoDB');
    } catch (e) {
        console.error(e);
        throw new Error("Can't connect to MongoDB");
    }
}



export const uploader = multer ({storage});

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);



export const generateMockProducts = (count) => {
    const mockProducts = [];
    for (let i = 1; i <= count; i++) {
      mockProducts.push({
        id: i,
        name: `Product ${i}`,
        price: Math.random() * 100,
      });
    }
    return mockProducts;
  };