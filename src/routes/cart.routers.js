import { Router } from "express";
import CartManager from "../dao/cartManager.js";
import cartsControl from "../controllers/cart.controller.js";

const cartsRouter = Router();
const CM = new CartManager();

//nuevo carrito
cartsRouter.post("/", cartsControl.createNewCart.bind(cartsControl));

//busca carrito por su ID
cartsRouter.get("/:cid", cartsControl.getThisCart.bind(cartsControl));

//agrega el producto 
cartsRouter.post("/:cid/products/:pid", cartsControl.addProduct.bind(cartsControl));

//producto actualizado por su ID
cartsRouter.put("/:cid/products/:pid", cartsControl.updateQuantity.bind(cartsControl));

//elimina el producto 
cartsRouter.delete("/:cid/products/:pid", cartsControl.deleteThisProduct.bind(cartsControl));

//vacia 
cartsRouter.delete("/:cid", cartsControl.cleanCart.bind(cartsControl));
export default cartsRouter;
