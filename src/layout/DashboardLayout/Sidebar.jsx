import { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { routes, routes1 } from "@/routes/routes";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { MdCategory } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";
import { GiWallet } from "react-icons/gi";
import { Divider } from "antd"; // Import Divider from antd
const { Sider } = Layout;

const Sidebar = ({ role }) => {
  const router = useRouter();
  const [current, setCurrent] = useState(router.pathname);
  useEffect(() => {
    if (router.pathname) {
      if (current !== router.pathname) {
        setCurrent(router.pathname);
      }
    }
  }, [router, current]);

  return (
    <>
      <Sider
        className="hidden w-full md:block"
        style={{
          minHeight: "100vh",
          paddingTop: "1rem",
          backgroundColor: "#003c73",
        }}
      >
        <div className="flex w-[180px] justify-center items-start py-2">
          <Link href={"/"}>
            {/* <img
              src="/images/kutsbee.png"
              alt="logo"
              width={100}
              height={100}
              style={{ color: "orange" }}
              // className="w-[150px] md:w-[150px]"
            /> */}
            <h3 className="text-white tex-bold text-[18px]">IAM Healthcare</h3>
          </Link>
        </div>
        <Menu
          style={{
            marginTop: "2rem",
            backgroundColor: "#003c73",
            width: "100%",
          }}
          className="w-full sidebar"
          // theme="dark"
          defaultSelectedKeys={[current]}
          onClick={({ key }) => {
            setCurrent(key);
          }}
          mode="inline"
          items={routes.map((route) => {
            // if (route.roles.includes(role)) {
              return {
                key: route.path,
                icon: route.icon,
                label:
                  route?.childrens?.length > 0 ? (
                    <button
                      href={route.path}
                      className="font-normal text-base font-lato text-white"
                    >
                      {route.title}
                    </button>
                  ) : (
                    <Link
                      href={route.path}
                      className="font-normal text-base font-lato text-white"
                      style={{color: 'white'}}
                    >
                      {route.title}
                    </Link>
                  ),
                children: route?.childrens?.map((child) => {
                  if (child.roles.includes(role)) {
                    return {
                      key: child.path,
                      icon: child.icon,
                      label: (
                        <Link
                          href={child.path}
                          className="font-normal text-base font-lato text-[#F26A5A]"
                        >
                          {child.title}
                        </Link>
                      ),
                    };
                  }
                }),
              };
            // }
          })}
        />

        <Divider
          className={`bg-white`}
          style={{ marginTop: role === "admin" ? "140px" : "140px" }}
        />
      </Sider>
    </>
  );
};

export default Sidebar;
