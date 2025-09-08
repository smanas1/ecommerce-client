import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;
