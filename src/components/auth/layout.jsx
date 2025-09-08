import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex items-center border justify-center w-1/2 px-12 relative overflow-hidden">
        {/* Background image with fallback */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-gray-200"
          style={{
            backgroundImage: "url('/torapril28.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 " />
        <div className="max-w-md space-y-6 text-center text-white relative z-10"></div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
