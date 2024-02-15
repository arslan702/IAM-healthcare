import ServiceCategory from "../../lib/ServiceCategories";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Modal, notification, Select } from "antd";
import BusinessApi from "../../lib/Business.js";
import { auth } from "@/config/firebase";

const { Option } = Select;
const AddNurseModal = (props) => {
  // console.log("category in modal", props.data);
  const queryClient = useQueryClient();

  const addMutation = useMutation(
    ["Specialists"],
    async (data) => {
      return await ServiceCategory.addSpecialists(data);
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
        queryClient.invalidateQueries(["Specialists"]);
        props.close();
      },
    }
  );

//   const updateMutation = useMutation(
//     ["Specialists"],
//     async ({ id, dataa }) => {
//       await ServiceCategory.updateSpecialists(id, dataa);
//     },
//     {
//       onError: (data) => {},
//       onSuccess: () => {
//         notification.open({
//           type: "success",
//           message: "Specialist updated successfully",
//           placement: "top",
//         });
//         queryClient.invalidateQueries(["Specialists"]);
//         props.setData(null);
//         props.close();
//       },
//     }
//   );

  const handleSubmit = (values) => {
    props?.close();
    // values.createdAt = new Date();
    // // console.log("values of modal", values);
    // let slug = values.name
    //   .replace(/ /g, "-")
    //   .replace(/\?/g, "")
    //   .replace(/,/g, "")
    //   .replace(/"/g, "")
    //   .replace(/'/g, "")
    //   .toLowerCase();

    // if (props.data) {
    //   // console.log("updated values", values.name);
    //   const user = auth.currentUser;
    //   const updatedFormData = { ...values, name: values?.name?.toLowerCase(), SpaEmail: user.email };

    //   updateMutation.mutate({
    //     id: props?.data?.id,
    //     dataa: updatedFormData,
    //     // slug,
    //   });
    // } else {
    //   const user = auth.currentUser;
    //   const updatedFormData = { ...values, name: values?.name?.toLowerCase(), SpaEmail: user.email };
    //   addMutation.mutate(updatedFormData);
    // }
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
      console.log("Fetched data:", data); // Add this line to log the fetched data
      return data;
    } catch (error) {
      console.error("Error fetching data:", error); // Log the error
      throw error; // Rethrow the error to be caught by React Query
    }
  });

  return (
    <Modal
      title={props?.data ? "Update Doctor" : "Add New Nurse"}
      open={props.show}
      footer={null}
      onCancel={() => {
        props?.setData && props?.setData(null);
        props?.close();
      }}
    >
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Form
          size="large"
          name="basic"
          initialValues={{
            name: props?.data?.name && props?.data?.name,
            email: props?.data?.gender && props?.data?.gender,
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
                message: "Input name",
              },
            ]}
          >
            <Input placeholder="name" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            style={{ width: "100%" }}
            name="email"
            rules={[
              {
                required: true,
                message: "Input email",
              },
            ]}
          >
            <Input placeholder="email" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            style={{ width: "100%" }}
            name="password"
            rules={[
              {
                required: true,
                message: "Input password",
              },
            ]}
          >
            <Input placeholder="Password" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button
              className="btn-primary"
              size="large"
              type="primary"
              htmlType="submit"
            //   loading={addMutation.isLoading || updateMutation.isLoading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddNurseModal;
