import {
  Button,
  Form,
  Table,
  Input,
  Select,
  Popconfirm,
  Modal,
  notification,
  message,
} from "antd";
import Head from "next/head";
import Image from "next/image";
import { AiFillFilter } from "react-icons/ai";
import { CiCircleMore } from "react-icons/ci";
import UsersApi from "../../lib/UsersApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { Search } = Input;
import { useEffect, useState } from "react";
import UserApi from "../../lib/UsersApi";
import dynamic from "next/dynamic";
import axios from "axios";
import Loader from "@/components/utils/Loader";
import ColorBar from "@/components/bar";

const UserModal = dynamic(() => import("../../components/User/UserModal"));
const FilterModal = dynamic(() =>
  import("../../components/FilterModel/Filter.js")
);

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState();
  const [fName, setFName] = useState();
  const [lName, setLName] = useState();
  const [phone, setPhone] = useState();
  const [gender, setGender] = useState();
  const [role, setRole] = useState();
  const [city, setCity] = useState();
  const [postCode, setPostCode] = useState();
  const [email, setEmail] = useState();
  const [proEnable, setProEnable] = useState();
  const [allUsers, setAllUser] = useState();

  const showModal = (user) => {
    setEditUser(user);
    setFName(user.fName);
    setLName(user.lName);
    setPhone(user.phone);
    setCity(user.city);
    setRole(user.role);
    setPostCode(user.postCode);
    setEmail(user.email);
    setProEnable(user.proEnable);
    setGender(user.gender);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const queryClient = useQueryClient();
  const updateMutation = useMutation(
    ["users"],
    async ({ id, User }) => {
      await UserApi.updateUser(id, User);
    },
    {
      onError: (data) => {
        console.log(data);
      },
      onSuccess: () => {
        notification.open({
          type: "success",
          message: "User updated successfully",
          placement: "top",
        });
        queryClient.invalidateQueries(["users"]);
        setIsModalOpen(false);
      },
    }
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const values = {
      fName,
      lName,
      phone,
      city,
      role,
      postCode,
      email,
      proEnable,
      gender,
    };
    updateMutation.mutate({
      id: editUser?.id,
      User: values,
    });
  };
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [Users, setUsers] = useState();

  const columns = [
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            First Name
          </span>
        </div>
      ),
      dataIndex: "fName",
      render: (_, record) => (
        <div className="flex items-center justify-start w-full">
          <span className="text-sm font-lato font-normal text-[#777777]">
            {record.fName?.charAt(0)?.toUpperCase() + record?.fName?.slice(1)}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Last Name
          </span>
        </div>
      ),
      dataIndex: "lName",
      render: (_, record) => (
        <div className="flex items-center w-full">
          <span className="text-sm font-lato font-normal text-[#777777]">
            {record.lName?.charAt(0)?.toUpperCase() + record?.lName?.slice(1)}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Phone
          </span>
        </div>
      ),
      dataIndex: "phone",
      render: (_, record) => (
        <div className="w-full">
          <span className="text-sm font-lato font-normal text-[#777777]">
            {record.phone}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Gender
          </span>
        </div>
      ),
      dataIndex: "phone",
      render: (_, record) => (
        <div className="w-full">
          <span className="text-sm font-lato font-normal text-[#777777]">
            {record.gender}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Role
          </span>
        </div>
      ),
      dataIndex: "country",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="flex items-center justify-start w-full">
          <span className="text-sm font-lato font-normal text-[#777777]">
            {record.role?.charAt(0)?.toUpperCase() + record?.role?.slice(1)}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            City
          </span>
        </div>
      ),
      dataIndex: "country",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="flex items-center justify-start w-full">
          <span className="text-sm font-lato font-normal text-[#777777]">
            {record.city?.charAt(0)?.toUpperCase() + record?.city?.slice(1)}
          </span>
        </div>
      ),
    },

    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Postal Code
          </span>
        </div>
      ),
      dataIndex: "phone",
      render: (_, record) => (
        <div className="w-full">
          <span className="text-sm font-lato font-normal text-[#777777]">
            {record.phone}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Email
          </span>
        </div>
      ),
      dataIndex: "email",
      render: (_, record) => (
        <div className="max-w-[100px]">
          <span className="text-sm font-lato font-normal text-[#777777]">
            {record.email}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Promotion
          </span>
        </div>
      ),
      dataIndex: "proEnable",
      render: (_, record) => (
        <div className="w-full">
          <span className="text-sm font-lato font-normal text-[#777777]">
            {record.proEnable === "true" ? "Enabled" : "Disabled"}
          </span>
        </div>
      ),
    },

    {
      title: (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-base font-medium font-lato whitespace-nowrap">
            Actions
          </span>
        </div>
      ),
      key: "actions",
      render: (record) => {
        return (
          <div className="flex items-center justify-center">
            <Popconfirm
              placement="left"
              title={
                <div className="flex flex-col">
                  <Button
                    type="link"
                    className="flex items-center space-x-2 text-[#2f9379] font-lato"
                    onClick={() => {
                      showModal(record);
                    }}
                  >
                    <Image
                      src={"/images/edit_icon1.svg"}
                      width={18}
                      height={18}
                    />
                    Edit Details
                  </Button>
                  <Button
                    type="link"
                    className="flex items-center space-x-2 text-[#D94B38] font-lato"
                    onClick={() => {
                      Modal.confirm({
                        title: "Confirm",
                        icon: <ExclamationCircleOutlined />,
                        content: "Are you sure you want to delete this user?",
                        okText: "Delete",
                        cancelText: "Cancel",
                        okType: "danger",
                        onOk: () => {
                          deleteMutation.mutate(record?.id);
                        },
                      });
                    }}
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

  // const deleteMutation = useMutation(
  //   ["users"],
  //   async (id) => {
  //     await UsersApi.deleteUser(id);
  //   },
  //   {
  //     onError: (data) => {},
  //     onSuccess: () => {
  //       notification.open({
  //         type: "success",
  //         message: "User deleted successfully",
  //         placement: "top",
  //       });
  //       queryClient.invalidateQueries(["users"]);
  //     },
  //   }
  // );

  const deleteMutation = useMutation(
    async (id) => {
      await axios.delete(
        `https://salon-server-zysoftec.vercel.app/users/${id}`
      );
    },
    {
      onSuccess: () => {
        message.success("User deleted successfully!");
        queryClient.invalidateQueries(["users"]);
      },
    }
  );

  const { data, isLoading, isError } = useQuery(
    ["users"],
    () => UsersApi.getUsers(),
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (data) {
      setAllUser(data);
    }
  }, [data]);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{isError.message}</div>;
  }

  const handleSearch = (value) => {
    const filterData = data.filter((item) => {
      return (
        item.fName.toLowerCase().includes(value.toLowerCase()) ||
        item.lName.toLowerCase().includes(value.toLowerCase()) ||
        item.phone.toLowerCase().includes(value.toLowerCase()) ||
        item.city.toLowerCase().includes(value.toLowerCase()) ||
        item.role.toLowerCase().includes(value.toLowerCase()) ||
        item.postCode.toLowerCase().includes(value.toLowerCase()) ||
        item.email.toLowerCase().includes(value.toLowerCase()) ||
        item.proEnable.toLowerCase().includes(value.toLowerCase())
      );
    });
    setAllUser(filterData);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Modal
        title="Update User"
        footer={null}
        onCancel={handleCancel}
        open={isModalOpen}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <div className="w-full">
          <label>First Name</label>
          <input
            className="w-full p-2 my-3 border-2 border-blue-400 rounded-lg outline-none"
            placeholder="First Name"
            value={fName}
            onChange={(e) => setFName(e.target.value)}
            required
          />
          </div>
          <div className="w-full">
            <label>Last Name</label>
          <input
            className="w-full p-2 my-3 border-2 border-blue-400 rounded-lg outline-none"
            placeholder="Last Name"
            value={lName}
            onChange={(e) => setLName(e.target.value)}
            required
          />
          </div>
          <div className="w-full">
            <label>Phone</label>
          <input
            className="w-full p-2 my-3 border-2 border-blue-400 rounded-lg outline-none"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          </div>
          <div className="w-full">
            <label>Gender</label>
          <select
            className="w-full p-2 my-3 border-2 border-blue-400 rounded-lg outline-none"
            placeholder="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="Male" label="Male">
              Male
            </option>
            <option value="Female" label="Female">
              Female
            </option>
            <option value="Prefer not to say" label="Prefer not to say">
              Prefer not to say
            </option>
          </select>
          </div>
          <div className="w-full">
            <label>Role</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role"
            className="w-full p-2 my-3 border-2 border-blue-400 rounded-lg outline-none"
            required
          />
          </div>
          <div className="w-full">
            <label>City</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="w-full p-2 my-3 border-2 border-blue-400 rounded-lg outline-none"
            required
          />
          </div>
          <div className="w-full">
            <label>Post Code</label>
          <input
            value={postCode}
            onChange={(e) => setPostCode(e.target.value)}
            placeholder="Post Code"
            className="w-full p-2 my-3 border-2 border-blue-400 rounded-lg outline-none"
            required
          />
          </div>
          <div className="w-full">
            <label>Promotion</label>
          <select
            value={proEnable}
            onChange={(e) => setProEnable(e.target.value)}
            placeholder="Promotion"
            className="w-full p-2 my-3 border-2 border-blue-400 rounded-lg outline-none"
            required
          >
            <option value="true" label="Enable">
              Enable
            </option>
            <option value="false" label="Disable">
              Disable
            </option>
          </select>
          </div>
          <button type="submit" className="p-2 text-white btn-primary">
            Update
          </button>
        </form>
      </Modal>
      {showUserModal && (
        <UserModal
          show={showUserModal}
          close={() => {
            setShowUserModal(false);
          }}
          data={Users}
          setData={setUsers}
        />
      )}

      {showFilterModal && (
        <FilterModal
          show={showFilterModal}
          close={() => {
            setShowFilterModal(false);
          }}
          // data={Users}
          // setData={setUsers}
        />
      )}
      <Head>
        <title>Users</title>
      </Head>
      <div className="flex items-center gap-2 mb-8">
        <ColorBar />
        <h2 className="text-2xl font-medium font-lato">Users</h2>
      </div>

      <div className="tableWrapper">
        <div className="UsersHeader">
          <div className="flex flex-col items-start justify-between pb-5 space-y-4 md:space-y-0 sm:space-x-4 sm:flex-row sm:items-end">
            <div className="flex items-center justify-between w-full">
              <Search
                placeholder="Search Users"
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
                className="btn-primary hidden md:inline  bg-[#F26A5A] mr-4 font-lato hover:bg-transparent"
                type="primary"
                size="large"
                icon={<AiFillFilter />}
                onClick={() => setShowFilterModal(true)}
              >
                Filter

              </Button> */}
              <Button
                className="btn-primary  w-[100%] sm:w-[160px] bg-[#F26A5A] font-lato self-end hover:bg-[#F26A5A]"
                type="primary"
                size="large"
                onClick={() => setShowUserModal(true)}
              >
                + Add Users
              </Button>
            </div>
          </div>
        </div>
        <Table
          className="hidden md:block"
          columns={columns}
          dataSource={allUsers}
          pagination={{ defaultPageSize: 4 }}
          scroll={{ x: 1000 }}
        />
        {/* Cards for Mobile */}
        {allUsers?.map((item) => {
          return (
            <div className="bg-[#FBEFEF] flex flex-col items-between justify-center md:hidden p-5 rounded-[10px] ">
              {/* 1st start*/}
              <div className="flex py-2 border-b-solid text-[#777777] border-b-[1px] border-b-[#ffffff] justify-between items-center">
                <h6>
                  First Name
                  <br />
                  <p className="text-[#000000] ">{item?.fName?.charAt(0)?.toUpperCase() + item?.fName?.slice(1)}</p>
                </h6>
                <h6>
                  Last name
                  <br />
                  <p className="text-[#000000]">{item?.lName?.charAt(0)?.toUpperCase() + item?.lName?.slice(1)}</p>
                </h6>

                <Popconfirm
                  className="self-center "
                  placement="right"
                  title={
                    <div className="flex flex-col">
                      <Button
                        type="link"
                        className="flex items-center space-x-2 text-[#2f9379] font-lato"
                        onClick={() => showModal(item)}
                      >
                        <Image
                          src={"/images/edit_icon1.svg"}
                          width={18}
                          height={18}
                        />
                        Edit Details
                      </Button>
                      <Button
                        type="link"
                        className="flex items-center space-x-2 text-[#D94B38] font-lato"
                        onClick={() => {
                          Modal.confirm({
                            title: "Confirm",
                            icon: <ExclamationCircleOutlined />,
                            content:
                              "Are you sure you want to delete this user?",
                            okText: "Delete",
                            cancelText: "Cancel",
                            okType: "danger",
                            onOk: () => {
                              deleteMutation.mutate(item?.id);
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

              {/* 2nd start*/}
              <div className="flex py-2 border-b-solid border-b-[1px]  border-b-[#ffffff] justify-between items-center text-[#777777]">
                <h6>
                  Phone
                  <br />
                  <p className="text-[#000000]">{item?.phone}</p>
                </h6>

                <h6>
                  City
                  <br />
                  <p className="text-[#000000]">{item?.city?.charAt(0)?.toUpperCase() + item?.city?.slice(1)}</p>
                </h6>
                <h6>
                  Gender
                  <br />
                  <p className="text-[#000000]">{item?.gender}</p>
                </h6>
              </div>
              {/* 2nd end */}

              {/* 3rd start*/}
              <div className="flex py-2 border-b-solid border-b-[1px] border-b-[#ffffff] justify-between items-center text-[#777777]">
                <h6>
                  Postal Code
                  <br />
                  <p className="text-[#000000]">{item?.postCode}</p>
                </h6>

                <h6>
                  Role
                  <br />
                  <p className="text-[#000000]">{item?.role?.charAt(0)?.toUpperCase() + item?.role?.slice(1)}</p>
                </h6>
              </div>
              {/* 3rd end */}

              {/* 4th start*/}
              <div className="flex pt-2  justify-between items-center text-[#777]">
                <h6>
                  Email
                  <br />
                  <p className="text-[#000000]">{item?.email}</p>
                </h6>
              </div>
              {/* 4th end */}
            </div>
          );
        })}
        {/* Cards for Mobile */}
      </div>
    </div>
  );
};

export default Index;
