import express from "express";
import upload from "../middlewares/upload.js";
import { createProduct, getProducts, updateProduct, deleteProduct } from "../controllers/productController.js";

const router = express.Router();

router.post("/", upload.array("images", 3), createProduct);
router.get("/", getProducts);

router.put("/:id", upload.array("images", 3), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
