import express from "express";
import Handlebars from "handlebars";
import expressHandlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cartsRouter from "./src/routes/cart.routers.js";
import productsRouter from "./src/routes/products.routers.js";
import sessionsRouter from "./src/routes/session.routers.js";
import viewsRouter from "./src/routes/views.routers.js";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import initializePassport from "./src/midsIngreso/passport.js"
import initializeGitHubPassport from "./src/midsIngreso/github.js";
import passport from "passport";
import cookieParser from "cookie-parser";
//import { errorHandler } from "./src/errors/errorHandler.js";
import { MONGODB_CNX_STR, PORT  } from "./src/config/configs.js"


const app = express();


const connection = mongoose.connect(MONGODB_CNX_STR,({
  useNewUrlParser: true,
  useUnifiedTopology: true
}))


const httpServer = app.listen(PORT, () => {console.log(`conectado a ${PORT}`)})
export const socketServer = new Server(httpServer);

app.set("socketServer", socketServer);


app.engine(
  "handlebars",
  expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname));

app.use(cookieParser());

app.use(session({
  store: new MongoStore({
      mongoUrl: MONGODB_CNX_STR,
      collectionName:"sessions",
      ttl: 3600
  }),
  secret: "CARAMELO_DE_LIMON",
  resave: false,
  saveUninitialized: false,
  cookie: {secure:false}
}))
initializeGitHubPassport();    
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname+"/src/public"));
app.use("/images", express.static(__dirname+ "/src/public/images"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/api/sessions/", sessionsRouter);
app.use("/", viewsRouter);


import ProductManager from "./src/dao/ProductManager.js";
const PM = new ProductManager();

import MessagesManager from "./src/dao/messagesmanager.js";
const MM = new MessagesManager();

import CartManager from "./src/dao/cartManager.js";
const CM = new CartManager();

socketServer.on("connection", async (socket) => {
  console.log("Un cliente conectado");

  const allProducts = await PM.getProducts();
  socket.emit("initial_products", allProducts);

  socket.on("addProduct", async(obj)=>{
    await PM.addProduct(obj);
    const listadeproductos = await PM.getProductsViews();
    socketServer.emit("envioDeProductos", listadeproductos);    
});

  socket.on("deleteProduct",async(id)=>{
    console.log(id);
    const listadeproductos=await PM.getProductsViews();
    
    await PM.deleteProduct(id);
    
    socketServer.emit("envioDeProducts", listadeproductos);
    });

  socket.on("eliminarProducto", (data)=>{
    PM.deleteProduct(parseInt(data));
    const listadeproductos = PM.getProducts();
    socketServer.emit("envioDeProducts", listadeproductos);
  });

  socket.on("nuevoUsuario",(usuario)=>{
    console.log("usuario", usuario);
    socket.broadcast.emit("broadcast", usuario);
    });

  socket.on("disconnet", ()=>{
    console.log("Usuario desconectado");
    });

  socket.on("mensaje", async (info) =>{
    console.log(info);
    await MM.createMessage(info);
    socketServer.emit("chat", await MM.getMessages());
});
});



