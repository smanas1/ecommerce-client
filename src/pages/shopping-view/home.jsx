import { Button } from "@/components/ui/button";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  Sparkles,
  Star,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import Carousel from "@/components/ui/carousel";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon, color: "bg-blue-500" },
  { id: "women", label: "Women", icon: CloudLightning, color: "bg-pink-500" },
  { id: "kids", label: "Kids", icon: BabyIcon, color: "bg-green-500" },
  {
    id: "accessories",
    label: "Accessories",
    icon: WatchIcon,
    color: "bg-purple-500",
  },
  {
    id: "footwear",
    label: "Footwear",
    icon: UmbrellaIcon,
    color: "bg-yellow-500",
  },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt, color: "bg-red-500" },
  { id: "adidas", label: "Adidas", icon: WashingMachine, color: "bg-black" },
  { id: "puma", label: "Puma", icon: ShoppingBasket, color: "bg-yellow-500" },
  { id: "levi", label: "Levi's", icon: Airplay, color: "bg-indigo-500" },
  { id: "zara", label: "Zara", icon: Images, color: "bg-pink-500" },
  { id: "h&m", label: "H&M", icon: Heater, color: "bg-blue-500" },
];

function ShoppingHome() {
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  // Extract image URLs for the carousel
  const carouselImages = featureImageList?.map((item) => item.image) || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Carousel Slider at the top */}
      <div className="mx-4 mt-4">
        {carouselImages.length > 0 ? (
          <Carousel images={carouselImages} />
        ) : (
          // Fallback Hero Section with simple colors
          <div className="relative w-full h-[500px] overflow-hidden rounded-2xl bg-blue-500">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white z-10 px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Summer Collection 2024
                </h1>
                <p className="text-xl md:text-2xl mb-8">
                  Discover the latest trends in fashion
                </p>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 text-lg px-8 py-6 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => navigate("/shop/listing")}
                >
                  Shop Now <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categories Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of categories and find exactly what you're
              looking for
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categoriesWithIcon.map((categoryItem) => {
              const IconComponent = categoryItem.icon;
              return (
                <Card
                  key={categoryItem.id}
                  onClick={() =>
                    handleNavigateToListingPage(categoryItem, "category")
                  }
                  className="cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white rounded-2xl overflow-hidden group"
                >
                  <CardContent className="flex flex-col items-center justify-center p-6 relative">
                    <div
                      className={`${categoryItem.color} p-4 rounded-full mb-4 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {categoryItem.label}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular Brands
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Shop from your favorite brands with exclusive offers
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brandsWithIcon.map((brandItem, index) => {
              const IconComponent = brandItem.icon;
              return (
                <Card
                  key={brandItem.id}
                  onClick={() =>
                    handleNavigateToListingPage(brandItem, "brand")
                  }
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden group"
                >
                  <CardContent className="flex flex-col items-center justify-center p-6 relative">
                    <div
                      className={`${brandItem.color} p-3 rounded-full mb-4 text-white group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                      {brandItem.label}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Products */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Featured Products
              </h2>
              <p className="text-gray-600 mt-2">
                Handpicked selection of our best products
              </p>
            </div>
            <Button
              variant="outline"
              className="border-purple-500 text-purple-600 hover:bg-purple-50 rounded-full px-6"
              onClick={() => navigate("/shop/listing")}
            >
              View All <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.slice(0, 8).map((productItem) => (
                  <div key={productItem._id} className="group">
                    <div className="relative transition-all duration-300 transform group-hover:-translate-y-1">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
                      <div className="relative">
                        <ShoppingProductTile
                          handleGetProductDetails={handleGetProductDetails}
                          product={productItem}
                          handleAddtoCart={handleAddtoCart}
                        />
                      </div>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      </section>

      {/* Special Offer Banner with Simplified Design */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-current text-yellow-300" />
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Summer Sale Up to 70% Off
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Limited time offer on selected items. Don't miss out on these
            amazing deals!
          </p>
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg"
            onClick={() => navigate("/shop/listing")}
          >
            Shop the Sale
          </Button>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
