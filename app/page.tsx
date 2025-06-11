
"use client"

import { useEffect, useState } from "react";
 
import { useRouter } from "next/navigation";
import { getCredentials } from "@/helper/general";
export default function Page() {
 
  const navigate = useRouter();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const { email, password } = getCredentials();
    if (email && password) {
      navigate.push("/dashboard");
    }
  }, []);
 

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };


  const handleRegister = () => {

     if (!data.email || !data.password) {
        alert("Fill all fields");
        return
     }

 
     alert("Registered Successfully");
     navigate.push("/dashboard")
     return
     
  }

  return (
    <div className="bg-primary w-screen h-screen flex items-center justify-center">
      <div className="w-1/2 flex items-center justify-center max-sm:w-full">
         <div className="flex flex-col gap-4 w-[35%] max-2xl:w-[50%] max-lg:w-[70%] max-md:w-[80%]">
           <img src="favicon.ico"  className="h-1/6 w-1/6" />
           <h1 className="text-2xl text-text font-[500]">Login to neurowatch.ai</h1>
           <p className="text-accent">Enter your email</p>
           <p className="text-text/70 text-sm">Email</p>
           <input type="text" name="email" onChange={handleChange} value={data.email} className="border border-secondary  outline-none p-1.5 rounded-md" />
             <p className="text-text/70 text-sm">App Password</p>
           <input type="text" name="password" onChange={handleChange} value={data.password} className="border border-secondary outline-none p-1.5 rounded-md" />
           <a href="https://www.youtube.com/watch?v=MkLX85XU5rU" target="_blank" className="text-extra text-xs">What is app password?</a>
           <button onClick={handleRegister} className="bg-black text-white p-3 rounded-sm text-xs hover:bg-black/80 transition-all">Register</button>
         </div>
      </div>
      <div className="w-1/2 h-full relative max-lg:hidden">
        <div className="absolute text-center w-full bottom-[43%] text-white text-2xl ">
         <p className="text-xl">neurowatch.ai</p>
         <p className="text-2xl">Smart <span className="font-[550]">AI-Powered Intruder Detection</span> <br />& Email Notification System</p>
           <hr className="w-[100px] mx-auto mt-5 opacity-60 " />
        </div>
        <img
          src="background-mesh.png"
          className="bg-cover w-full h-full"
          alt="bg"
        />
      </div>
    </div>
  );
}
