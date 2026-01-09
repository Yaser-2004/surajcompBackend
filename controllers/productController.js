import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// export const createProduct = async (req, res) => {
//   try {
//     console.log(req.body);
//     const product = await Product.create({
//       name: req.body.name,
//       company: req.body.company,
//       price: {
//         min: req.body.minPrice,
//         max: req.body.maxPrice,
//       },
//       category: req.body.category,
//       description: req.body.description,
//       image: {
//         url: req.file.path,
//         public_id: req.file.filename,
//       },
//     });

//     res.status(201).json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const createProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const images = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    const product = await Product.create({
      name: req.body.name,
      company: req.body.company,
      price: {
        min: req.body.minPrice,
        max: req.body.maxPrice,
      },
      category: req.body.category,
      description: req.body.description,
      images,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const { category, search } = req.query;

    // 🔹 Build filter query
    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// export const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product)
//       return res.status(404).json({ message: "Product not found" });

//     // If new image uploaded → delete old one
//     if (req.file) {
//       if (product.image?.public_id) {
//         await cloudinary.uploader.destroy(product.image.public_id);
//       }

//       product.image = {
//         url: req.file.path,
//         public_id: req.file.filename,
//       };
//     }

//     product.name = req.body.name ?? product.name;
//     product.category = req.body.category ?? product.category;
//     product.description = req.body.description ?? product.description;
//     product.company = req.body.company ?? product.company;

//     product.price = {
//       min: req.body.minPrice ?? product.price.min,
//       max: req.body.maxPrice ?? product.price.max,
//     };

//     const updatedProduct = await product.save();
//     res.json(updatedProduct);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // If new images uploaded → delete old ones
    if (req.files && req.files.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      product.images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    product.name = req.body.name ?? product.name;
    product.category = req.body.category ?? product.category;
    product.description = req.body.description ?? product.description;
    product.company = req.body.company ?? product.company;

    product.price = {
      min: req.body.minPrice ?? product.price.min,
      max: req.body.maxPrice ?? product.price.max,
    };

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// export const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product)
//       return res.status(404).json({ message: "Product not found" });

//     if (product.image?.public_id) {
//       await cloudinary.uploader.destroy(product.image.public_id);
//     }

//     await product.deleteOne();
//     res.json({ message: "Product deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    for (const img of product.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


