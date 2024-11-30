import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="flex justify-center items-center h-screen">
      <Outlet />
    </main>
  );
};

export default AuthLayout;
