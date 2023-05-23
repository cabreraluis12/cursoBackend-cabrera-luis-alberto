import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { createServer } from "http";
import { Server } from "socket.io";



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

export const uploader = multer ({storage});
