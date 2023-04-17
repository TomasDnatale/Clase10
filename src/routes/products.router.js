import { Router } from "express";
import ProductManager from "../Dao/productManager.js";

const router = Router();
const pm = new ProductManager();

// Get
router.get("/", async (req, res) => {
  const { limit } = req.query;
  try {
    const valueReturned = await pm.getProducts();
    if (valueReturned.error)
      return res.status(200).send({ status: "Sin productos", valueReturned });
    const Limitproducts = valueReturned.slice(0, limit);
    res.status(200).send({ status: "Productos", Limitproducts });
  } catch (err) {
    res.status(400).send({ status: "error router", err });
    return [];
  }
});

// Post
router.post("/", async (req, res) => {
  try {
    console.log(req.params.pid);

    const product = await pm.getProductById(req.params.pid);
    res.status(200).send({ product });
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const productSend = req.body;

    const campoVacio = Object.values(productSend).find((value) => value === "");
    console.log(campoVacio);
    if (campoVacio) {
      return res
        .status(400)
        .send({ status: "error", message: "Falta completar algún campo" });
    }
    const { title, description, price, status, thumbnail, code, stock } =
      productSend;

    const valueReturned = await pm.addProduct(
      title,
      description,
      price,
      status,
      thumbnail,
      code,
      stock
    );
    console.log(valueReturned);
    if (valueReturned.status === "error")
      return res.status(400).send({ valueReturned });
    res.status(200).send({ productSend });
  } catch (err) {
    console.log(err);
  }
});

// Post desde formulario
router.post("/", async (req, res) => {
  try {
    const productSend = req.body;

    const campoVacio = Object.values(productSend).find((value) => value === "");
    console.log(campoVacio);
    if (campoVacio) {
      return res
        .status(400)
        .send({ status: "error", message: "Falta completar algún campo" });
    }
    const { title, description, price, status, thumbnail, code, stock } =
      productSend;

    const valueReturned = await pm.addProduct(
      title,
      description,
      price,
      status,
      thumbnail,
      code,
      stock
    );
    console.log(valueReturned);
    if (valueReturned.status === "error")
      return res.status(400).send({ valueReturned });
    res.status(200).send({ productSend });
  } catch (err) {
    console.log(err);
  }
});

// Put
router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const productUpdate = req.body;

    const updateProduct = await pm.updateProduct(pid, productUpdate);
    if (!updateProduct.error) return res.status(400).send({ updateProduct });
    res.send({ updateProduct });
  } catch (err) {
    console.log(err);
  }
});

// Delete

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const response = await pm.deleteProduct(pid);
    console.log(response);
    if (!response.error) return res.status(400).send({ response });
    res.status(200).send({ response });
  } catch (err) {
    console.log(err);
  }
});

export default router;
