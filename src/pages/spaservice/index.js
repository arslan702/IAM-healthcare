import { Button, Space, Table, Input, Tag, Popconfirm, Modal, notification } from "antd";
import Head from "next/head";
import Image from "next/image";
import { AiFillFilter } from 'react-icons/ai';
import { CiCircleMore } from 'react-icons/ci';
import {
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import ServiceApi from "../../lib/Service";
import ServiceCategoryApi from "../../lib/ServiceCategories";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "../../config/firebase";
import { useRouter } from "next/router";
import BusinessApi from "@/lib/Business";

const { Search } = Input;
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

const ServiceModal = dynamic(() =>
    import("../../components/Service/ServiceModal.js")
);
const FilterModal = dynamic(() =>
    import("../../components/FilterModel/Filter.js")
);

const ServiceCategory = dynamic(() =>
    import("../../components/ServiceCategories/serviceCategories.js")
);
const SpecialistModal = dynamic(() =>
    import("../../components/Specialists/Specialists.js")
);







const Index = () => {
    const router = useRouter()
    const dataaaa = router?.query?.data
    let dataObject
    if (dataaaa) {
        dataObject = JSON.parse(decodeURIComponent(dataaaa))
    }

    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showServiceCategory, setShowServiceCategory] = useState(false);
    const [Service, setService] = useState();
    const [filteredData, setFilteredData] = useState();
    const [filteredServices, setFilteredServices] = useState();
    const [filteredSpecialistsData, setFilteredSpecialistsData] = useState();
    const [showServiceSpecialists, setShowServiceSpecialists] = useState(false);
    const [specialist, setSpecialist] = useState();
    const [category, setCategory] = useState();
    const queryClient = useQueryClient();
    // console.log("USER SALON", user.uid)

    const columns = [
        {
            title: (
                <div className="flex items-center space-x-4">
                    <span className="text-base font-lato font-medium">#</span>
                </div>
            ),
            dataIndex: "no",
            sorter: (a, b) => a.age - b.age,
            render: (_, record) => (
                <div className="w-full flex items-center justify-start">
                    <span className="text-base font-lato font-normal text-[#777777]">
                        {record.number}1
                    </span>
                </div>
            ),
        },
        {
            title: (
                <div className="flex items-center space-x-4">
                    <span className="text-base font-lato font-medium">Service name</span>
                </div>
            ),
            dataIndex: "name",
            render: (_, record) => (
                <div className="w-full flex items-center">
                    <span className="text-base font-lato font-normal text-[#777777]">
                        {record?.name}
                    </span>
                </div>
            ),
        },
        {
            title: (
                <div className="flex items-center whitespace-nowrap space-x-4">
                    <span className="text-base font-lato font-medium">Service Category</span>
                </div>
            ),
            dataIndex: "name",
            render: (_, record) => (
                <div className="w-full flex items-center">
                    <span className="text-base font-lato font-normal text-[#777777]">
                        {record?.Category}
                    </span>
                </div>
            ),
        }
        , {
            title: (
                <div className="flex items-center space-x-4">
                    <span className="text-base font-lato font-medium">Featured</span>
                </div>
            ),
            dataIndex: "country",
            render: (_, record) => (
                <div className="w-full flex items-center justify-start">
                    <span className="text-base max-w-[100px] font-lato font-normal text-[#777777]">
                        {record?.status ? "Yes" : "No"}
                    </span>
                </div>
            ),
        },
        {
            title: (
                <div className="flex items-center space-x-4">
                    <span className="text-base font-lato font-medium">Specialist name</span>
                </div>
            ),
            dataIndex: "phone",
            sorter: (a, b) => a.age - b.age,
            render: (_, record) => (
                <div className="w-full">
                    <div className="text-base font-lato font-normal text-[#777777]">
                        {record?.specialist?.map((item, index) => {
                            return <span key={index}>{item},</span>
                        })}
                    </div>
                </div>
            ),
        },
        {
            title: (
                <div className="flex items-center space-x-4">
                    <span className="text-base font-lato font-medium">Amount</span>
                </div>
            ),
            dataIndex: "amount",
            sorter: (a, b) => a.age - b.age,
            render: (_, record) => (
                <div className="w-full">
                    <span className="text-base font-lato font-normal text-[#777777]">
                        {record?.amount}
                    </span>
                </div>
            ),
        },
        {
            title: (
                <div className="flex items-center space-x-4">
                    <span className="text-base font-lato font-medium">Time</span>
                </div>
            ),
            dataIndex: "time",
            sorter: (a, b) => a.age - b.age,
            render: (_, record) => (
                <div className="w-full">
                    <span className="text-base font-lato font-normal text-[#777777]">
                        {record?.time}
                    </span>
                </div>
            ),
        },
        {
            title: (
                <div className="flex items-center space-x-4">
                    <span className="text-base font-lato font-medium">Description</span>
                </div>
            ),
            dataIndex: "country",
            sorter: (a, b) => a.age - b.age,
            render: (_, record) => (
                <div className="w-full flex items-center justify-start">
                    <span className="text-base max-w-[100px] font-lato font-normal text-[#777777]">
                        {record?.description?.slice(0, 20)}...
                    </span>
                </div>
            ),
        },

        {
            title: (
                <div className="flex items-center justify-center space-x-4">
                    <span className="text-base font-lato font-medium">Actions</span>
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
                                    {/* <Button
                    type="link"
                    className="flex items-center space-x-2 text-[#2f9379] font-poppins hover:text-[#2f9379]"
                  >
                    <Image src={"/images/eye.svg"} width={18} height={18} />
                    View Details
                  </Button> */}
                                    <Button
                                        type="link"
                                        onClick={() => { handleChangeStatus(record?.id, true) }}
                                        className="flex items-center space-x-2 text-[#2f9379] font-lato"
                                    >
                                        <Image
                                            src={"/images/edit_icon1.svg"}
                                            width={18}
                                            height={18}
                                        />
                                        Feature
                                    </Button>
                                    <Button
                                        type="link"
                                        onClick={() => { handleChangeStatus(record?.id, false) }}
                                        className="flex items-center space-x-2 text-[#2f9379] font-lato"
                                    >
                                        <Image
                                            src={"/images/edit_icon1.svg"}
                                            width={18}
                                            height={18}
                                        />
                                        Un Feature
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

    const ServiceColumns = [
        {
            title: (
                <div className="flex items-center justify-center space-x-4">
                    <span className="text-base font-lato font-medium">#</span>
                </div>

            ),
            dataIndex: "index",
            key: "index",
            render: (_, record, index) => {
                return (
                    <div className="flex items-center justify-center space-x-2">
                        <span className="text-base font-lato font-normal text-[#474747]">
                            {index + 1}
                        </span>
                    </div>
                );
            },
            sorter: (a, b) => a.index - b.index,

        },
        {
            title: (
                <div className="flex items-center justify-center space-x-4 w-full">
                    <span className="text-base font-lato font-medium">
                        Category Name
                    </span>
                </div>
            ),
            dataIndex: "name",
            key: "name",
            render: (_, record) => {
                return record?.name ? (
                    <div className="flex items-center justify-center space-x-2">
                        <span className="text-base font-lato font-normal text-[#474747]">
                            {record?.name

                            }
                        </span>
                    </div>
                ) : (
                    "N/A"
                );
            },
            // filteredValue: [searchedText],
            onFilter: (value, record) => {
                return String(record.name).toLowerCase().includes(value.toLowerCase());
            },
            sorter: (a, b) => a.name - b.name,
        },
        {
            title: (
                <div className="flex items-center justify-center space-x-4">
                    <span className="text-base font-lato font-medium">Actions</span>
                </div>
            ),
            key: "actions",
            render: (_, record) => {
                return (
                    <div className="flex items-center justify-center">
                        <Popconfirm
                            placement="left"
                            title={
                                <div className="flex flex-col">
                                    {/* <Button
                                        type="link"
                                        className="flex items-center space-x-2 text-[#2f9379] font-lato"
                                        onClick={() => {
                                            setCategory(record);
                                            setShowServiceCategory(true);
                                        }}
                                    >
                                        <Image
                                            src={"/images/edit_icon1.svg"}
                                            width={18}
                                            height={18}
                                        />
                                        Edit Details
                                    </Button> */}
                                    <Button
                                        type="link"
                                        className="flex items-center space-x-2 text-[#D94B38] font-lato"
                                        onClick={() => {
                                            Modal.confirm({
                                                title: "Confirm",
                                                icon: <ExclamationCircleOutlined />,
                                                content:
                                                    "Are you sure you want to delete this category?",
                                                okText: "Delete",
                                                cancelText: "Cancel",
                                                okType: "danger",
                                                onOk: () => {
                                                    deleteServiceCategoryMutation.mutate(record?.id);
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

    const SpecialistsColumns = [
        {
            title: (
                <div className="flex items-center justify-center space-x-4">
                    <span className="text-base font-lato font-medium">#</span>
                </div>

            ),
            dataIndex: "index",
            key: "index",
            render: (_, record, index) => {
                return (
                    <div className="flex items-center justify-center space-x-2">
                        <span className="text-base font-lato font-normal text-[#474747]">
                            {index + 1}
                        </span>
                    </div>
                );
            },
            sorter: (a, b) => a.index - b.index,

        },
        {
            title: (
                <div className="flex items-center justify-center space-x-4 w-full">
                    <span className="text-base font-lato font-medium">
                        Specialist Name
                    </span>
                </div>
            ),
            dataIndex: "name",
            key: "name",
            render: (_, record) => {
                return record?.name ? (
                    <div className="flex items-center justify-center space-x-2">
                        <span className="text-base font-lato font-normal text-[#474747]">
                            {record?.name}
                        </span>
                    </div>
                ) : (
                    "N/A"
                );
            },
            // filteredValue: [searchedText],
            onFilter: (value, record) => {
                return String(record.name).toLowerCase().includes(value.toLowerCase());
            },
            sorter: (a, b) => a.name - b.name,
        },
        {
            title: (
                <div className="flex items-center justify-center space-x-4">
                    <span className="text-base font-lato font-medium">Actions</span>
                </div>
            ),
            key: "actions",
            render: (_, record) => {
                return (
                    <div className="flex items-center justify-center">
                        <Popconfirm
                            placement="left"
                            title={
                                <div className="flex flex-col">
                                    {/* <Button
                                        type="link"
                                        className="flex items-center space-x-2 text-[#2f9379] font-lato"
                                        onClick={() => {
                                            setSpecialist(record);
                                            setShowServiceSpecialists(true);
                                        }}
                                    >
                                        <Image
                                            src={"/images/edit_icon1.svg"}
                                            width={18}
                                            height={18}
                                        />
                                        Edit Details
                                    </Button> */}
                                    <Button
                                        type="link"
                                        className="flex items-center space-x-2 text-[#D94B38] font-lato"
                                        onClick={() => {
                                            Modal.confirm({
                                                title: "Confirm",
                                                icon: <ExclamationCircleOutlined />,
                                                content:
                                                    "Are you sure you want to delete this category?",
                                                okText: "Delete",
                                                cancelText: "Cancel",
                                                okType: "danger",
                                                onOk: () => {
                                                    deleteServiceSpecialistsMutation.mutate(record?.id);
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

    const deleteMutation = useMutation(
        ["services"],
        async (id) => {
            await ServiceApi.deleteService(id);
        },
        {
            onSettled: () => {
                queryClient.invalidateQueries(["services"]);
            },
            onError: (data) => { },
            onSuccess: () => {
                notification.open({
                    type: "success",
                    message: "Service deleted successfully",
                    placement: "top",
                });

                const fetchServices = async () => {

                    const data = await ServiceApi.getServices(dataObject);
                    setFilteredServices(data)
                };
                fetchServices();

                // queryClient.invalidateQueries(["services"]);
            },
        }
    );
    const deleteServiceCategoryMutation = useMutation(
        ["ServicesCategory"],
        async (id) => {
            await ServiceCategoryApi.deleteServiceCategory(id);
        },
        {
            onSettled: () => {
                queryClient.invalidateQueries(["ServicesCategory"]);
            },
            onError: (data) => { },
            onSuccess: () => {
                notification.open({
                    type: "success",
                    message: "Category deleted successfully",
                    placement: "top",
                });
                const fetchServices = async () => {
                    const data = await ServiceCategoryApi.getServiceCategories(dataObject);
                    setFilteredData(data)
                };
                fetchServices();
                // queryClient.invalidateQueries(["ServicesCategory"]);
            },
        }
    );

    const deleteServiceSpecialistsMutation = useMutation(
        ["Specialists"],
        async (id) => {
            await ServiceCategoryApi.deleteSpecialists(id);
        },
        {
            onSettled: () => {
                queryClient.invalidateQueries(["Specialists"]);
            },
            onError: (data) => { },
            onSuccess: () => {
                notification.open({
                    type: "success",
                    message: "Category deleted successfully",
                    placement: "top",
                });
                const fetchSpecialists = async () => {
                    const data = await ServiceCategoryApi.getSpecialists(dataObject);
                    setFilteredSpecialistsData(data)
                };
                fetchSpecialists();
                // queryClient.invalidateQueries(["ServicesCategory"]);
            },
        }
    );



    const { data, isLoading, isError } = useQuery(
        ["services"],
        async () => {
            const data = await ServiceApi.getServices(dataObject);
            return data;
        },
        // {
        //     initialData: Services,
        // }
    );


    const { data: ServiceData, isLoading: ServiceLoading, isError: ServiceError } = useQuery(
        ["ServicesCategory"],
        async () => {
            const data = await ServiceCategoryApi.getServiceCategories(dataObject);
            return data;
        },
        // {
        //     initialData: ServicesCategory,
        // }
    );
    const { data: SpecialistData, isLoading: SpecialistDataLoading, isError: SpecialistDataError } = useQuery(
        ["Specialists"],
        async () => {
            const data = await ServiceCategoryApi.getSpecialists(dataObject);
            return data;
        },
        // {
        //     initialData: ServicesCategory,
        // }
    );

    const handleSearch2 = (value) => {
        const filter = data.filter((item) => {
            return item.Category.toLowerCase().includes(value.toLowerCase()) || item.name.toLowerCase().includes(value.toLowerCase()) || item.description.toLowerCase().includes(value.toLowerCase()) || item.amount.toLowerCase().includes(value.toLowerCase());
        })
        setFilteredServices(filter);

    }

    const handleSearchCategories = (value) => {
        const filter = ServiceData.filter((item) => {
            return item.name.toLowerCase().includes(value.toLowerCase());
        })
        setFilteredData(filter);
    }
    const handleSearchSpecialists = (value) => {
        const filter = SpecialistData.filter((item) => {
            return item.name.toLowerCase().includes(value.toLowerCase());
        })
        setFilteredSpecialistsData(filter);
    }

    useEffect(() => {

        const fetchServices = async () => {
            const data = await ServiceCategoryApi.getServiceCategories(dataObject);
            setFilteredData(data)
        };
        fetchServices();
        //eslint-disable-next-line
    }, [ServiceData])
    useEffect(() => {
        const fetchServices = async () => {

            const data = await ServiceApi.getServices(dataObject);
            setFilteredServices(data)
        };
        fetchServices();
        //eslint-disable-next-line
    }, [data])
    useEffect(() => {
        const fetchServices = async () => {

            const data = await ServiceCategoryApi.getSpecialists(dataObject);
            setFilteredSpecialistsData(data)
        };
        fetchServices();
        //eslint-disable-next-line
    }, [SpecialistData])
    if (isLoading) {
        return <h1>Loading...</h1>
    }
    else if (isError) {
        return <h1>{isError}</h1>
    }
    const handleChangeStatus = async (id, status) => {
        try {
            await ServiceCategoryApi.updateServiceStatus(id, status);
            const data = await ServiceApi.getServices(dataObject);
            setFilteredServices(data)
            notification.open({
                type: "success",
                message: "Service updated successfully",
                placement: "top",
            });
            
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            {showServiceModal && (
                <ServiceModal
                    show={showServiceModal}
                    close={() => {
                        setShowServiceModal(false);
                    }}
                    data={Service}
                    setData={setService}
                />
            )}

            {showServiceCategory && (
                <ServiceCategory
                    show={showServiceCategory}
                    close={() => {
                        setShowServiceCategory(false);
                    }}
                    data={category}
                    setData={setCategory}
                />
            )}
            {showServiceSpecialists && (
                <SpecialistModal
                    show={showServiceSpecialists}
                    close={() => {
                        setShowServiceSpecialists(false);
                    }}
                    data={specialist}
                    setData={setCategory}
                />
            )}

            {showFilterModal && (
                <FilterModal
                    show={showFilterModal}
                    close={() => {
                        setShowFilterModal(false);
                    }}
                // data={Service}
                // setData={setService}
                />
            )}
            <Head>
                <title>Services</title>
            </Head>
            <h2 className="text-2xl font-lato font-medium">Services</h2>
            <div className="tableWrapper">
                <div className="ServiceHeader">
                    <div className="flex space-y-4 md:space-y-0 sm:space-x-4 flex-col sm:flex-row items-start sm:items-end justify-between pb-5">
                        <div className="flex w-full justify-between items-center">
                            <Search
                                placeholder="Search Services"
                                allowClear
                                size="large"
                                onSearch={(value) => handleSearch2(value)}
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
                                className="btn-primary mr-2  w-[100%] sm:w-[160px] bg-[#F26A5A] font-lato self-end hover:bg-[#F26A5A]"
                                type="primary"

                                size="large"
                                onClick={() => setShowServiceCategory(true)}
                            >
                                +   Add Categories
                            </Button> */}
                            {/* <Button
                                className="btn-primary  w-[100%] sm:w-[160px] bg-[#F26A5A] font-lato self-end hover:bg-[#F26A5A]"
                                type="primary"

                                size="large"
                                onClick={() => { setShowServiceModal(true); }}
                            >
                                +   Add Services
                            </Button> */}
                        </div>

                    </div>
                </div>
                <Table
                    className="hidden md:block"
                    // loading={isLoading}
                    columns={columns}
                    dataSource={filteredServices}
                    pagination={{ defaultPageSize: 4 }}
                    // className="table"
                    scroll={{ x: 1000 }}
                />
                {/* Cards for Mobile */}
                {filteredServices?.map((item, index) => {
                    return <div key={index} className="bg-[#FBEFEF] flex flex-col items-between justify-center md:hidden p-5 rounded-[10px] ">

                        {/* 1st start*/}
                        <div className="flex py-2 border-b-solid text-[#777777] border-b-[1px] border-b-[#ffffff] justify-between items-center">
                            <h6 className="text-[12px]">
                                Service name<br /><p className="text-[#000000] ">{item?.name}</p>
                            </h6>
                            <h6>

                                Specialist name<br /><div className="text-[#000000]">{item?.specialist},</div>
                            </h6>

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
                                            onClick={() => { handleChangeStatus(item?.id, true) }}
                                            className="flex items-center space-x-2 text-[#2f9379] font-lato"
                                        >
                                            <Image
                                                src={"/images/edit_icon1.svg"}
                                                width={18}
                                                height={18}
                                            />
                                            Feature
                                        </Button>
                                        <Button
                                            type="link"
                                            onClick={() => { handleChangeStatus(item?.id, false) }}
                                            className="flex items-center space-x-2 text-[#2f9379] font-lato"
                                        >
                                            <Image
                                                src={"/images/edit_icon1.svg"}
                                                width={18}
                                                height={18}
                                            />
                                            UnFeatured
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
                        {/* 1st end */}

                        {/* 2nd start*/}
                        <div className="flex py-2 border-b-solid border-b-[1px]  border-b-[#ffffff] justify-between items-center text-[#777777]">
                            <h6>
                                Amount<br /><p className="text-[#000000]">{item?.amount}</p>
                            </h6>
                            <h6>
                                Category<br /><p className="text-[#000000]">{item?.Category}</p>
                            </h6>

                        </div>

                        <div className="flex py-2 border-b-solid border-b-[1px]  border-b-[#ffffff] justify-between items-center text-[#777777]">
                            <h6 className="">
                                Description<br /><p className="text-[#000000]">{item?.description}</p>
                            </h6>
                        </div>





                    </div>
                })}
                {/* Cards for Mobile */}
            </div>

            <h2 className="text-2xl font-lato font-medium mt-5"> Service Categories</h2>

            <div className="tableWrapper">
                <div className="categoryHeader">
                    <div className="flex space-y-4 md:space-y-0 sm:space-x-4 flex-col sm:flex-row items-start sm:items-end justify-between pb-5">
                        <div className="flex w-full justify-between items-center">
                            <Search
                                placeholder="Search Category"
                                allowClear
                                size="large"
                                onSearch={(value) => handleSearchCategories(value)}
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
                            {/* <Button
                                className="btn-primary mr-2  w-[100%] sm:w-[160px] bg-[#F26A5A] font-lato self-end hover:bg-[#F26A5A]"
                                type="primary"

                                size="large"
                                onClick={() => setShowServiceCategory(true)}
                            >
                                +   Add  Category
                            </Button> */}
                        </div>


                    </div>
                </div>
                <Table
                    loading={isLoading}
                    className="hidden md:block"
                    columns={ServiceColumns}
                    dataSource={filteredData}
                    pagination={{ defaultPageSize: 4 }}
                    // className="table"
                    scroll={{ x: 1000 }}
                />
                {/* Cards for Mobile */}
                {filteredData?.map((item, index) => {
                    return <div key={index} className="bg-[#FBEFEF] flex flex-col items-between justify-center md:hidden p-5 rounded-[10px] ">
                        {/* 1st start*/}
                        <div className="flex py-2 border-b-solid text-[#777 777] border-b-[1px] border-b-[#ffffff] justify-between items-center">
                            <h6 className="text-[12px]">
                                Category Name<br /><p className="text-[#000000] ">{item?.name}</p>
                            </h6>
                            {/* <h6>
                Business<br /><p className="text-[#000000]">Salon</p>
              </h6>
              <h6>
                Category<br /><p className="text-[#000000]">Salon</p>
              </h6> */}
                            <Popconfirm
                                placement="left"
                                title={
                                    <div className="flex flex-col">
                                        {/* <Button
                                            type="link"
                                            className="flex items-center space-x-2 text-[#2f9379] font-lato"
                                            onClick={() => {
                                                setCategory(record);
                                                setShowServiceCategory(true);
                                            }}
                                        >
                                            <Image
                                                src={"/images/edit_icon1.svg"}
                                                width={18}
                                                height={18}
                                            />
                                            Edit Details
                                        </Button> */}
                                        <Button
                                            type="link"
                                            className="flex items-center space-x-2 text-[#D94B38] font-lato"
                                            onClick={() => {
                                                Modal.confirm({
                                                    title: "Confirm",
                                                    icon: <ExclamationCircleOutlined />,
                                                    content:
                                                        "Are you sure you want to delete this category?",
                                                    okText: "Delete",
                                                    cancelText: "Cancel",
                                                    okType: "danger",
                                                    onOk: () => {
                                                        deleteServiceCategoryMutation.mutate(item?.id);
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
                    </div>
                })}
                {/* Cards for Mobile */}
            </div>








            <h2 className="text-2xl font-lato font-medium mt-5">
                Specialists
            </h2>

            <div className="tableWrapper">
                <div className="categoryHeader">
                    <div className="flex space-y-4 md:space-y-0 sm:space-x-4 flex-col sm:flex-row items-start sm:items-end justify-between pb-5">
                        <div className="flex w-full justify-between items-center">
                            <Search
                                placeholder="Search Specialists"
                                allowClear
                                size="large"
                                onSearch={(value) => handleSearchSpecialists(value)}
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
                            {/* <Button
                                className="btn-primary mr-2  w-[100%] sm:w-[160px] bg-[#F26A5A] font-lato self-end hover:bg-[#F26A5A]"
                                type="primary"

                                size="large"
                                onClick={() => setShowServiceSpecialists(true)}
                            >
                                +   Add  Specialist
                            </Button> */}
                        </div>


                    </div>
                </div>
                <Table
                    loading={isLoading}
                    className="hidden md:block"
                    columns={SpecialistsColumns}
                    dataSource={filteredSpecialistsData}
                    pagination={{ defaultPageSize: 4 }}
                    // className="table"
                    scroll={{ x: 1000 }}
                />
                {/* Cards for Mobile */}
                {filteredSpecialistsData?.map((item, index) => {
                    return <div key={index} className="bg-[#FBEFEF] flex flex-col items-between justify-center md:hidden p-5 rounded-[10px] ">
                        {/* 1st start*/}
                        <div className="flex py-2 border-b-solid text-[#777 777] border-b-[1px] border-b-[#ffffff] justify-between items-center">
                            <h6 className="text-[12px]">
                                Specialists Name<br /><p className="text-[#000000] ">{item?.name}</p>
                            </h6>
                            {/* <h6>
                Business<br /><p className="text-[#000000]">Salon</p>
              </h6>
              <h6>
                Category<br /><p className="text-[#000000]">Salon</p>
              </h6> */}
                            <Popconfirm
                                placement="left"
                                title={
                                    <div className="flex flex-col">
                                        {/* <Button
                                            type="link"
                                            className="flex items-center space-x-2 text-[#2f9379] font-lato"
                                            onClick={() => {
                                                setSpecialist(record);
                                                setShowServiceSpecialists(true);
                                            }}
                                        >
                                            <Image
                                                src={"/images/edit_icon1.svg"}
                                                width={18}
                                                height={18}
                                            />
                                            Edit Details
                                        </Button> */}
                                        <Button
                                            type="link"
                                            className="flex items-center space-x-2 text-[#D94B38] font-lato"
                                            onClick={() => {
                                                Modal.confirm({
                                                    title: "Confirm",
                                                    icon: <ExclamationCircleOutlined />,
                                                    content:
                                                        "Are you sure you want to delete this category?",
                                                    okText: "Delete",
                                                    cancelText: "Cancel",
                                                    okType: "danger",
                                                    onOk: () => {
                                                        deleteServiceSpecialistsMutation.mutate(item?.id);
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
                    </div>
                })}
                {/* Cards for Mobile */}
            </div>
        </div>
    );
};

export default Index;