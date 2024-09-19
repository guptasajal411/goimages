import { Router } from "express";
import { uploadFiles } from "../controllers/uploadController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import multer from "multer";

const router = Router();
const upload = multer();

router.post("/", isAuthenticated, upload.array("files"), uploadFiles);

export default router;