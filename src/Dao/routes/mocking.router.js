import express from "express";
import { generateMockProducts } from "../../utils.js";

export const routerMock = express.Router();

routerMock.get("/", (req, res) => {
  const mockProducts = generateMockProducts(100);
  res.status(200).json(mockProducts);
});

