// import SPAApi from "@/lib/SPA";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Select, notification } from "antd";
import BusinessApi from "@/lib/Business";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { message, Upload } from "antd";

// const Storage = getStorage(storage);

import { UploadOutlined } from "@ant-design/icons";
import { auth, db, storage } from "@/config/firebase";
import { useRef } from "react";
import { useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SPAModal = (props) => {
  const [dataCategories, setDataCategories] = useState([]);
  const locationRef = useRef(null);

  useEffect(() => {
    locationRef.current.value = props?.data?.businessAddress;
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAFEgtW53QLdmIitsBoyYXIoq-roFHyC7I&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      const options = {
        componentRestrictions: { country: [] }, // Remove any country restriction
        fields: ["address_components", "geometry", "icon", "name"],
        strictBounds: false,
      };

      const autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById("pac-input"),
        options
      );

      autocomplete.setFields(["place_id", "geometry", "name"]);
    };

    loadGoogleMapsScript();
  }, []);

  // console.log("SPA", props.data);
  const queryClient = useQueryClient();
  const addMutation = useMutation(
    ["businesses"],
    async (data) => {
      return await BusinessApi.addBusiness(data);
    },
    {
      onError: (data) => {},
      onSuccess: (data) => {
        // console.log("data in api", data);
        notification.open({
          type: data?.code === 1 ? "success" : "error",
          message: data?.message,
          placement: "top",
        });
        queryClient.invalidateQueries(["businesses"]);
        props.close();
      },
    }
  );

  const [selectedFile, setSelectedFile] = useState([]);
  const [profFile, setProfFile] = useState([]);
  const [uploadFile, setUploadFile] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = async ({ file }) => {
    // Update the state with the new fileList
    // console.log({file})
    setSelectedFile(file.originFileObj);
    // console.log("FILE NAME", selectedFile.name);
  };

  const handleProfFileChange = async ({ file }) => {
    // Update the state with the new fileList
    // console.log({file})
    setProfFile(file?.originFileObj);
    // console.log("FILE NAME", file?.name);
  };

  // console.log("MODEL UPDATE DATA", props);

  const updateMutation = useMutation(
    ["businesses"],
    async ({ id, SPA }) => {
      await BusinessApi.updateBusiness(id, SPA);
    },
    {
      onError: (data) => {},
      onSuccess: () => {
        notification.open({
          type: "success",
          message: "SPA updated successfully",
          placement: "top",
        });
        queryClient.invalidateQueries(["businesses"]);
        props.setData(null);
        props.close();
      },
    }
  );

  const handleSubmit = async (values) => {
    // console.log("values", values);
    let slug = values.name
      .replace(/ /g, "-")
      .replace(/\?/g, "")
      .replace(/,/g, "")
      .replace(/"/g, "")
      .replace(/'/g, "")
      .toLowerCase();
    if (props.data) {
      // if (selectedFile) {
      // const storageRef = ref(Storage, `${uuidv4()}_${selectedFile.name}`);

      // try {
      //     await uploadBytes(storageRef, selectedFile);

      //     try {
      //         const fileUrl = await getDownloadURL(storageRef);
      //         setUploadFile(fileUrl);
      //         setFileName(selectedFile.name);
      //         values['file'] = fileUrl; // Adding a new property

      //     } catch (error) {
      //         console.log("DOWNLOAD URL ERROR", error)
      //     }

      // } catch (error) {
      //     console.error('Error uploading file:', error);
      // }

      // setErrors("")
      // console.log("UPLOADED DATA", values);
      updateMutation.mutate({
        id: props?.data?.id,
        SPA: {...values, businessAddress: locationRef?.current?.value },
        // slug,
      });
      // }
      // else {

      //     // setErrors("")
      //     updateMutation.mutate({
      //         id: props?.data?.id,
      //         SPA: values,
      //         // slug,
      //     });
      // }
    } else {
      await createUserWithEmailAndPassword(
        auth,
        values?.email,
        values?.password
      ).then(async (userCredential) => {
        const user = userCredential?.user;
        const salonId = user?.uid;
        if (selectedFile) {
          const storageRef = ref(storage, `${uuidv4()}_${selectedFile.name}`);
  
          try {
            await uploadBytes(storageRef, selectedFile);
            const fileUrl = await getDownloadURL(storageRef);
            // console.log("UPLOADED URL", fileUrl);
  
            setUploadFile(fileUrl);
            values["file"] = fileUrl; // Adding a new property
  
            setFileName(selectedFile.name);
            // let proffUrl = "";
            //     // }
            //     if (profFile !== null) {
            //       const proffRef = ref(
            //         Storage,
            //         `${uuidv4()}_${profFile?.name}`
            //       );
            //       await uploadBytes(proffRef, profFile);
            //       try {
            //         proffUrl = await getDownloadURL(profRef);
            //         values["proffFile"] = proffUrl;
            //       } catch (error) {}
            //     } else if (!profFile) {
            //       console.log("upload business proff file")
            //       return;
            //     }
          } catch (error) {
            console.error("Error uploading file:", error);
          }
  
          // setErrors("")
          // console.log("UPLOADED DATA", values);
          addMutation.mutate({...values, businessAddress: locationRef.current.value, salonId });
        } else {
          // setErrors("")
          addMutation.mutate({...values, businessAddress: locationRef.current.value, salonId });
        }
      }).catch((err) => {
        console.log({err})
      })
    }
  };

  const prop = {
    multiple: false,

    selectedFile,
    onChange: handleFileChange,
    // Other props like action, beforeUpload, etc.
  };

  const proffProp = {
    multiple: false,

    file: profFile,
    onChange: handleProfFileChange,
    // Other props like action, beforeUpload, etc.
  };

  const getCategories = async () => {
    const ref = collection(db, "categories");
    const res = await getDocs(ref);
    let docs = [];
    if (res.docs.length <= 0) {
      return [];
    } else {
      res.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      return docs;
    }
  };
  // getCategories().then((data) => {
  //   setDataCategories(data);
  // });
  return (
    <Modal
      title={props?.data ? "Update Business" : "Add New Business"}
      open={props.show}
      footer={null}
      onCancel={() => {
        props.setData(null);
        props.close();
      }}
    >
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Form
          layout="vertical"
          size="large"
          name="basic"
          initialValues={{
            name: props?.data?.name ? props?.data?.name : "",
            // isFeatured: props?.data?.isFeatured ? props?.data?.isFeatured : "",
            businessName: props?.data?.businessName
              ? props?.data?.businessName
              : "",
            email: props?.data?.email ? props?.data?.email : "",
            postCode: props?.data?.postCode ? props?.data?.postCode : "",
            city: props?.data?.city ? props?.data?.city : "",
            businessContact: props?.data?.businessContact
              ? props?.data?.businessContact
              : "",
            contactNumber: props?.data?.contactNumber
              ? props?.data?.contactNumber
              : "",
            // category: props?.data?.category ? props?.data?.category : "",
            numberEmployees: props?.data?.numberEmployees
              ? props?.data?.numberEmployees
              : "",
            province: props?.data?.province ? props?.data?.province : "",
            // websiteLink: props?.data?.websiteLink ? props?.data?.websiteLink : "",
            businessType: props?.data?.businessType
              ? props?.data?.businessType
              : "",
            businessAddress: props?.data?.businessAddress
              ? props?.data?.businessAddress
              : "",
            role: props?.data?.role ? props?.data?.role : "",
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
            name="role"
            label="Role"
            rules={[
              {
                required: true,
                message: "Select Role",
              },
            ]}
          >
            <Select style={{ width: "100%" }}>
              <Option key="Spa" values="spa">
                Spa
              </Option>
              <Option key="Salon" values="salon">
                Salon
              </Option>
              <Option key="treatments" values="treatments">
                Treatments
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            style={{ width: "100%" }}
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Input SPA name",
              },
            ]}
          >
            <Input placeholder="Name" style={{ width: "100%" }} />
          </Form.Item>

          {/* <Form.Item
                        style={{ width: "100%" }}
                        name="isFeatured"
                        label="Featured"
                        rules={[
                            {
                                required: true,
                                message: "Select isFeatured",
                            },
                        ]}
                    >
                        <Select style={{ width: "100%" }} >
                            <Option key="true" values="true">Yes</Option>
                            <Option key="false" values="false">No</Option>
                        </Select>
                    </Form.Item> */}

          <Form.Item
            style={{ width: "100%" }}
            name="businessName"
            label="Business Name"
            rules={[
              {
                required: true,
                message: "Input Business name",
              },
            ]}
          >
            <Input placeholder="Business Name" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            style={{ width: "100%" }}
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Input Email ",
              },
            ]}
          >
            <Input placeholder="Email " style={{ width: "100%" }} />
          </Form.Item>
          {!props?.data && (
          <Form.Item
            style={{ width: "100%" }}
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Input Password ",
              },
            ]}
          >
            <Input placeholder="Password " type="password" style={{ width: "100%" }} />
          </Form.Item>
          )}
          <Form.Item
            style={{ width: "100%" }}
            name="postCode"
            label="Post Code"
            rules={[
              {
                required: true,
                message: "Input Post Code ",
              },
            ]}
          >
            <Input placeholder="Post Code " style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            style={{ width: "100%" }}
            name="city"
            label="City"
            rules={[
              {
                required: true,
                message: "Input City name",
              },
            ]}
          >
            <Input placeholder="City Name" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            style={{ width: "100%" }}
            name="businessContact"
            label="Business Contact"
            rules={[
              {
                required: true,
                message: "Input Business Contact ",
              },
              // {
              //   len: 11,
              //   message: "Contact Number must be exactly 11 digits",
              // },
            ]}
          >
            <Input placeholder="Business Contact " type="number" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            style={{ width: "100%" }}
            name="contactNumber"
            label="Contact Number"
            rules={[
              {
                required: true,
                message: "Input Contact Number",
              },
              // {
              //   len: 11,
              //   message: "Contact Number must be exactly 11 digits",
              // },
            ]}
          >
            <Input placeholder="Contact NUmber" type="number" style={{ width: "100%" }} />
          </Form.Item>

          {/* <Form.Item
                        style={{ width: "100%" }}
                        name="category"
                        label="Category"
                        rules={[
                            {
                                required: true,
                                message: "Input Category name",
                            },
                        ]}
                    >
                        <Select style={{ width: "100%" }}>
                            {dataCategories?.map((item, index) => (
                                <Option className=""
                                    value={item?.name?.name}
                                    key={index}
                                >
                                    {item?.name?.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item> */}

          <Form.Item
            style={{ width: "100%" }}
            name="numberEmployees"
            label="Number of Employees"
            rules={[
              {
                required: true,
                message: "Input number of Employees ",
              },
            ]}
          >
            <Input placeholder="Employees" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            style={{ width: "100%" }}
            name="province"
            label="Province"
            rules={[
              {
                required: true,
                message: "Input Province name",
              },
            ]}
          >
            <Input placeholder="Province Name" style={{ width: "100%" }} />
          </Form.Item>

          {/* <Form.Item
                        style={{ width: "100%" }}
                        name="websiteLink"
                        label="Website Link"
                        rules={[
                            {
                                required: true,
                                message: "Input Website Link ",
                            },
                        ]}
                    >
                        <Input placeholder="Website Link " style={{ width: "100%" }} />
                    </Form.Item> */}

          <Form.Item
            style={{ width: "100%" }}
            name="businessType"
            label="Business Type"
            rules={[
              {
                required: true,
                message: "Input Business Type ",
              },
            ]}
          >
            <Select style={{ width: "100%" }}>
              <Option key="Salon" values="salon">
                Salon
              </Option>
              <Option key="Spa" values="spa">
                Spa
              </Option>
              <Option key="Treatments" values="treatments">
                Treatments
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            style={{ width: "100%" }}
            name="businessAddress"
            label="Business Address"
            rules={[
              {
                required: true,
                message: "Input Address ",
              },
            ]}
          >
            <Input placeholder="Address " id="pac-input" ref={locationRef} style={{ width: "100%" }} />
          </Form.Item>
          {!props.data && (
            <>
            <Form.Item
              style={{ width: "100%" }}
              name="file"
              rules={[
                {
                  required: true,
                  message: "Input proff File ",
                },
              ]}
            >
              <Upload
                maxCount={1}
                {...prop}
                className="w-full uploadButton"
                style={{ width: "100%" }}
              >
                <Button
                  className="w-full uploadButton"
                  style={{ width: "100%" }}
                  icon={<UploadOutlined />}
                >
                  Profile Picture
                </Button>
              </Upload>
              {/* <Input onChange={handleFileChange} type="file" placeholder="File Name" style={{ width: "100%" }} /> */}
            </Form.Item>
            <Form.Item
              style={{ width: "100%" }}
              name="proffFile"
              // rules={[
              //   {
              //     required: true,
              //     message: "Input File ",
              //   },
              // ]}
            >
              <Upload
                maxCount={1}
                {...proffProp}
                className="w-full uploadButton"
                style={{ width: "100%" }}
              >
                <Button
                  className="w-full uploadButton"
                  style={{ width: "100%" }}
                  icon={<UploadOutlined />}
                >
                  Proff of Business
                </Button>
              </Upload>
              {/* <Input onChange={handleFileChange} type="file" placeholder="File Name" style={{ width: "100%" }} /> */}
            </Form.Item>
            </>
          )}

          <Form.Item>
            <Button
              className="btn-primary"
              size="large"
              type="primary"
              htmlType="submit"
              loading={addMutation.isLoading || updateMutation.isLoading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default SPAModal;
