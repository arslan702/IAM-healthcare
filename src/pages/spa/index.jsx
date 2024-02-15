import {
  Button,
  Space,
  Table,
  Input,
  Tag,
  Popconfirm,
  Modal,
  notification,
} from "antd";
import Head from "next/head";
import Image from "next/image";
import { AiFillFilter } from "react-icons/ai";
import { CiCircleMore } from "react-icons/ci";
import BusinessApi from "../../lib/Business.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  EditFilled,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import emailjs from "emailjs-com";

const { Search } = Input;

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Link from "next/link.js";
import { MdRefresh } from "react-icons/md";
import { FiRefreshCcw } from "react-icons/fi";
import axios from "axios";
import ColorBar from "@/components/bar/index.js";
const SpaModal = dynamic(() => import("../../components/Spa/SpaModal"));
const FilterModal = dynamic(() =>
  import("../../components/FilterModel/Filter.js")
);

const Index = () => {
  const queryClient = useQueryClient();

  const [showSpaModal, setShowSpaModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [category, setCategory] = useState();
  const [allData, setAllUser] = useState();
  const [check, setCheck] = useState(false);
  const [deCheck, setDeCheck] = useState(false);
  const router = useRouter();
  const handleNavigate = (record) => {
    const dataString = JSON.stringify(record.email);
    const queryParams = `?data=${encodeURIComponent(dataString)}`;
    router.push(`/spaservice${queryParams}`);
  };
  const { data, isLoading, isError } = useQuery(
    ["businesses"],
    async () => {
      const data = await BusinessApi.getBusinesses();
      return data;
    }
    // {
    //   initialData: Business,
    // }
  );

  useEffect(() => {
    if (data) {
      setAllUser(data);
    }
  }, [data]);

  // if (isLoading) {
  //   return <h1 className="semibold text-[20px]">Loading...</h1>
  // }
  // if (isError) {
  //   return <h1>{isError}</h1>
  // }

  const deleteMutation = useMutation(
    ["businesses"],
    async (record) => {
      await BusinessApi.deleteBusiness(record);
    },
    {
      onError: (data) => {
        notification.open({
          type: "error",
          message: "Something went wrong",
          placement: "top",
        });
      },
      onSuccess: () => {
        notification.open({
          type: "success",
          message: "User deleted successfully",
          placement: "top",
        });
        queryClient.invalidateQueries(["businesses"]);
      },
    }
  );

  const handleSearch = (value) => {
    const filterData = data.filter((item) => {
      return (
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.businessName.toLowerCase().includes(value.toLowerCase()) ||
        item.category.toLowerCase().includes(value.toLowerCase()) ||
        item.email.toLowerCase().includes(value.toLowerCase()) ||
        item.businessAddress.toLowerCase().includes(value.toLowerCase()) ||
        item.numberEmployees.toLowerCase().includes(value.toLowerCase()) ||
        item.province.toLowerCase().includes(value.toLowerCase()) ||
        item.contactNumber.toLowerCase().includes(value.toLowerCase()) ||
        item.businessContact.toLowerCase().includes(value.toLowerCase()) ||
        item.businessType.toLowerCase().includes(value.toLowerCase()) ||
        item.city.toLowerCase().includes(value.toLowerCase()) ||
        item.postCode.toLowerCase().includes(value.toLowerCase()) ||
        item.status.toLowerCase().includes(value.toLowerCase()) ||
        item.websiteLink.toLowerCase().includes(value.toLowerCase())
      );
    });
    setAllUser(filterData);
  };
  const handleChangeStatus = async (id, status, name, email) => {
    try {
      const dat = await BusinessApi.updateBusinessStatus(id, status);
      setCheck(false);
      setDeCheck(false);
      queryClient.refetchQueries(["businesses"]);
      if (status === "active") {
        const emailSend = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            emailType: "approveSalon",
            username: name,
          }),
        });

        await emailSend.json();
      } else {
        const emailSend = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            emailType: "rejectSalon",
            username: name,
          }),
        });

        await emailSend.json();
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const columns = [
    {
      title: (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            #
          </span>
        </div>
      ),
      align: "center",
      dataIndex: "no",
      render: (_, record, index) => (
        <div className="flex items-center justify-start w-full">
          <span className="text-base font-lato font-normal text-[#777777]">
            {index + 1}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Name
          </span>
        </div>
      ),
      dataIndex: "name",
      align: "center",
      render: (_, record) => (
        <div
          onClick={() => handleNavigate(record)}
          className="flex items-center justify-center w-full cursor-pointer hover:underline"
        >
          <span className="text-base font-lato font-normal text-[#777777]">
            {record?.name?.charAt(0)?.toUpperCase() + record?.name?.slice(1)}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Business Name
          </span>
        </div>
      ),
      align: "center",
      dataIndex: "businessName",
      render: (_, record) => (
        <div className="flex items-center justify-center w-full">
          <span className="text-base font-lato font-normal text-[#777777]">
            {record?.businessName?.charAt(0)?.toUpperCase() + record?.businessName?.slice(1)}
          </span>
        </div>
      ),
    },
    // {
    //   title: (
    //     <div className="flex items-center space-x-4">
    //       <span className="text-base font-medium font-lato whitespace-nowrap">Featured</span>
    //     </div>
    //   ),
    //   dataIndex: "isFeatured",
    //   render: (_, record) => (
    //     <div className={`w-full flex items-center ${record?.isFeatured === 'true' ? "text-red-500" : "text-[#777777]"}`}>
    //       <span className="text-base font-normal font-lato ">
    //         {record?.isFeatured === 'true' ? "Featured" : "Not Featured"}
    //       </span>
    //     </div>
    //   ),
    // },
    {
      title: (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Email
          </span>
        </div>
      ),
      align: "center",
      dataIndex: "email",
      render: (_, record) => (
        <div className="flex items-center justify-center w-full">
          <span className="text-base max-w-[100px] font-lato font-normal text-[#777777]">
            {record?.email}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Address
          </span>
        </div>
      ),
      align: "center",
      dataIndex: "businessAddress",
      render: (_, record) => (
        <div className="max-w-[100px]">
          <span className="text-base  w-full font-lato font-normal text-[#777777]">
            {record?.businessAddress.slice(0, 20)}...
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Employees
          </span>
        </div>
      ),
      align: "center",
      dataIndex: "numberEmployees",
      render: (_, record) => (
        <div className="w-full">
          <span className="text-base font-lato font-normal text-[#777777]">
            {record?.numberEmployees}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Province
          </span>
        </div>
      ),
      dataIndex: "province",
      align: "center",
      render: (_, record) => (
        <div className="w-full">
          <span className="text-base font-lato font-normal text-[#777777]">
            {record?.province?.charAt(0)?.toUpperCase() + record?.province?.slice(1)}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Contact
          </span>
        </div>
      ),
      dataIndex: "contactNumber",
      align: "center",
      render: (_, record) => (
        <div className="w-full">
          <span className="text-base font-lato font-normal text-[#777777]">
            {record?.contactNumber}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Business No.
          </span>
        </div>
      ),
      align: "center",
      dataIndex: "businessContact",
      render: (_, record) => (
        <div className="w-full">
          <span className="text-base font-lato font-normal text-[#777777]">
            {record?.businessContact}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Proof
          </span>
        </div>
      ),
      align: "center",
      dataIndex: "file",
      render: (_, record) => (
        <div className="w-full">
          <span className="text-base font-lato font-normal text-[#777777]">
            <a
              target="_blank"
              href={record?.proffFile || "#"}
              className="text-blue-500 hover:underline"
            >
              View
            </a>
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Business Type
          </span>
        </div>
      ),
      dataIndex: "businessType",
      align: "center",
      render: (_, record) => (
        <div className="w-full">
          <span className="text-base font-lato font-normal text-[#777777]">
            {record?.businessType?.charAt(0)?.toUpperCase() + record?.businessType?.slice(1)}
          </span>
        </div>
      ),
    },

    // {
    //   title: (
    //     <div className="flex items-center justify-center space-x-4">
    //       <span className="text-base font-medium font-lato whitespace-nowrap">
    //         Role
    //       </span>
    //     </div>
    //   ),
    //   align: "center",
    //   dataIndex: "role",
    //   render: (_, record) => (
    //     <div className="w-full">
    //       <span className="text-base font-lato font-normal text-[#777777]">
    //         {record?.role?.charAt(0)?.toUpperCase() + record?.role?.slice(1)}
    //       </span>
    //     </div>
    //   ),
    // },

    {
      title: (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            City
          </span>
        </div>
      ),
      align: "center",
      dataIndex: "city",
      render: (_, record) => (
        <div className="w-full">
          <span className="text-base font-lato font-normal text-[#777777]">
            {record?.city?.charAt(0)?.toUpperCase() + record?.city?.slice(1)}
          </span>
        </div>
      ),
    },

    {
      title: (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Post Code
          </span>
        </div>
      ),
      align: "center",
      dataIndex: "postCode",
      render: (_, record) => (
        <div className="w-full">
          <span className="text-base font-lato font-normal text-[#777777]">
            {record?.postCode}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Status
          </span>
        </div>
      ),
      align: "center",
      dataIndex: "status",
      render: (_, record) => (
        <div className="w-full">
          <span
            className={`${
              record.status === "active"
                ? "bg-green-500"
                : record.status === "pending"
                ? "bg-yellow-400"
                : "bg-blue-400"
            } text-white p-1 rounded-lg px-3 text-base font-lato font-normal `}
          >
            {record.status?.charAt(0)?.toUpperCase() + record?.status?.slice(1)}
          </span>
        </div>
      ),
    },
    // {
    //   title: (
    //     <div className="flex items-center space-x-4">
    //       <span className="text-base font-medium font-lato whitespace-nowrap">Website</span>
    //     </div>
    //   ),
    //   dataIndex: "websiteLink",
    //   render: (_, record) => (
    //     <div className="w-full">
    //       <span className="text-base font-lato font-normal text-[#777777]">
    //         <a className="text-blue-500 hover:underline" target="_blank" href={record?.websiteLink}>Visit</a>
    //       </span>
    //     </div>
    //   ),
    // },
    {
      title: (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Actions
          </span>
        </div>
      ),
      key: "actions",
      align: "center",
      render: (record) => {
        return (
          <div className="flex items-center justify-center">
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
                    className="flex items-center space-x-2 text-blue-500 font-lato"
                    onClick={() => {
                      setCategory(record);
                      setShowSpaModal(true);
                    }}
                  >
                    <EditFilled size={18} className="text-blue-500" />
                    Edit Details
                  </Button>
                  {record?.status !== "active" && (
                    <Button
                      type="link"
                      className="flex items-center space-x-2 text-green-500 font-lato"
                      onClick={() => {
                        setCheck(true);
                        handleChangeStatus(
                          record.id,
                          "active",
                          record?.businessName,
                          record?.email
                        );
                      }}
                    >
                      {/* <Image
                      src={"/images/edit_icon1.svg"}
                      width={18}
                      height={18}
                    /> */}
                      <FiRefreshCcw className="text-green-500" size={18} />
                      {check ? "Activating.." : "Activate"}
                    </Button>
                  )}
                  {record?.status === "active" && (
                    <Button
                      type="link"
                      className="flex items-center space-x-2 text-red-500 font-lato"
                      onClick={() => {
                        setDeCheck(true);
                        handleChangeStatus(
                          record.id,
                          "deactive",
                          record?.businessName,
                          record?.email
                        );
                      }}
                    >
                      <FiRefreshCcw className="text-red-500" size={18} />
                      {deCheck ? "Deactivating.." : "Deactivate"}
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      Modal.confirm({
                        title: "Confirm",
                        icon: <ExclamationCircleOutlined />,
                        content:
                          "Are you sure you want to delete this Business?",
                        okText: "Delete",
                        cancelText: "Cancel",
                        okType: "danger",
                        onOk: () => {
                          deleteMutation.mutate(record);
                        },
                      });
                    }}
                    type="link"
                    className="flex items-center space-x-2 text-[#D94B38] font-lato"
                  >
                    <Image src={"/images/delete.svg"} width={18} height={18} />
                    Delete
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
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {showSpaModal && (
        <SpaModal
          show={showSpaModal}
          close={() => {
            setShowSpaModal(false);
          }}
          data={category}
          setData={setCategory}
        />
      )}

      {showFilterModal && (
        <FilterModal
          show={showFilterModal}
          close={() => {
            setShowFilterModal(false);
          }}
          // data={category}
          // setData={setCategory}
        />
      )}
      <Head>
        <title>Businesses</title>
      </Head>
      <div className="flex items-center gap-2 mb-8">
        <ColorBar />
        <h2 className="text-2xl font-medium font-lato">Businesses</h2>
      </div>

      <div className="tableWrapper">
        <div className="categoryHeader">
          <div className="flex flex-col items-start justify-between pb-5 space-y-4 md:space-y-0 sm:space-x-4 sm:flex-row sm:items-end">
            <div className="flex items-center justify-between w-full">
              <Search
                placeholder="Search SPA"
                allowClear
                size="large"
                onSearch={(value) => handleSearch(value)}
                className="searchBar w-full lg:w-[18rem]"
              ></Search>

              {/* <Button
                className="btn-primary inline md:hidden ml-4  bg-[#F26A5A]  font-lato hover:bg-transparent"
                type="primary"
                size="large"
                onClick={() => setShowFilterModal(true)}
              >
                <AiFillFilter />

              </Button> */}
            </div>

            <div className="w-[100%] flex sm:justify-end">
              {/* <Button
                className="btn-primary  w-[100%] sm:w-[160px] bg-[#F26A5A] font-lato self-end hover:bg-[#F26A5A]"
                type="primary"
                size="large"
                onClick={() => setShowSpaModal(true)}
              >
                + Add Business
              </Button> */}
            </div>
          </div>
        </div>
        <Table
          // loading={isLoading}
          className="hidden md:block"
          columns={columns}
          dataSource={allData}
          pagination={{ defaultPageSize: 4 }}
          // className="table"
          scroll={{ x: 1500 }}
        />
        {/* Cards for Mobile */}
        {allData?.map((item) => {
          return (
            <div className="bg-[#FBEFEF] flex flex-col items-between justify-center md:hidden p-5 rounded-[10px] ">
              {/* 1st start*/}
              <div className="flex py-2 border-b-solid text-[#777777] border-b-[1px] border-b-[#ffffff] justify-between items-center">
                <h6 className="text-[12px]">
                  Name
                  <br />
                  <p className="text-[#000000] ">{item?.name?.charAt(0)?.toUpperCase() + item?.name?.slice(1)}</p>
                </h6>
                <h6>
                  Business <br />
                  <p className="text-[#000000]">{item?.businessName?.charAt(0)?.toUpperCase() + item?.businessName?.slice(1)}</p>
                </h6>

                <Popconfirm
                  className="self-center "
                  placement="right"
                  title={
                    <div className="flex flex-col">
                      <Button
                        type="link"
                        className="flex items-center space-x-2 text-[#2f9379] font-lato"
                        onClick={() => {
                          setCategory(item);
                          setShowSpaModal(true);
                        }}
                      >
                        <Image
                          src={"/images/edit_icon1.svg"}
                          width={18}
                          height={18}
                        />
                        Edit Details
                      </Button>
                      {item?.status !== "active" && (
                        <Button
                          type="link"
                          className="flex items-center space-x-2 text-green-500 font-lato"
                          onClick={() => {
                            setCheck(true);
                            handleChangeStatus(
                              item?.id,
                              "active",
                              item?.businessName,
                              item?.email
                            );
                          }}
                        >
                          {/* <Image
                      src={"/images/edit_icon1.svg"}
                      width={18}
                      height={18}
                    /> */}
                          <FiRefreshCcw className="text-green-500" size={18} />
                          {check ? "Activating.." : "Activate"}
                        </Button>
                      )}
                      {item?.status === "active" && (
                        <Button
                          type="link"
                          className="flex items-center space-x-2 text-red-500 font-lato"
                          onClick={() => {
                            setDeCheck(true);
                            handleChangeStatus(
                              item?.id,
                              "deactive",
                              item?.businessName,
                              item?.email
                            );
                          }}
                        >
                          <FiRefreshCcw className="text-red-500" size={18} />
                          {deCheck ? "Deactivating.." : "Deactivate"}
                        </Button>
                      )}
                      <Button
                        type="link"
                        className="flex items-center space-x-2 text-[#D94B38] font-lato"
                        onClick={() => {
                          Modal.confirm({
                            title: "Confirm",
                            icon: <ExclamationCircleOutlined />,
                            content:
                              "Are you sure you want to delete this product?",
                            okText: "Delete",
                            cancelText: "Cancel",
                            okType: "danger",
                            onOk: () => {
                              deleteMutation.mutate(record?.id);
                            },
                          });
                        }}
                      >
                        <Image
                          src={"/images/delete.svg"}
                          width={18}
                          height={18}
                        />
                        Delete
                      </Button>
                    </div>
                  }
                  description=""
                  // onConfirm={confirm}
                  icon={null}
                >
                  <CiCircleMore size={24} color="#F26A5A" />
                </Popconfirm>
              </div>
              {/* 1st end */}
              <div className="flex py-2 border-b-solid border-b-[1px]  border-b-[#ffffff] justify-between items-center text-[#777777]">
                <h6>
                  Business Type <br />
                  <p className="text-[#000000]">
                    {item?.businessType ? item?.businessType?.charAt(0)?.toUpperCase() + item?.businessType?.slice(1) : "N/A"}
                  </p>
                </h6>
                <h6>
                  Employees <br />
                  <p className="text-[#000000]">{item?.numberEmployees}</p>
                </h6>
              </div>
              {/* 2nd start*/}
              <div className="flex py-2 border-b-solid border-b-[1px]  border-b-[#ffffff] justify-between items-center text-[#777777]">
                <h6>
                  Address
                  <br />
                  <p className="text-[#000000]">{item?.businessAddress}</p>
                </h6>
                <h6>
                  Province
                  <br />
                  <p className="text-[#000000]">{item?.province?.charAt(0)?.toUpperCase() + item?.province?.slice(1)}</p>
                </h6>
              </div>
              {/* 2nd end */}

              {/* 3rd start*/}
              <div className="flex py-2 border-b-solid border-b-[1px] border-b-[#ffffff] justify-between items-center text-[#777777]">
                <h6>
                  Contact
                  <br />
                  <p className="text-[#000000]">{item?.contactNumber}</p>
                </h6>
                <h6>
                  Business No.
                  <br />
                  <p className="text-[#000000]">{item?.businessContact}</p>
                </h6>
              </div>
              {/* 3rd end */}

              {/* 4th start*/}
              <div className="flex py-2 border-b-solid border-b-[1px] border-b-[#ffffff] justify-between items-center text-[#777]">
                <h6>
                  Email <br />
                  <p className="text-[#000000]">{item?.email}</p>
                </h6>
              </div>
              {/* 4th end */}

              <div className="flex pt-2  justify-between items-center text-[#777]">
                <div>
                  <h6>Proof</h6>
                  <a target="_blank" href={item?.proffFile || "#"} className="text-[#000000]">
                    View
                  </a>
                </div>
                <h6>
                  <span
                    className={`${
                      item.status === "active"
                        ? "bg-green-500"
                        : item.status === "pending"
                        ? "bg-yellow-400"
                        : "bg-blue-400"
                    } text-white p-1 rounded-lg px-3 text-base font-lato font-normal `}
                  >
                    {item?.status ? item?.status?.charAt(0)?.toUpperCase() + item?.status?.slice(1) : "N/A"}
                  </span>
                </h6>
              </div>
            </div>
          );
        })}
        {/* Cards for Mobile */}
      </div>
    </div>
  );
};

export default Index;
