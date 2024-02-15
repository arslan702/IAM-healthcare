import { Button, Checkbox, Form, Select, message, notification } from "antd";
import { signInWithEmailAndPassword,sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import Image from "next/image";
import styles from "@/styles/custom.module.css";
import authApi from "@/lib/authApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDocs, collection, query, where } from "firebase/firestore";
import { Modal } from "antd";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAuth } from "@/context/AuthContext";

const { Option } = Select;

const SignUpForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const { login } = useAuth();
  const [data, setData] = useState(null);

  // const { data, isLoading, isError } = useQuery(
  //   ["singleSPA"],
  //   async () => {
  //     const data = await authApi.getSPA(email);
  //     console.log("data of spa", data);
  //     return data;
  //   },
  //   {
  //     refetchOnWindowFocus: false,
  //     enabled: !!email,
  //   }
  // );

  const handleLogin = async (values) => {
    setLoading(true);
    router.push("/")
    // loginMutation.mutate();
    // if (!email || !password) {
    //   notification.open({
    //     type: "error",
    //     message: "Please fill all fields",
    //     placement: "top",
    //   });
    //   return;
    // }

    // Assuming you have a fetchDataFunction that fetches data from the API.
    // queryClient.invalidateQueries(["singleSPA"]); // Optional: Invalidates the cache for the     ["singleSPA"] query
    // queryClient.prefetchQuery(["singleSPA"], authApi.getSPA(values?.email)); // Prefetch the updated data
    // const s = await authApi.getSPA(values?.email);
    // setData(s);
    // setShowMessageAlert(false);

    // const emailRegex = /\S+@\S+\.\S+/;
    // if (!emailRegex.test(email)) {
    //   // NotificationManager.error("Invalid email format");
    //   message.error({
    //     content: "Invalid email format",
    //   });
    //   return;
    // }

    // try {
    //   // Assuming you have a "products" collection in your database
    //   const productsRef = collection(db, "businesses");
    //   const usersRef = collection(db, "Users");
    //   // console.log("ID OF SPA USERS", userId)

    //   // Query for products with matching userId
    //   const querySnapshot = await getDocs(
    //     query(productsRef, where("email", "==", values?.email))
    //   );

    //   const querySnap = await getDocs(
    //     query(usersRef, where("email", "==", values?.email))
    //   )

    //   const users = [];
    //   querySnap.forEach((doc) => {
    //     users.push({
    //       ...doc.data(),
    //       id: doc.id,
    //     });
    //   });

    //   const products = [];
    //   querySnapshot.forEach((doc) => {
    //     products.push({
    //       ...doc.data(),
    //       id: doc.id,
    //     });
    //   });
    //   // console.log({products})
    //   let role, code;
    //   // console.log("SPA", products);
    //   // console.log("Users", users);
    //   if (products[0]?.status === "active" || users?.length) {
    //     role = users?.length ? users[0]?.role : products[0]?.role;
    //     // console.log({role})
    //     code = 1;
    //     // return { code: 1, role: products[0]?.role }
    //   } else if (products[0]?.status === "deactive") {
    //     role = products[0]?.role;
    //     code = 0;
    //     // return { code: 0, role: products[0]?.role }
    //   } else if (products[0]?.status === "pending") {
    //     role = products[0]?.role;
    //     code = 2;
    //     // return { code: 2, role: products[0]?.role }
    //   }
    //   if (code === 1) {
    //     try {
    //       // setLoading(true)
    //       const userCredential = await signInWithEmailAndPassword(
    //         auth,
    //         values?.email,
    //         values?.password
    //       );
    //       // console.log({userCredential})
    //       // console.log({ userCredential });
    //       localStorage.setItem("token", userCredential?.user?.accessToken);
    //       localStorage.setItem("role", role);
    //       await login(values?.email, values?.password);
    //       // console.log("userCredential", userCredential);
    //       // console.log("DATAsasasasa",data)
    //       // console.log("rolesasa",role)
    //       // role === "admin"
    //         // ? 
    //         router.push("/")
    //         // : router.push("/profile");

    //       // setLoading(false);
    //     } catch (error) {
    //       const message = error.message;
    //       var modifiedText = message.replace("Firebase:", "");

    //       notification.open({
    //         type: "error",
    //         message: modifiedText,
    //         placement: "top",
    //       });
    //       console.log(error);
    //       // setLoading(false);
    //     }
    //   } else if (code === 2) {
    //     message.error({
    //       content: "Your profile is still under review!",
    //     });
    //   } else if (code === 0) {
    //     message.error({
    //       content: "You are not allowed to log in!",
    //     });
    //   } else {
        
    //     console.log("🚀 ~ file: SignInForm.jsx:157 ~ handleLogin ~ await:", "else part run")
    //     await login(values?.email, values?.password);
    //     router.push("/");
    //   }
    // } catch (error) {
    //   message.error({
    //     content:
    //       error.code === "auth/user-not-found"
    //         ? "User is not registered"
    //         : error.code === "auth/wrong-password"
    //         ? "Wrong password entered"
    //         : error.code === "auth/invalid-login-credentials"
    //         ? "Wrong email or password"
    //         : "Something went wrong, please try again",
    //   });
    //   console.log(error);
    // }
    setLoading(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleReset = async (e) => {

    e.preventDefault();
    await authApi?.resetPassword(email)
    setIsModalOpen(false)
  };
  return (
    <div className="w-full">
      <Modal
        title="Reset Password"
        footer={null}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <form onSubmit={handleReset}>
          <label
            className="mt-5 block text-sm font-normal mb-2 formLables"
            style={{
              fontSize: "16px",
              fontWeight: "400",
              color: "#777777",
              lineHeight: "13px",
              fontFamily: "'Roboto', sans-serif",
            }}
            for="email"
          >
            Registered Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            id="email"
            className="mb-10 shadow h-[50px] appearance-none border bg-[#003c73] rounded py-2 px-5 text-black leading-tight focus:outline-none focus:shadow-outline formItems"
            placeholder="Enter your email"
            style={{
              color: "#000000",
              fontSize: "16px",
              lineHeight: "13px",
              fontFamily: "'Roboto', sans-serif",
              border: "0.50px #003c73 solid",
            }}
          />
          <button
            type="submit"
            className="flex items-center justify-center w-[130px]"
            style={{
              height: "50px",
              background: "#003c73",
              color: "#FFFFFF",
              borderRadius: "5px",
            }}
          >
            <span
              style={{
                marginTop: "0px",
                fontSize: "16px",
                lineHeight: "13px",
                fontWeight: "400",
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              Reset Password
            </span>
          </button>
        </form>
      </Modal>
      <div className="flex flex-col md:flex-row">
        <div className="relative w-[50%] md:flex hidden">
          <div className="absolute top-0 left-0">
            <Image
              src={"/images/design.png"}
              width={300}
              height={300}
              alt="bg"
            />
          </div>
          <div className="flex items-center justify-center w-[70%] lg:w-full h-full">
            <Image
              src={"/images/iamSign.png"}
              width={500}
              height={500}
              alt="bg"
            />
          </div>
          <div className="absolute bottom-0 right-0">
            <Image
              src={"/images/designtwo.png"}
              width={300}
              height={300}
              alt="bg"
            />
          </div>
        </div>
        <div className="flex justify-center items-center bg-white w-full md:w-[50%] h-[100vh]">
          <Form onFinish={handleLogin} className="w-full max-w-sm">
            <div className="flex flex-col items-center justify-center formItems">
              <div
                className="font-bold mb-4"
                style={{
                  fontSize: "32px",
                  color: "black",
                  lineHeight: "39px",
                  fontFamily: "'Work sans', sans-serif",
                }}
              >
                Welcome
              </div>
              <div
                className="text-center mb-12"
                style={{
                  fontSize: "20px",
                  fontWeight: "500",
                  lineHeight: "23px",
                  color: "black",
                  fontFamily: "'Work sans', sans-serif",
                }}
              >
                Hey! Enter your details to get sign into your account
              </div>
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-normal mb-2 formLables"
                style={{
                  fontSize: "16px",
                  fontWeight: "400",
                  color: "#777777",
                  lineHeight: "13px",
                  fontFamily: "'Roboto', sans-serif",
                }}
                for="name"
              >
                Name
              </label>
              <Form.Item
                name="name"
                // rules={[
                //   {
                //     message: "Please input your name!",
                //     required: true,
                //     type: "name",
                //   },
                // ]}
              >
                <input
                  className="shadow h-[50px] appearance-none border rounded-[25px] py-2 px-5 text-black leading-tight focus:outline-none focus:shadow-outline formItems"
                  id="username"
                  type="text"
                  // value={email}
                  // onChange={(e) => {
                  //   setEmail(e.target.value);
                  // }}
                  placeholder="Enter your Name"
                  style={{
                    color: "#000000",
                    fontSize: "16px",
                    lineHeight: "13px",
                    fontFamily: "'Roboto', sans-serif",
                    border: "0.50px #003c73 solid",
                  }}
                />
              </Form.Item>
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-normal mb-2 formLables"
                style={{
                  fontSize: "16px",
                  fontWeight: "400",
                  color: "#777777",
                  lineHeight: "13px",
                  fontFamily: "'Roboto', sans-serif",
                }}
                for="username"
              >
                Email Address
              </label>
              <Form.Item
                name="email"
                // rules={[
                //   {
                //     message: "Please input your email!",
                //     required: true,
                //     type: "email",
                //   },
                // ]}
              >
                <input
                  className="shadow h-[50px] appearance-none border rounded-[25px] py-2 px-5 text-black leading-tight focus:outline-none focus:shadow-outline formItems"
                  id="username"
                  type="text"
                  // value={email}
                  // onChange={(e) => {
                  //   setEmail(e.target.value);
                  // }}
                  placeholder="Enter your email"
                  style={{
                    color: "#000000",
                    fontSize: "16px",
                    lineHeight: "13px",
                    fontFamily: "'Roboto', sans-serif",
                    border: "0.50px #003c73 solid",
                  }}
                />
              </Form.Item>
            </div>
            <div className="mb-4">
      <label
        className="block text-sm font-normal mb-2 formLables"
        style={{
          fontSize: "16px",
          fontWeight: "400",
          color: "#777777",
          lineHeight: "13px",
          fontFamily: "'Roboto', sans-serif",
        }}
        htmlFor="role"
      >
        Register as:
      </label>
      <Form.Item
        name="role"
        rules={[
          {
            message: "Please select your role!",
            required: true,
            type: "name",
          },
        ]}
        className="border-none"
      >
        <Select
          className="shadow h-[50px] appearance-none border-none rounded-[25px] py-2 px-5 text-black leading-tight focus:outline-none focus:shadow-outline formItems"
          placeholder="Select an option"
          style={{
            color: "#000000",
            fontSize: "16px",
            lineHeight: "13px",
            fontFamily: "'Roboto', sans-serif",
            border: "0.50px #003c73 solid",
          }}
        >
          <Option value="doctor">Doctor</Option>
          <Option value="nurse">Nurse</Option>
          <Option value="patient">Patient</Option>
        </Select>
      </Form.Item>
    </div>
            <div className="mb-6">
              <label
                className="block text-sm font-normal mb-2 formLables"
                style={{
                  fontSize: "16px",
                  fontWeight: "400",
                  color: "#777777",
                  lineHeight: "13px",
                  fontFamily: "'Roboto', sans-serif",
                }}
                for="password"
              >
                Enter Password
              </label>
              <div className="relative">
                <Form.Item
                  name="password"
                //   rules={[
                //     {
                //       required: true,
                //       message: "Please input your password!",
                //     },
                //   ]}
                >
                  <input
                    // value={password}
                    // onChange={(e) => {
                    //   setPassword(e.target.value);
                    // }}
                    className="shadow h-[50px] appearance-none border text-black rounded-[25px] py-2 px-5 leading-tight focus:outline-none focus:shadow-outline formItems"
                    id="password"
                    type={isPasswordShown ? "text" : "password"}
                    placeholder="Password"
                    style={{
                      color: "#000000",
                      fontSize: "16px",
                      lineHeight: "13px",
                      fontFamily: "'Roboto', sans-serif",
                      border: "0.50px #003c73 solid",
                    }}
                  />
                </Form.Item>
                <div
                  onClick={() => setIsPasswordShown(!isPasswordShown)}
                  className="absolute top-7 sm:right-2 right-6 transform -translate-y-1/2 text-red-300 cursor-pointer"
                >
                  {isPasswordShown ? (
                    <AiOutlineEyeInvisible size={25} />
                  ) : (
                    <AiOutlineEye size={25} />
                  )}
                </div>
              </div>
              <div className="flex justify-between sm:mx-0 mx-6">
                <div
                  onClick={showModal}
                  className=" text-xs text-[#003c73]   mt-5  cursor-pointer"
                  style={{
                    fontSize: "14px",
                    fontWeight: "400",
                    lineHeight: "11px",
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  {/* Forgot Password? */}
                </div>
                <div className="flex gap-3 items-center mt-4 ">
                  <Checkbox className={styles.checkboxx} />
                  <p
                    className="text-xs "
                    style={{
                      color: "#000000",
                      fontSize: "14px",
                      fontWeight: "400",
                      lineHeight: "11px",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    Remember me!
                  </p>
                </div>
              </div>
            </div>
            <Form.Item>
              <Button
                htmlType="submit"
                className="flex items-center justify-center formItems"
                style={{
                  height: "50px",
                  background: "#003c73",
                  color: "#FFFFFF",
                  borderRadius: "25px",
                }}
                disabled={loading}
                loading={loading}
              >
                <span
                  style={{
                    marginTop: "0px",
                    fontSize: "16px",
                    lineHeight: "13px",
                    fontWeight: "400",
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  Register
                </span>
              </Button>
            </Form.Item>
            <p>Already have an account, <span className="cursor-pointer" style={{fontWeight: '700'}} onClick={() => router.push('/signin')}>Login</span></p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
