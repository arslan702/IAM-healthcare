import ServiceApi from "../../lib/Service";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Select, notification } from "antd";
const { Option } = Select;
import ServiceCategory from "@/lib/ServiceCategories";
import BusinessApi from "../../lib/Business.js";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from "uuid";
import { useState, useRef } from "react";
import ServiceCategoryApi from "../../lib/ServiceCategories";

import { FiUpload } from "react-icons/fi";
import { auth, storage } from "../../config/firebase";

// const Storage = getStorage(storage);


const ServiceModal = (props) => {
    const hiddenFileInput = useRef(null);
    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [text, setText] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPrevious, setIsPrevious] = useState(props?.data?.image);


    const user = auth.currentUser
    const options = [];
    for (let i = 10; i < 36; i++) {
        options.push({
            label: i.toString(36) + i,
            value: i.toString(36) + i,
        });
    }
    const handleClick = (event) => {
        event.preventDefault()
        hiddenFileInput.current.click();
    };
    const handleChange = (event) => {
        event.preventDefault()

        //if size is greater than 2mb then show error
        if (event.target.files[0].size > 2097152) {
            notification.open({
                type: "error",
                message: "File size should be less than 2mb",
                placement: "top",
            });
            return;
        } else {
            const fileUploaded = event.target.files[0];
            setSelectedFile(fileUploaded);

            setFileName(fileUploaded.name);
            setText(true);
        }
    };
    // console.log("Service", props.data);
    const queryClient = useQueryClient();
    const addMutation = useMutation(
        ["services"],
        async (data) => {
            return await ServiceApi.addService(data);
        },
        {
            onError: (data) => { },
            onSuccess: (data) => {
                setLoading(false)
                // console.log("data in api", data);
                notification.open({
                    type: data?.code === 1 ? "success" : "error",
                    message: data?.message,
                    placement: "top",
                });
                queryClient.invalidateQueries(["services"]);
                props.close();
            },
        }
    );

    const updateMutation = useMutation(
        ["services"],
        async ({ id, Service }) => {
            await ServiceApi.updateService(id, Service);
            setLoading(false);
        },
        {
            onSettled: () => {
                queryClient.invalidateQueries(["services"]);
            },
            onError: (data) => { },
            onSuccess: () => {
                notification.open({
                    type: "success",
                    message: "Service updated successfully",
                    placement: "top",
                });
                // queryClient.invalidateQueries(["services"]);
                props.setData(null);
                props.close();
            },
        }
    );

    const handleSubmit = async (values) => {
        setLoading(true);
        values.createdAt = new Date();
        // console.log("values", values);
        let slug = values.name
            .replace(/ /g, "-")
            .replace(/\?/g, "")
            .replace(/,/g, "")
            .replace(/"/g, "")
            .replace(/'/g, "")
            .toLowerCase();
        if (props.data) {

            if (!selectedFile) {
                const updatedFormData = { ...values, name: values?.name?.toLowerCase(), SpaEmail: user.email };

                updateMutation.mutate({
                    id: props?.data?.id,
                    Service: updatedFormData,
                    slug,
                });
                return;
            } else {
                try {
                    const storageRef = ref(storage, `${uuidv4()}_${selectedFile.name}`);
                    await uploadBytes(storageRef, selectedFile);
                    const fileUrl = await getDownloadURL(storageRef);

                    // Set the URL in state
                    // setUploadFile(fileUrl);
                    // console.log('Uploaded file URL:', fileUrl);

                    // Set the file name
                    setFileName(selectedFile.name);
                    const updatedFormData = { ...values, name: values?.name?.toLowerCase(), SpaEmail: user.email, image: fileUrl };

                    updateMutation.mutate({
                        id: props?.data?.id,
                        Service: updatedFormData,
                        slug,
                    });
                } catch (error) {
                    console.log(error);
                }
            }

        } else {
            if (!selectedFile) {
                notification.open({
                    type: "error",
                    message: "Please upload a file",
                    placement: "top",
                });
                return;
            } else {
                try {
                    const storageRef = ref(storage, `${uuidv4()}_${selectedFile.name}`);
                    await uploadBytes(storageRef, selectedFile);
                    const fileUrl = await getDownloadURL(storageRef);

                    // Set the URL in state
                    // setUploadFile(fileUrl);
                    // console.log('Uploaded file URL:', fileUrl);

                    // Set the file name
                    setFileName(selectedFile.name);
                    const updatedFormData = { ...values, name: values?.name?.toLowerCase(), SpaEmail: user.email, image: fileUrl };
                    // console.log("updatedFormData", updatedFormData);
                    addMutation.mutate(updatedFormData);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };


    const { data: ServiceData, isLoading: ServiceLoading, isError: ServiceError } = useQuery(
        ["servicesCategory"],
        async () => {
            const data = await ServiceCategoryApi.getServiceCategories(user.email);
            return data;
        },
        // {
        //     initialData: ServicesCategory,
        // }
    );
    const { data: specialists, isLoading: specialistsLoading, isError: specialistsError } = useQuery(
        ["Specialists"],
        async () => {
            const data = await ServiceCategory.getSpecialists(user.email);
            return data;
        },
        // {
        //     initialData: ServicesCategory,
        // }
    );

    let userId
    try {
        const user = auth.currentUser
        userId = user.uid
    } catch (error) {
        console.log(error)
    }

    const { data: SPAData, isLoading, isError } = useQuery(
        ["businesses"],
        async () => {
            try {
                const data = await BusinessApi.getSalonsByUserId(userId);
                // console.log("Fetched data:", data); // Add this line to log the fetched data
                return data;
            } catch (error) {
                console.error("Error fetching data:", error); // Log the error
                throw error; // Rethrow the error to be caught by React Query
            }
        }
    );
    // console.log("SPA", SPAData)

    return (
        <Modal
            title={props?.data ? "Update Service" : "Add New Service"}
            open={props.show}
            footer={null}
            onCancel={() => {
                props.setData(null);
                props.close();
            }}
        >
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                <Form
                    size="large"
                    name="basic"
                    initialValues={{
                        name: props?.data?.name && props.data.name,
                        time: props?.data?.time && props.data.time,
                        specialist: props?.data?.specialist && props.data.specialist,
                        amount: props?.data?.amount && props.data.amount,
                        description: props?.data?.description && props.data.description,
                        Category: props?.data?.Category && props.data.Category,

                    }}
                    onFinish={handleSubmit}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        width: "100%",
                    }}
                >
                    <Form.Item
                        style={{ width: "100%" }}
                        name="Category"
                        rules={[
                            {
                                required: true,
                                message: "Select Category",
                            },
                        ]}
                    >
                        <Select className="text-[#000000]"
                            allowClear
                            autoClearSearchValue
                            placeholder="Service Categories" style={{ width: "100%" }} >
                            <Option value="0">---Select Category---</Option>
                            {ServiceData?.map((object, index) => (
                                <Option key={index} value={object?.name}>
                                    {object?.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        style={{ width: "100%" }}
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Input Service name",
                            },
                        ]}
                    >
                        <Input placeholder="Service name" style={{ width: "100%" }} />
                    </Form.Item>


                    <Form.Item
                        style={{ width: "100%" }}
                        name="time"
                        rules={[
                            {
                                required: true,
                                message: "Input time",
                            },
                        ]}
                    >
                        <Select className="text-[#000000]"
                            allowClear
                            placeholder="Service time" style={{ width: "100%" }} >
                            <Option value="10 Minutes">10 Minutes</Option>
                            <Option value="20 Minutes">20 Minutes</Option>
                            <Option value="30 Minutes">30 Minutes</Option>
                            <Option value="45 Minutes">45 Minutes</Option>
                            <Option value="1 Hour">1 Hour</Option>
                            <Option value="2 Hours">2 Hours</Option>
                        </Select>
                    </Form.Item>


                    <Form.Item
                        style={{ width: "100%" }}
                        name="specialist"
                        rules={[
                            {
                                required: true,
                                message: "Input Specialists names",
                            },
                        ]}
                    >
                        <Select mode="multiple"
                            allowClear
                            placeholder="Specialists names" style={{ width: "100%" }}>
                            {specialists?.map((object, index) => (
                                <Option key={index} value={object?.name}>
                                    {object?.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        style={{ width: "100%" }}
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: "Input Amount",
                            },
                        ]}
                    >
                        <Input placeholder="Amount " type="number" style={{ width: "100%" }} />
                    </Form.Item>

                    <div class=" h-[50px]  border border-gray  rounded bg-white w-full mb-4 ">
                        <div className="flex justify-start  pl-5 items-center w-full h-full">
                            {/* <FileUploader handleFile={handleFile} /> */}
                            <>
                                <button className=" flex justify-start items-center" onClick={handleClick}>
                                    <FiUpload size={30} color="#F26A5A" className="mr-4" /> {text ? null : <p className="opacity-50">
                                        {props?.data?.image ? "Change Image" : "Upload Image"}
                                    </p>}
                                </button>
                                <input
                                    type="file"
                                    onChange={handleChange}
                                    ref={hiddenFileInput}
                                    style={{ display: "none" }} // Make the file input element invisible
                                />
                            </>
                            {fileName ? <p>File Uploaded</p> : null}

                            {/* <input
                        onChange={handleFileChange}
                        name="uploadFile"
                        id="uploadFile"
                        type="file"
                        class="w-full   h-full px-4"
                        placeholder="File"


                      /> */}

                        </div>
                        {/* {errors.uploadFile && <div className=" bg-[#F26A5A] px-1 justify-center  flex items-center max-w-[80%] whitespace-nowrap rounded-lg  text-[#ffffff] mb-1 mt-1  mt-0">{errors.uploadFile}</div>} */}
                    </div>
                    {/* {
                        props.data ? null :
                            
                    } */}


                    <Form.Item
                        style={{ width: "100%" }}
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: "Input Description",
                            },
                        ]}
                    >
                        <Input placeholder="Description " style={{ width: "100%" }} />
                    </Form.Item>



                    <Form.Item>
                        <Button
                            className="btn-primary"
                            size="large"
                            type="primary"
                            htmlType="submit"
                        >
                            {loading
                                ? "Submitting..."
                                : "Submit"}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default ServiceModal;
