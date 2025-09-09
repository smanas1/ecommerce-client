import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";

import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import {
  Calendar,
  CreditCard,
  Package,
  Truck,
  MapPin,
  Phone,
  User,
  Hash,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case "delivered":
        return "success";
      case "confirmed":
        return "default";
      case "inProcess":
        return "secondary";
      case "inShipping":
        return "outline";
      case "pending":
        return "warning";
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "inProcess":
        return <Clock className="h-4 w-4" />;
      case "inShipping":
        return <Truck className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Calculate subtotal
  const subtotal =
    orderDetails?.cartItems?.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0) || 0;

  // Calculate total items
  const totalItems =
    orderDetails?.cartItems?.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0) || 0;

  // Handle re-payment
  const handleRePay = () => {
    // This would typically integrate with your payment system
    // For now, we'll just show an alert

    window.location.replace(orderDetails?.paymentURL);
  };

  return (
    <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
      </DialogHeader>

      <div className="overflow-y-auto max-h-[70vh] pr-2">
        <div className="grid gap-6 py-2">
          {/* Order Summary Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Hash className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Order ID
                </span>
                <span className="font-medium">
                  #{orderDetails?._id?.slice(-8)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Order Date
                </span>
                <span className="font-medium">
                  {formatDate(orderDetails?.orderDate)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Method
                </span>
                <span className="font-medium capitalize">
                  {orderDetails?.paymentMethod}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Payment Status
                </span>
                <span className="font-medium capitalize">
                  {orderDetails?.paymentStatus}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg md:col-span-2">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Order Status
                </span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(orderDetails?.orderStatus)}
                  <Badge variant={getStatusVariant(orderDetails?.orderStatus)}>
                    {orderDetails?.orderStatus?.charAt(0).toUpperCase() +
                      orderDetails?.orderStatus?.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Order Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                Order Items ({totalItems} items)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? (
                orderDetails?.cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="bg-muted rounded-lg w-16 h-16 flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3" />
                  <p>No items found in this order</p>
                </div>
              )}

              {/* Order Total */}
              <div className="mt-6 pt-4 border-t space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatCurrency(orderDetails?.totalAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Shipping Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{user?.userName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">
                    {orderDetails?.addressInfo?.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg md:col-span-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">
                    {orderDetails?.addressInfo?.address}
                  </p>
                  <p className="font-medium">
                    {orderDetails?.addressInfo?.city},{" "}
                    {orderDetails?.addressInfo?.pincode}
                  </p>
                </div>
              </div>
              {orderDetails?.addressInfo?.notes && (
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg md:col-span-2">
                  <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Delivery Notes
                    </p>
                    <p className="font-medium">
                      {orderDetails?.addressInfo?.notes}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Re-pay Button - Show for pending payments, failed payments, or cancelled orders */}
          {(orderDetails?.paymentStatus === "pending" ||
            orderDetails?.paymentStatus === "failed" ||
            orderDetails?.orderStatus === "cancelled") && (
            <Card className="border-yellow-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-yellow-500">
                  <RotateCcw className="h-5 w-5" />
                  Payment Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This order requires payment to be completed. Click the button
                  below to proceed with payment.
                </p>
                <Button
                  onClick={handleRePay}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-foreground"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Complete Payment ({formatCurrency(orderDetails?.totalAmount)})
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
