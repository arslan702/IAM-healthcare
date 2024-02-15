import SignUpForm from "@/components/Signup/SignupForm";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SignInForm = dynamic(() => import("../../components/SignIn/SignInForm"));

const Index = () => {
  // const router = useRouter('');
  // const [user, setUser] = useState('');
  // useEffect(() => {
  //   setUser(localStorage.getItem('token'))
  // },[])
  // if(user) {
  //   router.push('/')
  // }
  return (
    <>
      <Head>
        <title>Sign Up - IAM Healthcare</title>
      </Head>
      <div className="flex items-center h-[100vh]">
        <SignUpForm />
      </div>
    </>
  );
};

export default Index;