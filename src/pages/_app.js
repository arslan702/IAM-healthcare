import CheckIsLogin from "@/components/CheckIsLogin";
import Protection from "@/components/Protection";
import { AuthContextProvider } from "@/context/AuthContext";
import DashboardLayout from "@/layout/DashboardLayout";
import GeneralLayout from "@/layout/GeneralLayout";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/router";

const queryClient = new QueryClient();

const App = ({ Component, pageProps }) => {
  const router = useRouter();
  if (router.pathname === "/signin" || router.pathname === "/signup") {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <CheckIsLogin>
            <GeneralLayout>
              <Component {...pageProps} />
              <ReactQueryDevtools initialIsOpen={false} />
            </GeneralLayout>
          </CheckIsLogin>
        </AuthContextProvider>
      </QueryClientProvider>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        {/* <Protection> */}
          <DashboardLayout>
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
          </DashboardLayout>
        {/* </Protection> */}
      </AuthContextProvider>
    </QueryClientProvider>
  );
};

export default App;
