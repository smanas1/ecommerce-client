import {
  House,
  LogOut,
  Menu,
  ShoppingCart,
  UserCog,
  Search,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Badge } from "../ui/badge";
import MobileMenu from "./mobile-menu";

function MenuItems({ isMobile = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    // For search, we want to navigate to search page
    if (getCurrentMenuItem.id === "search") {
      navigate("/shop/search");
      return;
    }

    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  if (isMobile) {
    return (
      <nav className="overflow-y-auto py-4 flex-1">
        <div className="space-y-1 px-2">
          {shoppingViewHeaderMenuItems
            .filter((item) => item.id !== "home" && item.id !== "search")
            .map((menuItem) => (
              <Button
                key={menuItem.id}
                onClick={() => handleNavigate(menuItem)}
                variant="ghost"
                className="w-full justify-start h-12 text-base font-medium rounded-lg hover:bg-accent transition-colors"
              >
                {menuItem.label}
              </Button>
            ))}
        </div>

        {/* Mobile Search Button */}
        <div className="mt-6 px-2 pt-4 border-t">
          <Button
            onClick={() => handleNavigate({ id: "search" })}
            variant="outline"
            className="w-full justify-start h-12 text-base font-medium rounded-lg border-border hover:bg-accent transition-colors"
          >
            <Search className="mr-3 h-5 w-5 text-muted-foreground" />
            Search Products
          </Button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="hidden lg:flex items-center gap-1 xl:gap-4">
      {shoppingViewHeaderMenuItems
        .filter((item) => item.id !== "search")
        .map((menuItem) => (
          <Button
            key={menuItem.id}
            onClick={() => handleNavigate(menuItem)}
            variant="ghost"
            className="font-medium text-base transition-colors hover:text-primary"
          >
            {menuItem.label}
          </Button>
        ))}

      {/* Desktop Search Button */}
      <Button
        onClick={() => handleNavigate({ id: "search" })}
        variant="outline"
        className="ml-4 gap-2"
      >
        <Search className="h-4 w-4" />
        Search
      </Button>
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user?.id));
    }
  }, [dispatch, user?.id]);

  const cartItemCount = cartItems?.items?.length || 0;

  return (
    <div className="flex items-center gap-2 lg:gap-4">
      {/* Cart Button */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="ghost"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="h-6 w-6" />
          {cartItemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 justify-center text-xs rounded-full">
              {cartItemCount}
            </Badge>
          )}
          <span className="sr-only">User cart</span>
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

      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0"
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {user?.userName?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.userName || "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            <span>Account</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/shop/home" className="flex items-center gap-2">
          <div className="rounded-full bg-primary p-2">
            <House className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Ecommerce
          </span>
        </Link>

        {/* Desktop Menu */}
        <MenuItems />

        {/* Right Content */}
        <div className="hidden lg:flex items-center">
          <HeaderRightContent />
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)} 
        />
      </div>
    </header>
  );
}

export default ShoppingHeader;
