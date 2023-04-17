import express from "express";
import productRouter from "./routes/products.router.js";
import routerCar from "./routes/cart.router.js";
import handlebars from "express-handlebars";
import __dirname from "./Utils/dirname.js";

import ProductManager from "./Dao/productManager.js";
//__________________________________________________________________________________

const pm = new ProductManager();

import { Server } from "socket.io";
const app = express();

const httpServer = app.listen(8080, () => {
  console.log("Listening Port 8080");
});

const socketServer = new Server(httpServer);

app.use("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts", {});
});

socketServer.on("connection", async (socket) => {
  console.log("Client connection");
  const data = await pm.getProducts();
  socket.emit("products", { data, style: "styles.css" });

  socket.on("product", async (data) => {
    try {
      const {
        title,
        description,
        price,
        status,
        category,
        thumbnail,
        code,
        stock,
      } = data;
      console.log(data, "evaluando stock");

      const valueReturned = await pm.addProduct(
        title,
        description,
        price,
        status,
        category,
        thumbnail,
        code,
        stock
      );
      console.log(valueReturned);
    } catch (err) {
      console.log(err);
    }
  });
});
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/static", express.static("./src/public"));
app.use("/api/carts", routerCar);
app.use("/api/products", productRouter);
app.use("/", productRouter);
