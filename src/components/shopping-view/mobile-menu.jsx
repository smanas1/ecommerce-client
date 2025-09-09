import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Home,
  ShoppingCart,
  Search,
  LogOut,
  UserCog,
  X,
  Package,
  Heart,
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Badge } from "../ui/badge";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { useEffect } from "react";
import { shoppingViewHeaderMenuItems } from "@/config";
import PropTypes from "prop-types";

function MobileMenu({ isOpen, onClose }) {
  MobileMenu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user?.id));
    }
  }, [dispatch, user?.id]);

  const cartItemCount = cartItems?.items?.length || 0;

  function handleLogout() {
    dispatch(logoutUser());
    onClose();
  }

  function handleNavigate(path) {
    navigate(path);
    onClose();
  }

  function handleSearch() {
    navigate("/shop/search");
    onClose();
  }

  function handleAccount() {
    navigate("/shop/account");
    onClose();
  }

  function handleOrders() {
    navigate("/shop/account#orders");
    onClose();
  }

  function handleWishlist() {
    navigate("/shop/account#wishlist");
    onClose();
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-full max-w-xs p-0 flex flex-col">
          {/* Header with close button */}
          <SheetHeader className="border-b p-4">
            <SheetTitle className="flex items-center justify-between">
              <Link 
                to="/shop/home" 
                onClick={onClose}
                className="flex items-center gap-2 font-bold text-xl"
              >
                <div className="rounded-full bg-primary p-1.5">
                  <Home className="h-4 w-4 text-primary-foreground" />
                </div>
                <span>Ecommerce</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </Button>
            </SheetTitle>
          </SheetHeader>

          {/* User Profile Section */}
          <div className="border-b p-4 bg-gradient-to-r from-primary/5 to-blue-50">
            <div 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
              onClick={handleAccount}
            >
              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                  {user?.userName?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {user?.userName || "User"}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
              <UserCog className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </div>
          </div>

          {/* Search Section */}
          <div className="border-b p-3 bg-muted/20">
            <Button
              onClick={handleSearch}
              variant="ghost"
              className="w-full justify-start h-11 text-base font-medium rounded-lg hover:bg-accent transition-colors px-3"
            >
              <Search className="mr-3 h-4 w-4 text-muted-foreground" />
              Search products...
            </Button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto py-2">
            <div className="space-y-0.5 px-2">
              {shoppingViewHeaderMenuItems
                .filter((item) => item.id !== "home" && item.id !== "search")
                .map((menuItem) => (
                  <Button
                    key={menuItem.id}
                    onClick={() => handleNavigate(menuItem.path)}
                    variant="ghost"
                    className="w-full justify-start h-11 text-base font-medium rounded-lg hover:bg-accent transition-colors px-3"
                  >
                    <span className="capitalize">{menuItem.label}</span>
                  </Button>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-3 px-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                Quick Actions
              </h3>
              <div className="space-y-0.5">
                <Button
                  onClick={handleOrders}
                  variant="ghost"
                  className="w-full justify-start h-11 text-base font-medium rounded-lg hover:bg-accent transition-colors px-3"
                >
                  <Package className="mr-3 h-4 w-4" />
                  My Orders
                </Button>
                <Button
                  onClick={handleWishlist}
                  variant="ghost"
                  className="w-full justify-start h-11 text-base font-medium rounded-lg hover:bg-accent transition-colors px-3"
                >
                  <Heart className="mr-3 h-4 w-4" />
                  Wishlist
                </Button>
              </div>
            </div>
          </nav>

          {/* Bottom Actions */}
          <div className="border-t p-3 space-y-2 bg-muted/30">
            {/* Cart Button */}
            <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
              <Button
                variant="ghost"
                className="w-full justify-between h-12 rounded-lg hover:bg-accent transition-colors px-3"
                onClick={() => setOpenCartSheet(true)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 justify-center text-xs rounded-full">
                        {cartItemCount}
                      </Badge>
                    )}
                  </div>
                  <span>Cart</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {cartItemCount > 0 ? `${cartItemCount} items` : "Empty"}
                </span>
              </Button>
              <UserCartWrapper
                setOpenCartSheet={setOpenCartSheet}
                cartItems={
                  cartItems && cartItems.items && cartItems.items.length > 0
                    ? cartItems.items
                    : []
                }
              />
            </Sheet>

            {/* Logout Button */}
            <Button
              variant="ghost"
              className="w-full justify-between h-12 rounded-lg text-red-500 hover:text-red-500 hover:bg-red-50 transition-colors px-3"
              onClick={handleLogout}
            >
              <div className="flex items-center gap-3">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </div>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default MobileMenu;
