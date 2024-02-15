import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Space,
  Upload,
  notification,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import productApi from "@/lib/product";
import { db, storage } from "@/config/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Firestore,
  arrayRemove,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const ProductModal = (props) => {
  // console.log("props", props);
  const queryClient = useQueryClient();
  const [imageList, setImageList] = useState([]);
  const addMutation = useMutation(
    ["products"],
    async (data) => {
      await productApi.addProduct(data);
    },
    {
      onError: (data) => {},
      onSuccess: () => {
        notification.open({
          type: "success",
          message: "Product saved successfully",
          placement: "top",
        });
        queryClient.invalidateQueries(["products"]);
        props.close();
      },
    }
  );
  const deleteImageMutation = useMutation(
    async (imageId) => {
      const ref = doc(db, "products", props?.productData?.id);
      const data = await getDoc(ref);
      const images = data?.data()?.images;
      const updatedImages = images?.filter((e) => e?.id !== imageId);

      await setDoc(ref, { images: updatedImages }, { merge: true });
      const res = await getDoc(ref);
      // queryClient.setQueryData(
      //   ["products", props?.productData?.id],
      //   (oldData) => ({
      //     ...oldData,
      //     images: oldData.images.filter((image) => image.id !== imageId),
      //   })
      // );
      return {
        ...res.data(),
        id: res.id,
      };
    },
    {
      onError: (data) => {},
      onSuccess: (data) => {
        // notification.open({
        //   type: "success",
        //   message: "Product saved successfully",
        //   placement: "top",
        // });
        // queryClient.invalidateQueries(["products"]);
        // props.close();
        // props.productData = data;
      },
    }
  );

  const updateMutation = useMutation(
    ["products"],
    async ({ id, data }) => {
      // console.log("id", id);
      // console.log("product in mutation", data);
      await productApi.updateProduct(id, data);
    },
    {
      onError: (data) => {},
      onSuccess: () => {
        notification.open({
          type: "success",
          message: "Product updated successfully",
          placement: "top",
        });
        queryClient.invalidateQueries(["products"]);
        props?.setProductData(null);
        props?.setInitialCategory(null);
        props?.close();
      },
    }
  );

  const handleSubmit = (values) => {
    // console.log("values", values);
    // console.log("image list", imageList);
    // const timestamp =Firestore.FieldValue.serverTimestamp();
    const timestamp = serverTimestamp();
    // console.log("timestamp", timestamp);
    if (props?.productData) {
      // console.log("values in submit", {
      //   ...values,
      //   category: values?.category?.value
      //     ? values?.category?.value
      //     : values?.category,
      //   stock: parseInt(values.stock),
      //   price: parseFloat(values.price),
      //   images: imageList?.concat(props?.productData?.images),
      // });
      // console.log("props?.productData?.id", props?.productData?.id);
      let data = {
        ...values,
        category: values?.category?.value
          ? values?.category?.value
          : values?.category,
        stock: parseInt(values.stock),
        price: parseFloat(values.price),
        images: imageList?.concat(props?.productData?.images),
      };
      updateMutation.mutate({ id: props?.productData?.id, data });
    } else {
      addMutation.mutate({
        ...values,
        stock: parseInt(values.stock),
        price: parseFloat(values.price),
        images: imageList,
        createdAt: timestamp,
      });
    }
  };

  const handleDeleteImage = async (id) => {
    // dispatch(deleteProductImage({ id, url }));
    deleteImageMutation.mutate(id);
  };

  return (
    <Modal
      title={props?.productData ? "Update Product" : "Add New Product"}
      open={props.show}
      footer={null}
      onCancel={() => {
        props?.setProductData(null);
        props?.setInitialCategory(null);
        props.close();
      }}
    >
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Form
          size="large"
          name="basic"
          onFinish={handleSubmit}
          initialValues={{
            name: props?.productData?.name || "",
            category: props?.initialCategory || null,
            price: props?.productData?.price || "",
            stock: props?.productData?.stock || "",
            desc: props?.productData?.desc || "",
          }}
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Form.Item
            style={{ width: "100%" }}
            name="name"
            rules={[
              {
                required: true,
                message: "Input product name",
              },
            ]}
          >
            <Input placeholder="Product name" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            style={{ width: "100%" }}
            name="category"
            rules={[
              {
                required: true,
                message: "Select category",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="Select Category"
              options={props?.categories?.map((e) => {
                return {
                  label: e?.name,
                  value: e?.id,
                };
              })}
            />
          </Form.Item>
          <Form.Item
            style={{ width: "100%" }}
            name="price"
            rules={[
              {
                required: true,
                message: "Input product price",
              },
            ]}
          >
            <Input placeholder="Product price" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            style={{ width: "100%" }}
            name="stock"
            rules={[
              {
                required: true,
                message: "Input stock items",
              },
            ]}
          >
            <Input placeholder="Items in stock" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item style={{ width: "100%" }} name="desc">
            <Input.TextArea
              cols={4}
              rows={4}
              placeholder="Description"
              style={{ width: "100%" }}
            />
          </Form.Item>
          {props?.productData?.images?.length > 0 && (
            <Space style={{ width: "100%" }}>
              {props?.productData?.images?.map((image, i) => {
                return (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <img
                      src={image?.url}
                      style={{
                        width: 100,
                        height: 100,
                      }}
                      alt="img"
                    />
                    <Button
                      type="link"
                      danger
                      onClick={() => handleDeleteImage(image?.id)}
                    >
                      Delete
                    </Button>
                  </div>
                );
              })}
            </Space>
          )}

          <Form.Item
            label="Upload Images"
            style={{ width: "100%" }}
            rules={[
              {
                required: true,
                message: "Please upload atleast one image!",
              },
            ]}
            required
          >
            <Upload
              listType="picture-card"
              maxCount={5}
              // beforeUpload={(file) => {
              //   if (file.size > 100000) {
              //     document.getElementById("errorMsg").textContent =
              //       "File size should be less than 100MB";
              //     return Upload.LIST_IGNORE;
              //   }
              // }}
              customRequest={(e) => {
                const imageRef = ref(
                  storage,
                  `product_images/${e.file.name + e.file.uid}`
                );
                uploadBytes(imageRef, e.file).then((snapshot) => {
                  e.onSuccess("ok");
                  getDownloadURL(snapshot.ref).then((url) => {
                    setImageList([
                      ...imageList,
                      {
                        id: uuidv4(),
                        url,
                      },
                    ]);
                  });
                });
              }}
              onRemove={(e) => {
                const imageRef = ref(
                  storage,
                  `product_images/${e.name + e.uid}`
                );
                getDownloadURL(imageRef).then((url) => {
                  const updated = imageList.filter((e) => e !== url.toString());
                  setImageList(updated);
                });
                deleteObject(imageRef);
              }}
            >
              <div>
                <PlusOutlined />
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Upload
                </div>
              </div>
            </Upload>
            {/* <Text type="danger" id="errorMsg"></Text> */}
          </Form.Item>

          <Form.Item>
            <Button
              className="btn-primary"
              size="large"
              type="primary"
              htmlType="submit"
              loading={addMutation.isLoading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ProductModal;
