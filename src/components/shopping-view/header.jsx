import { 
  House, 
  LogOut, 
  Menu, 
  ShoppingCart, 
  UserCog, 
  Search,
  X
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
  SheetTrigger 
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
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

function MenuItems({ isMobile = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState("");

  function handleNavigate(getCurrentMenuItem) {
    // For search, we want to navigate to search page with query
    if (getCurrentMenuItem.id === "search") {
      if (searchKeyword.trim()) {
        navigate(`/shop/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
      }
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/shop/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  if (isMobile) {
    return (
      <div className="flex flex-col h-full">
        <nav className="flex-1 overflow-y-auto py-6">
          <div className="space-y-4">
            {shoppingViewHeaderMenuItems
              .filter(item => item.id !== "search")
              .map((menuItem) => (
                <Button
                  key={menuItem.id}
                  onClick={() => handleNavigate(menuItem)}
                  variant="ghost"
                  className="w-full justify-start h-12 text-lg font-medium"
                >
                  {menuItem.label}
                </Button>
              ))}
          </div>
          
          {/* Mobile Search */}
          <div className="mt-8 px-2">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-6 rounded-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <nav className="hidden lg:flex items-center gap-1 xl:gap-4">
      {shoppingViewHeaderMenuItems
        .filter(item => item.id !== "search")
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
      
      {/* Desktop Search */}
      <form onSubmit={handleSearch} className="relative ml-4">
        <Input
          type="search"
          placeholder="Search products..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="pl-10 pr-4 w-64 rounded-full"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Button 
          type="submit" 
          size="icon" 
          variant="ghost" 
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>
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
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
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
              <p className="text-sm font-medium leading-none">{user?.userName || "User"}</p>
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
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs p-0">
            <SheetHeader className="border-b p-4">
              <SheetTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary p-1.5">
                    <House className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-bold">Ecommerce</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </SheetTitle>
            </SheetHeader>
            <MenuItems isMobile={true} />
            <div className="border-t p-4">
              <HeaderRightContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default ShoppingHeader;
