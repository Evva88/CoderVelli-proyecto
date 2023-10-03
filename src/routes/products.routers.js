import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
import productControl from "../controllers/products.contrelloer.js";

const productsRouter = Router();
const PM = new ProductManager();

//consigue productos
productsRouter.get("/", productControl.getProducts.bind(productControl));

//encuentra el producto por su ID
productsRouter.get("/:pid", productControl.getByID.bind(productControl));

//nuevo producto
productsRouter.post("/", productControl.addProduct.bind(productControl));

//modifica un objeto por su ID
productsRouter.put("/:pid", productControl.updateProd.bind(productControl));

//borra producto
productsRouter.delete("/:pid", productControl.deleteProd.bind(productControl));

export default productsRouter;