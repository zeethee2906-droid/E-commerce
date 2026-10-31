import React from "react";
import { useGetProduct } from "../hook/products";
import { ShoppingCart, Package, AlertCircle } from "lucide-react";

const Products = () => {
  const { data: product, isLoading, isError } = useGetProduct();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load products.
      </div>
    );
  }

  if (!product || product.length === 0) {
    return (
      <div className="text-center py-20">
        <Package size={48} className="mx-auto text-gray-400 mb-3" />
        <h2 className="text-xl font-semibold">No Products Available</h2>
        <p className="text-gray-500 mt-2">
          Products will appear here when available.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] px-5 py-10 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest">
            Our Collection
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Discover Products
          </h1>
          <p className="text-gray-500 mt-2">
            Find the perfect products for you.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {product?.map((i) => (
            <div
              key={i.id}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative bg-gray-50 h-64 overflow-hidden">
                <img
                  src={i.image}
                  alt={i.name}
                  className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                />

                {/* Stock Badge */}
                <span
                  className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full ${
                    i.stock > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {i.stock > 0 ? `${i.stock} In Stock` : "Out of Stock"}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-900 truncate">
                  {i.name}
                </h2>

                <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2 min-h-10">
                  {i.description}
                </p>

                {/* Price & Stock */}
                <div className="flex justify-between items-center mt-5 mb-5">
                  <div>
                    <p className="text-xs text-gray-400">Price</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Number(i.price).toLocaleString()}{" "}
                      <span className="text-sm font-medium text-gray-500">
                        MMK
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-400">Availability</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {i.stock} units
                    </p>
                  </div>
                </div>

                {/* Order Button */}
                <button
                  disabled={i.stock <= 0}
                  onClick={() => console.log("Order Product:", i.id)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors duration-300"
                >
                  <ShoppingCart size={18} />
                  {i.stock > 0 ? "Order Now" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Products;