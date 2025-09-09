import { 
  Star, 
  ShoppingCart,
  Package,
  Truck,
  Shield,
  Heart,
  Share2,
  X
} from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  const handleQuantityChange = (value) => {
    if (value >= 1 && value <= productDetails?.totalStock) {
      setQuantity(value);
    }
  };

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + quantity > getTotalStock) {
          toast({
            title: `Only ${getTotalStock - getQuantity} more can be added for this item`,
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
        quantity: quantity,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: `${quantity} item(s) added to cart`,
        });
        handleDialogClose();
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
    setQuantity(1);
  }

  function handleAddReview() {
    if (!reviewMsg.trim()) {
      toast({
        title: "Please write a review before submitting",
        variant: "destructive",
      });
      return;
    }
    
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  const totalReviews = reviews?.length || 0;

  // Format price with discount information
  const isOnSale = productDetails?.salePrice > 0;
  const originalPrice = productDetails?.price;
  const salePrice = productDetails?.salePrice;
  const discountPercentage = isOnSale 
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[70vw] p-0 max-h-[95vh] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full max-h-[95vh]">
          {/* Left Column - Product Images */}
          <div className="flex flex-col h-full">
            <div className="relative h-full">
              <img
                src={productDetails?.image}
                alt={productDetails?.title}
                className="w-full h-full object-contain p-8"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 p-4 border-t">
              <Button variant="outline" size="sm" className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <DialogHeader className="p-6 pb-4">
              <div className="flex justify-between items-start">
                <DialogTitle className="text-2xl font-bold">
                  {productDetails?.title}
                </DialogTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleDialogClose}
                  className="h-8 w-8"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </DialogHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 pt-0">
              {/* Description */}
              <p className="text-muted-foreground mb-6">
                {productDetails?.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  <StarRatingComponent rating={averageReview} />
                  <span className="font-medium">{averageReview.toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground">
                  ({totalReviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                {isOnSale ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-primary">
                      ${salePrice?.toFixed(2)}
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      ${originalPrice?.toFixed(2)}
                    </span>
                    <Badge variant="destructive">
                      {discountPercentage}% OFF
                    </Badge>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    ${originalPrice?.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {productDetails?.totalStock === 0 ? (
                  <Badge variant="destructive" className="text-sm py-1">
                    <Package className="h-3 w-3 mr-1" />
                    Out of Stock
                  </Badge>
                ) : productDetails?.totalStock < 10 ? (
                  <Badge variant="destructive" className="text-sm py-1">
                    <Package className="h-3 w-3 mr-1" />
                    Only {productDetails?.totalStock} left in stock
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-sm py-1">
                    <Package className="h-3 w-3 mr-1" />
                    In Stock
                  </Badge>
                )}
              </div>

              {/* Quantity Selector */}
              {productDetails?.totalStock > 0 && (
                <div className="mb-6">
                  <Label className="mb-2 block">Quantity</Label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= productDetails?.totalStock}
                      >
                        +
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {productDetails?.totalStock} available
                    </span>
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <div className="mb-8">
                {productDetails?.totalStock === 0 ? (
                  <Button className="w-full h-12 text-base" disabled>
                    Out of Stock
                  </Button>
                ) : (
                  <Button
                    className="w-full h-12 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                    onClick={() =>
                      handleAddToCart(
                        productDetails?._id,
                        productDetails?.totalStock
                      )
                    }
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                )}
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col items-center text-center p-3 bg-muted rounded-lg">
                  <Truck className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-xs">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-muted rounded-lg">
                  <Shield className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-xs">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-muted rounded-lg">
                  <Package className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-xs">Easy Returns</span>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Reviews Section */}
              <div>
                <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
                
                {totalReviews > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((reviewItem) => (
                      <Card key={reviewItem._id} className="border-0 shadow-sm">
                        <CardHeader className="p-4 pb-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="font-medium">
                                {reviewItem?.userName?.charAt(0)?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{reviewItem?.userName}</h3>
                              <div className="flex items-center gap-1">
                                <StarRatingComponent rating={reviewItem?.reviewValue} />
                                <span className="text-sm text-muted-foreground">
                                  {reviewItem?.reviewValue}.0
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-muted-foreground">
                            {reviewItem.reviewMessage}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No reviews yet. Be the first to review this product!</p>
                  </div>
                )}

                {/* Add Review Form */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block">Your Rating</Label>
                      <div className="flex gap-1">
                        <StarRatingComponent
                          rating={rating}
                          handleRatingChange={handleRatingChange}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="review" className="mb-2 block">
                        Your Review
                      </Label>
                      <Textarea
                        id="review"
                        value={reviewMsg}
                        onChange={(event) => setReviewMsg(event.target.value)}
                        placeholder="Share your thoughts about this product..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <Button
                      onClick={handleAddReview}
                      disabled={!reviewMsg.trim() || rating === 0}
                      className="w-full"
                    >
                      Submit Review
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
