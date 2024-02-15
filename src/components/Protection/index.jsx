import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Protection = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // if (!user) router.push("/signin");
  }, [router, user]);

  return <>{user ? children : null}</>;
};

export default Protection;
