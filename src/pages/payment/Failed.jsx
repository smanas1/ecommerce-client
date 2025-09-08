import { useSearchParams } from "react-router-dom";
import { XCircle, ShoppingBag, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

const Failed = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const status = searchParams.get("status");
  const amount = searchParams.get("amount");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">
            Payment Failed
          </CardTitle>
          <CardDescription className="text-gray-600">
            Unfortunately, your payment could not be processed. Please try
            again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
            <ShoppingBag className="h-6 w-6 text-gray-600 mr-2" />
            <span className="font-medium">Order Details</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID:</span>
              <span className="font-medium">#{orderId || "N/A"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className="font-medium text-red-600">
                {status || "Failed"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Amount:</span>
              <span className="font-medium">
                {amount ? `${amount}` : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" asChild>
            <Link to="/shop/checkout">
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry Payment
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/shop/home">Continue Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Failed;
