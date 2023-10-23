import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  id: Number,
  nombre: String,
  detalle: String,
  precio: Number,
  code: String,
  stock: Number,
  categoria: String,
  img: String,
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model("products", productSchema);
