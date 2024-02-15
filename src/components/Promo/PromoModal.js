import PromoApi from "@/lib/Promo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Select, notification } from "antd";
import ServiceApi from "@/lib/Service";
import { useEffect, useState } from "react";
import { auth } from "@/config/firebase";

const PromoModal = (props) => {
  const [services, setServices] = useState([]);
  // console.log("Promo", props.data);
  const queryClient = useQueryClient();
  const addMutation = useMutation(
    ["promoCodes"],
    async (data) => {
      return await PromoApi.addPromo(data);
    },
    {
      onError: (data) => {
        // console.log("data in api", data);
      },
      onSuccess: (data) => {
        // console.log("data in api", data);
        notification.open({
          type: data?.code === 1 ? "success" : "error",
          message: data?.message,
          placement: "top",
        });
        queryClient.invalidateQueries(["promoCodes"]);
        props.close();
      },
    }
  );

  const updateMutation = useMutation(
    ["promoCodes"],
    async ({ id, Promo }) => {
      await PromoApi.updatePromo(id, Promo);
    },
    {
      onError: (data) => {},
      onSuccess: () => {
        notification.open({
          type: "success",
          message: "Promo updated successfully",
          placement: "top",
        });
        queryClient.invalidateQueries(["promoCodes"]);
        props.setData(null);
        props.close();
      },
    }
  );

  useEffect(() => {
    ServiceApi.getServices(auth?.currentUser?.email)
      .then((res) => {
        // console.log("res", res);
        setServices(res);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  const handleSubmit = (values) => {
    // console.log(props.data);
    let slug = values.name
      .replace(/ /g, "-")
      .replace(/\?/g, "")
      .replace(/,/g, "")
      .replace(/"/g, "")
      .replace(/'/g, "")
      .toLowerCase();
    if (props.data) {
      console.log("why here");
      updateMutation.mutate({
        id: props?.data?.id,
        Promo: values,
      });
    } else {
      addMutation.mutate({ ...values, slug });
    }
  };
  return (
    <Modal
      title={props?.data ? "Update Promo" : "Add New Promo"}
      open={props.show}
      footer={null}
      onCancel={() => {
        // props.setData(null);
        props.close();
      }}
    >
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Form
          size="large"
          name="basic"
          initialValues={{
            name: props?.data?.name ? props.data.name : "",
            code: props?.data?.code ? props.data.code : "",
            services: props?.data?.services ? props.data.services : [],
            discount: props?.data?.discount ? props.data.discount : "",
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
            name="code"
            rules={[
              {
                required: true,
                message: "Input Promo code",
              },
            ]}
          >
            <Input placeholder="Promo code" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            style={{ width: "100%" }}
            name="name"
            rules={[
              {
                required: true,
                message: "Input Promo name",
              },
            ]}
          >
            <Input placeholder="Promo name" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            style={{ width: "100%" }}
            name="discount"
            rules={[
              {
                required: true,
                message: "Input discount in percentage",
              },
            ]}
          >
            <Input
              placeholder="Promo discount in percentage"
              style={{ width: "100%" }}
              type="number"
            />
          </Form.Item>
          <Form.Item
            style={{ width: "100%" }}
            name="services"
            rules={[
              {
                required: true,
                message: "Input services",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select services"
              style={{ width: "100%" }}
            >
              {services?.map((service) => (
                <Select.Option key={service.name} value={service.name}>
                  {service.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

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

export default PromoModal;
