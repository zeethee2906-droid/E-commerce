import type { Request, Response } from "express";
import type { OrderItem } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export const createOrder = async (
  req: Request<{}, {}, { shippingAddress: string; items: OrderItem[] }>,
  res: Response,
) => {
  const userId = req.user.id;
  const { shippingAddress, items } = req.body;

  if (!shippingAddress || !items) {
    return res.status(400).json({ message: "Fill all fields" });
  }

  for (const item of items) {
    if (
      !Number.isInteger(item.productId) ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      return res.status(400).json({ message: "Invalid product or quantity" });
    }
  }

  const productIds = items.map((i) => i.productId);

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
    },
  });

  if (products.length !== new Set(productIds).size) {
    return res.status(404).json({ message: "Products not found" });
  }

  let totalAmount = 0;

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)!;
    if (product.stock < item.quantity) {
      return res
        .status(400)
        .json({ message: `${product.name} is out of stock` });
    }
    totalAmount += Number(product.price) * item.quantity;
  }

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        shippingAddress,
        totalAmount,
        items: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            return {
              productId: product.id,
              quantity: item.quantity,
              price: product.price,
            };
          }),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }
    return newOrder;
  });

  return res.status(201).json({message:"Success order",order})
};
