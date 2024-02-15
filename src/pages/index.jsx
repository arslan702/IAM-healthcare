import TopCard from "@/components/Home/TopCard";
import {
  Avatar,
  Button,
  Select,
  Table,
  Tag,
  Popconfirm,
  Input,
  notification,
  Modal,
} from "antd";
import Calendar from "react-calendar";
import Head from "next/head";
import { CiCircleMore } from "react-icons/ci";
import BusinessApi from "@/lib/Business";
import { auth, db } from "@/config/firebase";
import { collection, getDoc, getDocs } from "firebase/firestore";
import Image from "next/image";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  LinearScale,
  CategoryScale,
} from "chart.js";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  BarElement
);

import "react-calendar/dist/Calendar.css";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import OrderApi from "@/lib/order";
import { GiBigGear } from "react-icons/gi";
import { useAuth } from "@/context/AuthContext";
import Tooltips from "@/components/Tooltips";
import dayjs from "dayjs";
import { ExclamationCircleOutlined } from "@ant-design/icons";

function amtAfterCommission(amount, cms) {
  return amount - ((amount * cms) / 100).toFixed(2);
}
function amtCommission(amount, cms) {
  return ((amount * cms) / 100).toFixed(2);
}
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
const Index = () => {
  const { user } = useAuth();
  const [isEdit, setIsEdit] = useState(false);
  const [commission, setCommission] = useState(0);
  const [commision, setCommision] = useState(0);
  const [role, setRole] = useState("");
  const [totalClients, setTotalClients] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalTreatments, setTotalTreatments] = useState(0);
  const [invalidCommission, setInvalidComission] = useState(false);
  const [totalEarning, setTotalEarning] = useState(0);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    const id = auth?.currentUser?.uid;
    const getData = async () => {
      const ref = collection(db, "businesses");
      const res = await getDocs(ref);
      res.forEach((doc) => {
        if (doc.id === id) {
          // setRole(doc.data().role);
        }
      });
    };
    getData();
    BusinessApi.getCommission()
      .then((res) => {
        setCommission(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const [data, setData] = useState();
  const [upcomming, setUpcomming] = useState([]);
  const [filteredUpcomming, setFilteredUpcomming] = useState([]);
  const [totalBusinesses, setTotalBusinesses] = useState(0);
  const [earnings, setEarnings] = useState();
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [todayEarning, setTodayEarning] = useState(0);
  const [load, setLoad] = useState(true);
  const [adminRoundGraph, setAdminRoundGraph] = useState();
  const [filteredData, setFilteredData] = useState();
  const [todayAppoit, setTodayAppoit] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [appoitmentData, setAppoitmentData] = useState({
    labels: [],
    datasets: [
      {
        label: "Yearly Appointments",
        data: [], // Replace with your actual data
        backgroundColor: "#F26A5A",
      },
    ],
  });
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  const [roundGraph, setRoundGraph] = useState();

  const handleCommission = async (e) => {
    e.preventDefault();

    try {
      await BusinessApi.updateBusinessCommission(commision);
      setIsEdit(false);
      notification.success({
        message: "Commission Updated Successfully",
        placement: "topRight",
      });
      setCommission(commision);
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Error Updating Commission",
        placement: "topRight",
      });
    }
  };

  function useDeviceType() {
    const [deviceType, setDeviceType] = useState("desktop"); // Default to desktop

    useEffect(() => {
      const userAgent = navigator.userAgent;

      if (userAgent.match(/Android/i) || userAgent.match(/iPhone|iPad|iPod/i)) {
        setDeviceType("phone");
      } else if (userAgent.match(/Windows|Mac|Linux/i)) {
        setDeviceType("desktop");
      }
    }, []);

    return deviceType;
  }
  const isMobile = useDeviceType() === "phone";
  const handleSelected = (value) => {
    const date = value.toLocaleDateString().split("/");
    let newDate;
    if (isMobile) {
      newDate = `${date[2]}-${addZero(date[1])}-${addZero(date[0])}`;
    } else {
      newDate = `${date[2]}-${addZero(date[0])}-${addZero(date[1])}`;
    }
    setFilteredUpcomming(upcomming?.filter((item) => item?.date === newDate));
  };

  const handleHover = (event, elements) => {
    if (elements.length > 0) {
      // An arc is hovered
      setHoveredIndex(elements[0].index);
    } else {
      // No arc is hovered
      setHoveredIndex(null);
    }
  };

  const CancelOrder = async(record) => {
    await BusinessApi.cancelOrderStatus(record).then(async (res) => {
      // console.log(res);
      // getData();
      setLoad(true);
      notification.success({
        message: "Order Cancelled",
        placement: "topRight",
      });
      await fetch("/api/order-cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: record?.email,
          username: record?.name,
          salonName: record?.cartItem?.businessName,
          emailType: "cancelOrder",
          specialist: record?.cartItem?.selectedSpecialist,
          service: record?.cartItem?.serviceName,
          time: record?.cartItem?.selectedTime,
          date: record?.cartItem?.selectedDate,
        }),
      });
      await fetch("/api/salon-cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: record?.cartItem?.spaEmail,
          username: record?.name,
          salonName: record?.cartItem?.businessName,
          emailType: "cancelSalon",
          specialist: record?.cartItem?.selectedSpecialist,
          service: record?.cartItem?.serviceName,
          time: record?.cartItem?.selectedTime,
          date: record?.cartItem?.selectedDate,
        }),
      });
    });
  }
  const columns = [
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-medium font-Lato">#</span>
        </div>
      ),
      dataIndex: "no",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record, index) => (
        <div className="flex items-center justify-center w-full">
          <span className="text-base font-lato font-normal text-[#777777]">
            {index + 1}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">
            Customer Name
          </span>
        </div>
      ),
      dataIndex: "customer",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        return (
          <div className="space-x-2">
            <span className="text-base font-lato font-normal text-[#777777]">
              {record?.name?.charAt(0).toUpperCase() + record?.name?.slice(1)}
            </span>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">
            Phone Number
          </span>
        </div>
      ),
      dataIndex: "service",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            {record?.number}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">Customer Email</span>
        </div>
      ),
      dataIndex: "status",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            {record?.email}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">Service</span>
        </div>
      ),
      dataIndex: "payment",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            {record?.cartItem.serviceName?.charAt(0).toUpperCase() + record?.cartItem?.serviceName?.slice(1)}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">Specialist</span>
        </div>
      ),
      dataIndex: "payment",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            {record?.cartItem.selectedSpecialist?.charAt(0).toUpperCase() + record?.cartItem?.selectedSpecialist?.slice(1)}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">Price</span>
        </div>
      ),
      dataIndex: "payment",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            C${amtAfterCommission(
              record?.amount,
              Number(record?.commission)
            ).toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">QST</span>
        </div>
      ),
      dataIndex: "payment",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            C${record?.QST ? (record?.QST)?.toFixed(2) : ""}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">GST</span>
        </div>
      ),
      dataIndex: "payment",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            C${record?.GST ? (record?.GST)?.toFixed(2) : ""}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">Tax</span>
        </div>
      ),
      dataIndex: "payment",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            C${record?.tax ? (record?.tax).toFixed(2) : ""}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">Created At</span>
        </div>
      ),
      dataIndex: "created Date",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            {dayjs(record?.createdAt).format('MMM DD YYYY')}
          </span>
        </div>
      ),
    },
  ];
  const columnAdmin = [
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-medium font-Lato">#</span>
        </div>
      ),
      dataIndex: "no",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record, index) => (
        <div className="flex items-center justify-center w-full">
          <span className="text-base font-lato font-normal text-[#777777]">
            {index + 1}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">
            Business Name
          </span>
        </div>
      ),
      dataIndex: "customer",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        return (
          <div className="space-x-2">
            <span className="text-base font-lato font-normal text-[#777777]">
              {record?.cartItem?.businessName?.charAt(0).toUpperCase() + record?.cartItem?.businessName?.slice(1)}
            </span>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">Business Email</span>
        </div>
      ),
      dataIndex: "status",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            {record?.cartItem?.spaEmail}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">
            Customer Name
          </span>
        </div>
      ),
      dataIndex: "customer",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        return (
          <div className="space-x-2">
            <span className="text-base font-lato font-normal text-[#777777]">
              {record?.name?.charAt(0).toUpperCase() + record?.name?.slice(1)}
            </span>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">
            Phone Number
          </span>
        </div>
      ),
      dataIndex: "service",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            {record?.number}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">Customer Email</span>
        </div>
      ),
      dataIndex: "status",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            {record?.email}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">Service</span>
        </div>
      ),
      dataIndex: "payment",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            {record?.cartItem?.serviceName?.charAt(0).toUpperCase() + record?.cartItem?.serviceName?.slice(1)}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato"><Tooltips title={"To Be Paid"} text={"TBP"}/></span>
        </div>
      ),
      dataIndex: "payment",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            {/* C${amtAfterCommission(
              record?.amount,
              Number(record?.commission)
            )?.toFixed(2)} */}
            {/* C${record?.amount?.toFixed(2)} */}
            C$ {record?.discountAmount && record?.discountAmount != record?.cartItem?.serviceAmount ? <span><del>{record?.cartItem?.serviceAmount}</del>{" "}{record?.discountAmount}</span> : <span>{record?.cartItem?.serviceAmount}</span>}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">Service Price</span>
        </div>
      ),
      dataIndex: "payment",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            {/* C${amtAfterCommission(
              record?.amount,
              Number(record?.commission)
            )?.toFixed(2)} */}
            C${record?.cartItem?.serviceAmount}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">Commission</span>
        </div>
      ),
      dataIndex: "payment",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            C${amtCommission(
              record?.amount,
              Number(record?.commission)
            )}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">QST</span>
        </div>
      ),
      dataIndex: "payment",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            C${record?.QST ? (record?.QST)?.toFixed(2) : ""}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">GST</span>
        </div>
      ),
      dataIndex: "payment",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            C${record?.GST ? (record?.GST)?.toFixed(2) : ""}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">Tax</span>
        </div>
      ),
      dataIndex: "payment",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            C${record?.tax ? (record?.tax).toFixed(2) : ""}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">Created At</span>
        </div>
      ),
      dataIndex: "Created At",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="space-x-2">
          <span className="text-base font-lato font-normal text-[#777777]">
            {dayjs(record?.createdAt).format('MMM DD YYYY')}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-semibold font-lato">Payment</span>
        </div>
      ),
      dataIndex: "payment",
      // sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div
          className={`text-base text-center font-lato font-normal p-2 rounded-lg text-white ${
            record?.cartItem?.isRejected || record?.cartItem?.isCancelled ? "bg-red-400" : (record?.isCompleted ? "bg-green-400" : "bg-[#F7B614]")
          } `}
        >
          {record?.cartItem?.isRejected ? <Tooltips title={record?.cartItem?.rejectionReason}  text={"Rejected"}/> : record?.cartItem?.isCancelled ? <Tooltips title={"Cancelled by admin"}  text={"Cancelled"}/> : (record?.isCompleted ? "Paid" : "UnPaid")}
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-base font-medium font-lato">Actions</span>
        </div>
      ),
      key: "actions",
      render: (record) => {
        return (
          <div className="flex items-center justify-center">
            {!record?.isCompleted && !record?.cartItem?.isRejected && !record?.cartItem?.isCancelled ? (
            <Popconfirm
              placement="left"
              title={
                <div className="flex flex-col">
                  {/* <Button
                    type="link"
                    className="flex items-center space-x-2 text-[#2f9379] font-poppins hover:text-[#2f9379]"
                  >
                    <Image src={"/images/eye.svg"} width={18} height={18} />
                    View Details
                  </Button> */}
                  <Button
                    type="link"
                    onClick={() => {
                      Modal.confirm({
                        title: "Confirm",
                        icon: <ExclamationCircleOutlined />,
                        content:
                          "Are you sure you want to cancel this order?",
                        okText: "Yes",
                        cancelText: "No",
                        okType: "danger",
                        onOk: () => {
                          CancelOrder(record);
                        },
                      });
                    }}
                    className="flex items-center space-x-2 text-[#D94B38] font-lato"
                  >
                    Cancel Order
                  </Button>
                </div>
              }
              description=""
              // onConfirm={confirm}
              icon={null}
            >
              <Image
                className="cursor-pointer"
                src={"/images/more_icon.svg"}
                width={24}
                height={24}
              />
            </Popconfirm>
            ): ""}
          </div>
        );
      },
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const getAppotData = async (value) => {
    try {
      await OrderApi.getAppointments(value, role).then((res) => {
        if (value === "thisWeek" || value === "lastWeek") {
          const weekly = {
            labels: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            datasets: [
              {
                label: "Weekly Appointments",
                data: [
                  res?.mon,
                  res?.tue,
                  res?.wed,
                  res?.thu,
                  res?.fri,
                  res?.sat,
                  res?.sun,
                ], // Replace with your actual data
                backgroundColor: "#F26A5A",
              },
            ],
          };
          setAppoitmentData(weekly);
        } else if (value === "thisMonth") {
          const monthly = {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [
              {
                label: "Monthly Appointments",
                data: [res?.week1, res?.week2, res?.week3, res?.week4], // Replace with your actual data
                backgroundColor: "#F26A5A",
              },
            ],
          };
          setAppoitmentData(monthly);
        } else {
          const yearly = {
            labels: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            datasets: [
              {
                label: "Yearly Appointments",
                data: [
                  res?.jan,
                  res?.feb,
                  res?.mar,
                  res?.apr,
                  res?.may,
                  res?.jun,
                  res?.jul,
                  res?.aug,
                  res?.sep,
                  res?.oct,
                  res?.nov,
                  res?.dec,
                ],
                backgroundColor: "#F26A5A",
              },
            ],
          };
          setAppoitmentData(yearly);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleChangeTime = async (value) => {
    getAppotData(value);
    setTimeout(() => {
      getAppotData(value);
    }, 1000);
  };
  useEffect(() => {
    const getDataa = async () => {
      try {
        const res = await OrderApi.getAllEarnings(role);
        setEarnings(res);
        setTotalEarnings(res?.reduce((a, b) => a + b?.amount, 0));
        const labels = res?.map((item) => item?.name) || [];
        const dataValues = res?.map((item) => item?.amount) || [];

        const AdmindataValues = res?.map((item) => item?.amount) || [];
        // Generate random colors for the background
        const backgroundColors = labels?.map(() => getRandomColor()) || [];

        // Create the data object
        const data = {
          labels: labels,
          datasets: [
            {
              label: "total Earning in CAD",
              data: dataValues,
              backgroundColor: backgroundColors,
              hoverOffset: 4,
            },
          ],
        };
        const Admindata = {
          labels: labels,
          datasets: [
            {
              label: "total Earning in CAD",
              data: AdmindataValues,
              backgroundColor: backgroundColors,
              hoverOffset: 4,
            },
          ],
        };
        setRoundGraph(data);
        setAdminRoundGraph(Admindata);

        // Function to generate a random color
      } catch (error) {
        console.log(error);
      }
    };
    getDataa();

    const getData = async () => {
      try {
        const res = await OrderApi.getAllOrders(role);
        setData(res?.docs);
        setFilteredData(res?.docs);
        const date = new Date().toLocaleDateString().split("/");
        const newDate = `${date[2]}-${addZero(date[0])}-${addZero(date[1])}`;
        setTodayEarning(res?.earning);
        setTotalEarning(res?.totalEarning);
        // setTodayEarning(res?.filter(item => item?.date === newDate)?.reduce((a, b) => a + b?.cartItem.item.service.amount, 0))
      } catch (error) {
        console.log(error);
      }
    };
    getData();
    const getUp = async () => {
      const date = new Date().toLocaleDateString().split("/");
      let newDate;
      if (isMobile) {
        newDate = `${date[2]}-${addZero(date[1])}-${addZero(date[0])}`;
      } else {
        newDate = `${date[2]}-${addZero(date[0])}-${addZero(date[1])}`;
      }
      try {
        const res = await OrderApi.getAllUpcomming(role);
        setUpcomming(res?.data);
        setFilteredUpcomming(
          res?.data?.filter((item) => item?.date === newDate)
        );
        setTodayAppoit(res?.data?.filter((item) => item?.date === newDate));
        setTotalAppointments(res?.appoitments);
        setTotalTreatments(res?.treatment);
      } catch (error) {
        console.log(error);
      }
    };
    getUp();
    const getTreatments = async () => {
      BusinessApi.getDataForDashboard(role)
        .then((res) => {
          setTotalClients(res?.totalClients);
          setTotalBusinesses(res?.totalBusinesses);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getAppotData("thisMonth");
    getTreatments();
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  }, [load, role]);

  const chartData = {
    labels: roundGraph?.labels,
    datasets: roundGraph?.datasets,
  };
  const AdminchartData = {
    labels: adminRoundGraph?.labels,
    datasets: adminRoundGraph?.datasets,
  };
  const optionss = {
    tooltips: {
      enabled: true, // Show tooltips on hover
      callbacks: {
        label: function (tooltipItem, data) {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const label = data.labels[tooltipItem.index];
          const value = dataset.data[tooltipItem.index];
          return `${label}: ${value}`;
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  const earnoptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const handleApplyFilter = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const filteredData = data?.filter((item) => {
      const itemDate = new Date(item?.cartItem?.selectedDate);
      return itemDate >= start && itemDate <= end;
    });
    setFilteredData(filteredData);
  };
  const handleResetFilter = () => {
    setFilteredData(data);
  };
  const newData =
    role === "admin"
      ? adminRoundGraph?.datasets[0]?.data
      : roundGraph?.datasets[0]?.data;
  const allEarnings = newData
    ? newData.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      )
    : 0;

  function validateNumber(input) {
    // Check if the input is a single '0' or a number without leading zeroes
    return /^(0|[1-9][0-9]*)$/.test(input) || input === "";
  }

  function handleInputChange(e) {
    const inputValue = e.target.value;

    if (validateNumber(inputValue)) {
      setCommision(inputValue);
      setInvalidComission(false);
    } else {
      // Do not set the commission if validation fails
      // You might show an error message or perform another action here
      setInvalidComission(true);
      console.log("Invalid input. Please enter a valid number.");
    }
  }

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="z-0 flex flex-col justify-center lg:space-x-5 xl:flex-row">
        <div className="w-[100%] xl:w-[75%] ">
          <div className="flex flex-wrap w-full">
            {/* First Row */}
            <div className="grid w-full grid-cols-1 mt-3 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 sm:gap-x-6 ">
              {role === "admin" && (
                <div
                  className="box w-[100%]  h-[130px] rounded-[10px]  bg-[#FFFFFF]"
                  style={{ boxShadow: "0px 4px 21px 0px #0000000D" }}
                >
                  <div className="flex items-center justify-between w-full h-full px-4">
                    <div className="flex items-center flex-col gap-1 w-[60%]">
                      <p
                        className="text-center font-semibold text-[18px] md:text-[20px] mt-2"
                        style={{
                          lineHeight: "24px",
                          fontFamily: "'Lato', sans-serif",
                          color: "#777777",
                        }}
                      >
                        Clients
                      </p>
                      <p
                        className="text-center font-bold text-[20px] md:text-[24px] mt-1"
                        style={{
                          lineHeight: "28px",
                          fontFamily: "'Lato', sans-serif",
                          color: "#000000",
                        }}
                      >
                        {totalClients}
                      </p>
                    </div>
                    <Image
                      src={"/images/stars.svg"}
                      alt="/"
                      width={100}
                      height={100}
                      className="w-[50px] h-[50px]"
                    />

                    <p
                      className="text-center text-[14px] md:text-[16px] mt-1"
                      style={{
                        lineHeight: "19px",
                        fontFamily: "'Lato', sans-serif",
                        color: "#288990",
                      }}
                    >
                      {/* {new Date().toLocaleDateString()} */}
                    </p>
                  </div>
                </div>
              )}

              <div
                className="box w-[100%]  h-[130px] rounded-[10px]  bg-[#FFFFFF]"
                style={{ boxShadow: "0px 4px 21px 0px #0000000D" }}
              >
                <div className="flex items-center justify-between h-full px-4">
                  <div className="flex flex-col gap-1 ">
                    <p
                      className="text-center font-semibold text-[18px] md:text-[20px] mt-2"
                      style={{
                        lineHeight: "24px",
                        fontFamily: "'Lato', sans-serif",
                        color: "#777777",
                      }}
                    >
                      Doctors
                    </p>
                    <p
                      className="text-center font-bold text-[20px] md:text-[24px] mt-1"
                      style={{
                        lineHeight: "28px",
                        fontFamily: "'Lato', sans-serif",
                        color: "#000000",
                      }}
                    >
                      {totalAppointments}
                    </p>
                  </div>
                  <Image
                    src={"/images/app.svg"}
                    alt="/"
                    width={100}
                    height={100}
                    className="w-[50px] h-[50px]"
                  />
                </div>
              </div>
              <div
                className="box w-[100%] mb-4 sm:mb-0  h-[130px] rounded-[10px]  bg-[#FFFFFF]"
                style={{ boxShadow: "0px 4px 21px 0px #0000000D" }}
              >
                <div className="flex items-center justify-between h-full px-4">
                  <div className="flex flex-col gap-1 ">
                    <p
                      className="text-center font-semibold text-[18px] md:text-[20px] mt-2"
                      style={{
                        lineHeight: "24px",
                        fontFamily: "'Lato', sans-serif",
                        color: "#777777",
                      }}
                    >
                      Nurses
                    </p>
                    <p
                      className="text-center font-bold text-[20px] md:text-[24px] mt-1"
                      style={{
                        lineHeight: "28px",
                        fontFamily: "'Lato', sans-serif",
                        color: "#000000",
                      }}
                    >
                      {todayAppoit?.length}
                    </p>
                    {/* <p
                    className="text-center text-[14px] md:text-[16px] mt-1"
                    style={{
                      lineHeight: "19px",
                      fontFamily: "'Lato', sans-serif",
                      color: "#288990",
                    }}
                  > */}
                    {/* {new Date().toLocaleDateString()} */}
                    {/* </p> */}
                  </div>
                  <Image
                    src={"/images/treat.svg"}
                    alt="/"
                    width={100}
                    height={100}
                    className="w-[50px] h-[50px]"
                  />
                </div>
              </div>

              {role !== "admin" && (
                <div
                  className="box w-[100%] mb-4 sm:mb-0 h-[130px] rounded-[10px]  bg-[#FFFFFF]"
                  style={{ boxShadow: "0px 4px 21px 0px #0000000D" }}
                >
                  <div className="flex items-center justify-between h-full px-4">
                    <div className="flex flex-col gap-1">
                    <p
                      className="text-center font-semibold text-[18px] md:text-[20px] mt-2"
                      style={{
                        lineHeight: "24px",
                        fontFamily: "'Lato', sans-serif",
                        color: "#777777",
                      }}
                    >
                      Patients
                    </p>
                    <p
                      className="text-center font-bold text-[20px] md:text-[24px] mt-1"
                      style={{
                        lineHeight: "28px",
                        fontFamily: "'Lato', sans-serif",
                        color: "#000000",
                      }}
                    >
                      C${" "}
                      {todayEarning
                        ? 
                          todayEarning.toFixed(2)
                        : "0.00"}
                    </p>
                    </div>
                    <Image
                      src={"/images/stars.svg"}
                      alt="/"
                      width={100}
                      height={100}
                      className="w-[50px] h-[50px]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
