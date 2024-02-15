import { PieChartOutlined, HomeFilled, SettingFilled } from "@ant-design/icons";
import { MdCategory } from 'react-icons/md';
import { AiFillStar } from 'react-icons/ai';
import { GiWallet } from 'react-icons/gi';

import Image from "next/image";
import { FiMessageSquare } from "react-icons/fi";
const routes = [
  {
    path: "/",
    icon: <Image src={"/images/dashboard.png"} width={12} height={12} />,
    title: "Dashboard",
    roles: ["admin","salon","spa","cutting"],
  },
  {
    path: "/doctors",
    icon: <MdCategory color="white" size={18} />,
    title: "Doctors",
    roles: ["salon", "spa", "cutting"],
  },
  // {
  //   path: "/categories",
  //   icon: <MdCategory color="white" size={18} />,
  //   title: "Categories",
  //   roles: ["admin"],
  // },
  {
    path: "/nurses",
    icon: <Image src={"/images/mybooking.png"} width={16} height={16} />,
    title: "Nurses",
    roles: ["admin"],
  },
  {
    path: "/patients",
    icon: <FiMessageSquare color="white" size={18} />,
    title: "Patients",
    roles: ["admin"],
  },
];

const routes1 = [
  {
    path: "/",
    icon: <Image src={"/images/dashboard.png"} width={12} height={12} />,
    title: "Dashboard",
    roles: ["admin", "user"],
  },
  {
    path: "/orders",
    icon: <Image src={"/images/orders.png"} width={16} height={16} />,
    title: "Orders",
    roles: ["admin", "user"],
  },
  {
    path: "/spa",
    icon: (
      <Image src={"/images/spa.png"} width={12} height={12} />
    ),
    title: "SPA",
    roles: ["user", "admin"],
  },
  {
    path: "/categories",
    icon: <MdCategory color="white" size={18} />,
    title: "Categories",
    roles: ["admin", "user"],
  },
  {
    path: "/users",
    icon: <Image src={"/images/users.png"} width={12} height={12} />,
    title: "Users",
    roles: ["admin", "user"],
  },

];


const routes3 = [

  {
    path: "/users",
    icon: <Image src={"/images/users.png"} width={12} height={12} />,
    title: "Users",
    roles: ["admin"],
  },
  {
    path: "/service",
    icon: <AiFillStar size={18} color="white" />,
    title: "Services",
    roles: ["spa", "salon",'cutting'],
  },
  {
    path: "/bookings",
    icon: <Image src={"/images/booking.png"} width={12} height={12} />,
    title: "Bookings",
    roles: [],
  },
  {
    path: "/my-bookings",
    icon: <Image src={"/images/mybooking.png"} width={12} height={12} />,
    title: "My Bookings",
    roles: ["spa", "salon",'cutting'],
  },
  {
    path: "/availability",
    icon: <Image src={"/images/availability.png"} width={18} height={20} />,
    title: "Availability",
    roles: ["spa", "salon",'cutting'],
  },
  // {
  //   path: "/products",
  //   icon: <Image src={"/images/products.png"} width={12} height={12} />,
  //   title: "Products",
  //   roles: ["user", "admin"],
  // },
  {
    path: "/promocode",
    icon: <Image src={'/images/promocode.png'} width={12} height={12} />,
    title: "Promocode",
    roles: ["spa", "salon",'cutting'],
  },
  // {
  //   path: "/roles",
  //   icon: <Image src={'/images/role.png'} width={12} height={12} />,
  //   title: "Roles",
  //   roles: ["user", "admin"],
  // },
  {
    path: "/rating",
    icon: <AiFillStar size={18} color="white" />,
    title: "Ratings",
    roles: ["spa", "salon",'cutting'],
  }
];

export { routes, routes1, routes3 };
