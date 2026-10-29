import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import cloudinary from "../../config/cloudinary";

export const getProduct = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  res.status(200).json(products);
};


export const postProduct = async (
  req: Request,
  res: Response,
) => {
  try {
    const { name, description, price, stock } = req.body;
    const image = req.file;

    // Debug: စစ်ဆေးရန်
    console.log("Body:", req.body);
    console.log("Image:", image?.originalname);
    console.log("Image size:", image?.size);
    console.log("Buffer length:", image?.buffer?.length);

    // 1. ပုံရှိမရှိ အရင်စစ်မယ်
    if (!image || !image.buffer || image.buffer.length === 0) {
      return res.status(400).json({
        message: "Image file is missing or empty",
      });
    }

    // 2. Fields တွေ စစ်မယ်
    if (
      !name ||
      !description ||
      price === undefined ||
      price === "" ||
      stock === undefined ||
      stock === ""
    ) {
      return res.status(400).json({
        message: "Fill all fields",
      });
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0 ||
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      return res.status(400).json({
        message: "Invalid price or stock",
      });
    }

    // 3. Cloudinary ကို Upload လုပ်မယ်
    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "note-web/products",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }

            if (!result) {
              return reject(new Error("Image upload failed"));
            }

            resolve(result);
          },
        );

        stream.end(image.buffer);
      },
    );

    // 4. URL ကို Database ထဲ သိမ်းမယ်
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: numericPrice,
        stock: numericStock,
        image: result.secure_url,
      },
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Product creation error:", error);

    return res.status(500).json({
      message: "Failed to create product",
    });
  }
};
