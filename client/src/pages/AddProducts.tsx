
import { useEffect, useState } from "react";
import {
  ImagePlus,
  Package,
  Tag,
  FileText,
  DollarSign,
  X,
} from "lucide-react";
import type { FormEvent } from "react";
import { useAddProduct } from "../hook/auth";
import toast from "react-hot-toast";

const AddProducts = () => {
  const { mutate: product, isPending } = useAddProduct();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  // Create and clean up the image preview URL.
  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const imageUrl = URL.createObjectURL(image);
    setPreview(imageUrl);

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [image]);

  const resetForm = () => {
    setName("");
    setPrice("");
    setStock("");
    setDescription("");
    setImage(null);

    const fileInput = document.getElementById(
      "product-image",
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select a product image");
      return;
    }

    if (!name.trim() || !description.trim() || !price || !stock) {
      toast.error("Please fill in all fields");
      return;
    }

    const priceNumber = Number(price);
    const stockNumber = Number(stock);

    if (!Number.isFinite(priceNumber) || priceNumber < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (
      !Number.isInteger(stockNumber) ||
      stockNumber < 0
    ) {
      toast.error("Stock must be a non-negative whole number");
      return;
    }

    // FormData is required for multipart image uploads.
    const formData = new FormData();

    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("image", image);

    product(formData, {
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            "Failed to add product. Please try again.",
        );
      },

      onSuccess: (response: any) => {
        toast.success(
          response?.data?.message || "Product added successfully",
        );

        resetForm();
      },
    });
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a PNG, JPG, or WEBP image");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      e.target.value = "";
      return;
    }

    setImage(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-gray-800 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <p className="mb-2 text-sm text-gray-500">
            Products / Add Product
          </p>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Add New Product
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter your product details and upload an image.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Product Information */}
            <div className="space-y-6 lg:col-span-2">
              <h2 className="border-b border-gray-200 pb-4 text-lg font-semibold">
                Product Information
              </h2>

              {/* Product Name */}
              <div>
                <label
                  htmlFor="product-name"
                  className="mb-2 block text-sm font-medium"
                >
                  Product Name{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 focus-within:border-gray-600 focus-within:ring-2 focus-within:ring-gray-200">
                  <Tag size={18} className="text-gray-400" />

                  <input
                    id="product-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product name"
                    required
                    maxLength={150}
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="product-price"
                    className="mb-2 block text-sm font-medium"
                  >
                    Price ($){" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 focus-within:border-gray-600 focus-within:ring-2 focus-within:ring-gray-200">
                    <DollarSign
                      size={18}
                      className="text-gray-400"
                    />

                    <input
                      id="product-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      required
                      className="w-full bg-transparent py-3 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="product-stock"
                    className="mb-2 block text-sm font-medium"
                  >
                    Stock Quantity{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 focus-within:border-gray-600 focus-within:ring-2 focus-within:ring-gray-200">
                    <Package
                      size={18}
                      className="text-gray-400"
                    />

                    <input
                      id="product-stock"
                      type="number"
                      min="0"
                      step="1"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="Enter stock quantity"
                      required
                      className="w-full bg-transparent py-3 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="product-description"
                  className="mb-2 block text-sm font-medium"
                >
                  Description{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="rounded-lg border border-gray-300 p-3 focus-within:border-gray-600 focus-within:ring-2 focus-within:ring-gray-200">
                  <div className="mb-2 flex items-center gap-2 text-gray-400">
                    <FileText size={18} />
                    <span className="text-xs">
                      Product details
                    </span>
                  </div>

                  <textarea
                    id="product-description"
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Describe your product..."
                    rows={6}
                    maxLength={1000}
                    required
                    className="w-full resize-y bg-transparent outline-none"
                  />

                  <p className="text-right text-xs text-gray-400">
                    {description.length}/1000
                  </p>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h2 className="border-b border-gray-200 pb-4 text-lg font-semibold">
                Product Image
              </h2>

              <label
                htmlFor="product-image"
                className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:border-gray-500 hover:bg-gray-100"
              >
                <ImagePlus
                  size={40}
                  className="mb-3 text-gray-500"
                />

                <span className="font-medium">
                  Click to upload image
                </span>

                <span className="mt-2 text-sm text-gray-500">
                  PNG, JPG, WEBP (Max 5MB)
                </span>

                <input
                  id="product-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>

              {/* Image Preview */}
              <div>
                {preview ? (
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-2">
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);

                        const input = document.getElementById(
                          "product-image",
                        ) as HTMLInputElement | null;

                        if (input) input.value = "";
                      }}
                      aria-label="Remove image"
                      className="absolute right-3 top-3 z-10 rounded-full bg-gray-800 p-1.5 text-white hover:bg-black"
                    >
                      <X size={16} />
                    </button>

                    <img
                      src={preview}
                      alt="Product preview"
                      className="h-56 w-full rounded-lg object-contain"
                    />

                    <p className="truncate px-2 py-2 text-sm text-gray-500">
                      {image?.name}
                    </p>
                  </div>
                ) : (
                  <div className="flex h-56 flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-400">
                    <ImagePlus size={36} />
                    <p className="mt-3 text-sm">
                      Image preview
                    </p>
                  </div>
                )}
              </div>

              <p className="text-xs leading-5 text-gray-500">
                Upload a clear product image so customers can
                see your item.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={resetForm}
              disabled={isPending}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-gray-700 px-7 py-3 font-medium text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Adding Product..." : "+ Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
