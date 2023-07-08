import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { createServer } from "http";
import { Server } from "socket.io";
import { connect } from "mongoose";
import bcrypt from "bcrypt";


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

export async function connectMongo(){
    try {
        await connect(
            "mongodb+srv://luiscabrera1201:5MWWtCtdtCIek3X4@coder.2kfv2rw.mongodb.net/ecommerce?retryWrites=true&w=majority"
        );
        console.log("plug to Mongo")
    } catch (e) {
        console.log(e);
        throw "can't connect to Mongo"
}
}



export const uploader = multer ({storage});

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);
