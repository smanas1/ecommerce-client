/* eslint-disable react/prop-types */
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[250px] object-cover"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-xs py-1 px-2 rounded-full">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600 text-xs py-1 px-2 rounded-full">
              {`Only ${product?.totalStock} left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-xs py-1 px-2 rounded-full">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-2 text-gray-800 line-clamp-1">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-sm text-gray-600">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through text-gray-500" : "text-lg font-bold text-purple-600"
              }`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold text-purple-600">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-4 pt-0">
        {product?.totalStock === 0 ? (
          <Button 
            className="w-full opacity-60 cursor-not-allowed rounded-xl py-5 font-medium" 
            disabled
          >
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddtoCart(product?._id, product?.totalStock);
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl py-5 font-medium transition-all duration-300 transform hover:scale-[1.02]"
          >
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;