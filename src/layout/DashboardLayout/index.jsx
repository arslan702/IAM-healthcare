import { Layout } from "antd";
import Sidebar from "./Sidebar";
import { useRouter } from "next/router";
import {
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button, Drawer, Radio, Space, Menu } from "antd";
import { routes, routes3 } from "@/routes/routes";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MdCategory } from "react-icons/md";
// import { PiShoppingCartFill } from 'react-icons/pi';
import { AiFillStar, AiOutlineShoppingCart } from "react-icons/ai";
import { GiWallet } from "react-icons/gi";
import Image from "next/image";
import { Ref } from "react";
import { auth, db } from "../../config/firebase";
import BusinessApi from "@/lib/Business";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
const { Header, Content } = Layout;
const Index = ({ children }) => {
  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    await auth.signOut();
    router.push("/signin");
  };

  const router = useRouter();
  const items = [
    {
      key: "2",
      label: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            className="text-sm font-medium md:text-lg font-poppins"
            style={{ textTransform: "capitalize", color: "#F49342" }}
          >
            John Doe
          </span>
          <span
            className="text-xs font-normal text-black opacity-50 md:text-sm font-poppins"
            style={{ textTransform: "capitalize", opacity: "60" }}
          >
            Admin
          </span>
        </div>
      ),
    },
    {
      key: "1",
      label: (
        <span
          className="text-xs font-normal text-red-600 opacity-50 md:text-base font-poppins"
          style={{ color: "red" }}
          onClick={() => logoutMutation.mutate()}
        >
          Logout
        </span>
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("dash");
  const [role, setRole] = useState("");
  const { user } = useAuth();

  const [placement, setPlacement] = useState("right");
  const showDrawer = () => {
    setOpen(!open);
  };
  const onClose = () => {
    setOpen(false);
  };

  const [name, setName] = useState("");
  const [current, setCurrent] = useState(router.pathname);
  // useEffect(() => {
  //   setRole(localStorage?.getItem("role"));
  //   if (router.pathname) {
  //     if (current !== router.pathname) {
  //       setCurrent(router.pathname);
  //     }
  //   }
  // }, [router, current]);

  // console.log("ACTIVE", active);
  // if (role === null) {
  //   router.push("/signin");
  // }

  useEffect(() => {
    const ref = collection(db, "businesses");
    const snapshot = getDocs(ref);
    snapshot.then((res) => {
      res.docs.map((doc) => {
        if (doc?.data()?.email === user?.email) {
          setName(doc.data().name);
        }
      });
    });
  }, []);

  return (
    <Layout style={{ overflow: "hidden", height: "100vh" }}>
      <div
        className={`${
          open ? "flex mb-[0xp]" : "hidden "
        } absolute animate-slideInFromTop  shadow-xl  mt-[4rem] rounded-lg bg-[#003c73]`}
        style={{
          padding: "0px",
          backgroundColor: "#003c73",
          borderRadius: "10px",
          top: "45px",
          right: "10px",
          boxShadow: "10px",
          boxSizing: "border-box",
          zIndex: "999",
          marginRight: "1.5rem",
        }}
      >
        <Menu
          style={{
            backgroundColor: "#003c73",
            borderRadius: "10px",
          }}
          className="shadow-xl sidebar"
          // theme="dark"
          defaultSelectedKeys={[current]}
          onClick={({ key }) => {
            setCurrent(key);
          }}
          mode="inline"
          items={routes.map((route) => {
            if (route.roles.includes(user?.role)) {
              return {
                key: route.path,
                icon: route.icon,
                label:
                  route?.childrens?.length > 0 ? (
                    <button
                      onClick={() => setOpen(false)}
                      href={route.path}
                      className="text-base font-normal text-white font-lato"
                    >
                      {route.title}
                    </button>
                  ) : (
                    <Link
                      onClick={() => setOpen(false)}
                      href={route.path}
                      className="text-base font-normal text-white font-lato"
                      style={{ color: "white" }}
                    >
                      {route.title}
                    </Link>
                  ),
                children: route?.childrens?.map((child) => {
                  if (child.roles.includes(user?.role)) {
                    return {
                      key: child.path,
                      icon: child.icon,
                      label: (
                        <Link
                          href={child.path}
                          className="text-base font-normal text-white font-lato"
                        >
                          {child.title}
                        </Link>
                      ),
                    };
                  }
                }),
              };
            }
          })}
        />
      </div>
      <Sidebar role={user?.role} />
      <Layout style={{overflow: "scroll"}} className="bg-[#FDF1EF]">
        <div className="px-4 py-2 mx-6 my-4 rounded-[10px] shadow-lg navbarPosition">
        <div className="flex flex-col items-center justify-start mx-3">
              <span className="font-bold sr-only">
                Hi! {user?.name ? user?.name?.charAt(0).toUpperCase() + user?.name.slice(1) : user?.fName?.charAt(0).toUpperCase() + user?.fName?.slice(1)}
              </span>
             
            </div>
          <div className="flex items-center justify-between space-x-4">
            <button
              type="button"
              className="flex order-first text-sm bg-white rounded-full shadow-sm md:hidden focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              id="user-menu-button"
              aria-expanded="false"
              aria-haspopup="true"
            >
              <img
                className="w-8 h-8 rounded-full"
                src="./Images/P1.png"
                alt=""
              />
            </button>
            <div className="flex-col justify-between pr-3 md:flex sm:flex-row items-between sm:space-x-4">
              {/* <BellOutlined className="text-2xl" />
              <SettingOutlined className="text-2xl" /> */}
              <div
                onClick={handleLogout}
                className="flex items-center space-x-2 font-bold cursor-pointer text-md"
              >
                <span className="text-[#003c73]">Logout</span>
                <LogoutOutlined className="text-xl text-[#003c73]" />
              </div>
            </div>

            <button
              type="button"
              className="order-first hidden text-sm bg-gray-800 rounded-full md:flex focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              id="user-menu-button"
              aria-expanded="false"
              aria-haspopup="true"
            >
              <img
                className="w-8 h-8 rounded-full"
                src="./Images/P1.png"
                alt=""
              />
            </button>
          </div>
          <GiHamburgerMenu
            className=" md:hidden"
            onClick={showDrawer}
            size={30}
          />
        </div>

        <Content
          style={{
            // background: "#FDF1EF",
          }}
        >
          <div
            // className="bg-[#FDF1EF]"
            style={{
              padding: 24,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Index;
