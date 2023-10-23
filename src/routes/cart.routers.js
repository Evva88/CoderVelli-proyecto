import { Router } from "express";
import CartManager from "../dao/cartManager.js";
import cartsController from "../controllers/cart.controller.js";
import { authorization, passportCall } from "../midsIngreso/passAuth.js";

const cartsRouter = Router();
const CM = new CartManager();

cartsRouter.post("/", cartsController.createCart.bind(cartsController));

cartsRouter.get("/:cid", cartsController.getCart.bind(cartsController));

cartsRouter.post("/:cid/products/:pid", passportCall('jwt'), authorization(['user']), cartsController.addProductToCart.bind(cartsController));

cartsRouter.put("/:cid/products/:pid", cartsController.updateQuantityProductFromCart.bind(cartsController));

cartsRouter.put("/:cid", cartsController.updateCart.bind(cartsController));

cartsRouter.delete("/:cid/products/:pid", cartsController.deleteProductFromCart.bind(cartsController));

cartsRouter.delete("/:cid", cartsController.deleteProductsFromCart.bind(cartsController));

cartsRouter.post("/:cid/purchase", (req, res, next) => {
    console.log('Ruta de compra accedida');
    next();
  }, passportCall("jwt"), cartsController.createPurchaseTicket.bind(cartsController));


export default cartsRouter;