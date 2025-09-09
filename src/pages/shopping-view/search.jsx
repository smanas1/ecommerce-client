import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  // Initialize with search param if exists
  useEffect(() => {
    const initialKeyword = searchParams.get("keyword") || "";
    setKeyword(initialKeyword);
  }, []);

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 2) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword)).then(() => {
          setIsSearching(false);
        });
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
      setIsSearching(false);
    }
  }, [keyword, dispatch, setSearchParams]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    console.log(cartItems);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

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

  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function clearSearch() {
    setKeyword("");
    dispatch(resetSearchResults());
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  console.log(searchResults, "searchResults");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Find Your Perfect Product
        </h1>
        <p className="text-gray-600 mb-8">
          Search through our collection of {searchResults.length > 0 ? searchResults.length : "thousands of"} products
        </p>
        
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-6 pl-12 pr-12 text-lg rounded-2xl border-gray-300 focus:border-purple-500 focus:ring-purple-500 shadow-sm"
            placeholder="Search for products, brands, categories..."
          />
          {keyword && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
            >
              <XIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Search Status */}
        <div className="mt-4">
          {isSearching ? (
            <div className="flex items-center justify-center text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
              <span>Searching...</span>
            </div>
          ) : keyword && keyword.trim().length <= 2 ? (
            <p className="text-gray-500 text-sm">
              Please enter at least 3 characters to search
            </p>
          ) : null}
        </div>
      </div>

      {/* Search Results */}
      <div className="mb-6">
        {keyword && keyword.trim().length > 2 && (
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              Search Results for "<span className="text-purple-600">{keyword}</span>"
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {searchResults.length} {searchResults.length === 1 ? 'Product' : 'Products'}
            </span>
          </div>
        )}
      </div>

      {/* Results Grid */}
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((item) => (
            <div key={item._id} className="group">
              <div className="relative transition-all duration-300 transform group-hover:-translate-y-1">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
                <div className="relative">
                  <ShoppingProductTile
                    handleAddtoCart={handleAddtoCart}
                    product={item}
                    handleGetProductDetails={handleGetProductDetails}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : keyword && keyword.trim().length > 2 && !isSearching ? (
        // No Results Found
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <SearchIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            We couldn't find any products matching "{keyword}". Try adjusting your search terms.
          </p>
          <button
            onClick={clearSearch}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            Clear Search
          </button>
        </div>
      ) : keyword && keyword.trim().length <= 2 ? (
        // Empty State or Too Few Characters
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
            <SearchIcon className="h-12 w-12 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Start Your Search</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Enter a product name, brand, or category to find what you're looking for.
          </p>
        </div>
      ) : (
        // Default State
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
            <SearchIcon className="h-12 w-12 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Search Our Collection</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Find exactly what you're looking for from our extensive product catalog.
          </p>
        </div>
      )}

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;