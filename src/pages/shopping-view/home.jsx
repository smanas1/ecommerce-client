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
    <div className="flex  flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] overflow-hidden">
        <div className="relative w-full h-full">
          <Carousel images={carouselImages} />
          {/* Overlay for better text readability when carousel is active */}
          {carouselImages.length > 0 && (
            <div className="absolute inset-0 bg-black/30"></div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-purple-100 text-purple-600 px-4 py-1 rounded-full text-sm font-medium">
                Shop by Category
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Browse Our Collections
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of categories and find exactly what you're
              looking for
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categoriesWithIcon.map((categoryItem, index) => {
              const IconComponent = categoryItem.icon;
              return (
                <Card
                  key={categoryItem.id}
                  onClick={() =>
                    handleNavigateToListingPage(categoryItem, "category")
                  }
                  className="cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white rounded-2xl overflow-hidden group shadow-lg"
                >
                  <CardContent className="flex flex-col items-center justify-center p-6 relative">
                    <div
                      className={`${categoryItem.color} p-4 rounded-full mb-4 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                      {categoryItem.label}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div className="mb-6 md:mb-0">
              <div className="inline-block mb-2">
                <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
                  Trending Now
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600">
                Handpicked selection of our best products
              </p>
            </div>
            <Button
              variant="outline"
              className="border-purple-500 text-purple-600 hover:bg-purple-50 rounded-full px-6 py-2 font-medium"
              onClick={() => navigate("/shop/listing")}
            >
              View All Products <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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

      {/* Special Offer Banner */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-8 h-8 fill-current text-yellow-300 mx-1"
              />
            ))}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Summer Sale Up to 70% Off
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Limited time offer on selected items. Don't miss out on these
            amazing deals!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg font-bold"
              onClick={() => navigate("/shop/listing")}
            >
              Shop the Sale
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg font-bold"
              onClick={() => navigate("/shop/listing")}
            >
              View All Deals
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-sm font-medium">
                Trusted Brands
              </span>
            </div>
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
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white rounded-2xl overflow-hidden group shadow-md"
                >
                  <CardContent className="flex flex-col items-center justify-center p-6 relative">
                    <div
                      className={`${brandItem.color} p-3 rounded-full mb-4 text-white group-hover:scale-110 transition-transform duration-300 shadow-md`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors text-sm">
                      {brandItem.label}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-4">
              <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-medium">
                Stay Updated
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Our Newsletter
            </h2>
            <p className="text-gray-600 mb-8">
              Subscribe to get special offers, free giveaways, and new product
              alerts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 py-3 font-medium whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
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
