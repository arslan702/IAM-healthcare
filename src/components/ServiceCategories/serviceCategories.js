import ServiceCategory from "../../lib/ServiceCategories";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Modal, notification } from "antd";
import BusinessApi from "../../lib/Business.js";
import { auth } from "../../config/firebase";

const CategoryModal = (props) => {

  const queryClient = useQueryClient();

  const addMutation = useMutation(
    ["ServicesCategory"],
    async (data) => {
      return await ServiceCategory.addServiceCategory(data);
    },
    {
      onError: (data) => {},
      onSuccess: (data) => {
        // console.log("data in api", data);
        notification.open({
          type: data?.code === 1 ? "success" : "error",
          message: "Category is Added",
          placement: "top",
        });
        queryClient.invalidateQueries(["ServicesCategory"]);
        props.close();
      },
    }
  );

  const updateMutation = useMutation(
    ["ServicesCategory"],
    async ({ id, category }) => {
      await ServiceCategory.updateServiceCategory(id, category);
    },
    {
      onError: (data) => {},
      onSuccess: () => {
        notification.open({
          type: "success",
          message: "Category is Updated",
          placement: "top",
        });
        queryClient.invalidateQueries(["ServicesCategory"]);
        props.setData(null);
        props.close();
      },
    }
  );

  const handleSubmit = (values) => {
    values.createdAt = new Date();
    // console.log("values of modal", values.name);
    let slug = values.name
      .replace(/ /g, "-")
      .replace(/\?/g, "")
      .replace(/,/g, "")
      .replace(/"/g, "")
      .replace(/'/g, "")
      .toLowerCase();

    if (props.data) {
      // console.log("updated values", values.name);
      const user = auth.currentUser;
      const updatedFormData = { name: values?.name?.toLowerCase() , SpaEmail: user?.email };

      updateMutation.mutate({
        id: props?.data?.id,
        category: updatedFormData,
        // slug,
      });
    } else {
      const user = auth.currentUser;
      const updatedFormData = { name:values?.name?.toLowerCase() , SpaEmail: user.email };

      addMutation.mutate(updatedFormData);
    }
  };
  let userId;
  try {
    const user = auth.currentUser;
    userId = user.uid;
  } catch (error) {
    console.log(error);
  }

  const {
    data: SPAData,
    isLoading,
    isError,
  } = useQuery(["businesses"], async () => {
    try {
      const data = await BusinessApi.getSalonsByUserId(userId);
      // console.log("Fetched data:", data); // Add this line to log the fetched data
      return data;
    } catch (error) {
      console.error("Error fetching data:", error); // Log the error
      throw error; // Rethrow the error to be caught by React Query
    }
  });

  // console.log("SPA DATA FOR ID in modal", SPAData);
  return (
    <Modal
      title={props?.data ? "Update Category" : "Add New Category"}
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
            name: props?.data?.name?.name && props?.data?.name?.name,
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
            
            name="name"
            rules={[
              {
                required: true,
                message: "Input category name",
              },
            ]}
          >
            <Input defaultValue={props?.data?.name} placeholder="Category name" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button
              className="btn-primary"
              size="large"
              type="primary"
              htmlType="submit"
            >
              {addMutation.isLoading || updateMutation.isLoading
                ? "Submitting..."
                : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default CategoryModal;
