import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

const CheckIsLogin = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && router.pathname === "/signin") {
      router.push("/");
    }
  }, [router, user]);

  return <>{!user ? children : null}</>;
};

export default CheckIsLogin;
