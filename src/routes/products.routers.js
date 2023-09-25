import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
import { socketServer } from "../../app.js";

const productsRouter = Router();
const PM = new ProductManager();

productsRouter.get("/", async (req, res) => {
  try {
    let queryObj = {};
    if (req.query.query) {
      try {
        queryObj = JSON.parse(req.query.query);
      } catch (err) {
        return res.status(400).send({ status: "error", message: "Invalid query format." });
      }
    }

    const params = {
      ...req.query,
      query: queryObj,
    };

    const products = await PM.getProducts(params);
    res.send(products);
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", message: "Error fetching products." });
    console.log(error);
  }
});

productsRouter.get("/:pid", async (req, res) => {
  console.log("Accessing product detail route...");
  try {
    const pid = req.params.pid;
    console.log("Product ID:", pid);
    const product = await PM.getProductById(pid);
    if (product) {
      console.log("Found product, rendering...");
      res.render("productDetail", { product });
    } else {
      console.log("Product not found!");
      res.status(404).send({ status: "error", message: "Product not found." });
    }
  } catch (error) {
    console.error("Error fetching product by id:", error);
    res
      .status(500)
      .send({ status: "error", message: "Error fetching product by id." });
  }
});

productsRouter.post("/", async (req, res) => {
  let { nombre, detalle, code, precio, status, stock, categoria, img } = req.body;
  console.log("Received thumbnail:", img);

  if (!nombre) {
    res.status(400).send({ status: "error", message: "Error! No se cargó el campo Nombre!" });
    return false;
  }

  if (!detalle) {
    res.status(400).send({ status: "error", message: "Error! No se cargó el campo Detalle!"});
    return false;
  }

  if (!code) {
    res.status(400).send({ status: "error", message: "Error! No se cargó el campo Code!" });
    return false;
  }

  if (!precio) {
    res.status(400).send({ status: "error", message: "Error! No se cargó el campo Precio!" });
    return false;
  }

  status = !status && true;

  if (!stock) {
    res.status(400).send({ status: "error", message: "Error! No se cargó el campo Stock!" });
    return false;
  }

  if (!categoria) {
    res.status(400).send({status: "error",message: "Error! No se cargó el campo Categoria!"});
    return false;
  }

  if (!img) {
    res.status(400).send({status: "error",message: "Error! No se cargó el campo Imagen!",});
    return false;
  }
  try {
    const wasAdded = await PM.addProduct({nombre,detalle,code,precio,status,stock,categoria,img});

    if (wasAdded && wasAdded._id) {
      res.send({status: "ok",message: "El Producto se agregó correctamente!"});
      socketServer.emit("product_created", { _id: wasAdded._id,nombre,detalle,code,precio,status,stock,categoria,img});
    } else {
      res.status(500).send({status: "error", message: "Error! No se pudo agregar el Producto!"});
    }
  } catch (error) {
    res.status(500).send({ status: "error", message: "Internal server error." });
  }
});


productsRouter.put("/:pid", async (req, res) => {
  let { nombre, detalle, code, precio, status, stock, categoria, img } = req.body;

  try {
    const pid = req.params.pid;
    const wasUpdated = await PM.updateProduct(pid, {nombre,detalle,code,precio,status,stock,categoria,img});
    if (wasUpdated) {
      res.send({status: "ok",message: "El Producto se actualizó correctamente!"});
      socketServer.emit("product_updated");
    } else {
      res.status(500).send({status: "error",message: "Error! No se pudo actualizar el Producto!"});
    }
  } catch (error) {
    res.status(500).send({ status: "error", message: "Internal server error." });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  let pid = req.params.pid;

  const wasDeleted = await PM.deleteProduct(pid);

  if (wasDeleted) {
    res.send({status: "ok",message: "El Producto se eliminó correctamente!"});
    socketServer.emit("product_deleted", { _id: pid });
  } else {
    res.status(500).send({status: "error",message: "Error! No se pudo eliminar el Producto!"});
  }
});

export default productsRouter;
