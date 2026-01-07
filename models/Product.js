import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  company: String,

  price: {
    min: Number,
    max: Number,
  },

  category: String,
  description: String,

  images: [
    {
      url: String,
      public_id: String,
    },
  ],
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
