"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { UserValidation } from "@/libs/validations/user";
import FormField from "@/components/ui/FormField";
import FormButtons from "@/components/ui/FormButtons";

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userInput = {
      email,
      name,
      phoneNumber,
      password,
    };

    try {
      // Validate the user input
      const validation = UserValidation.registration.safeParse(userInput);
      if (validation.success === false) {
        const { issues } = validation.error;
        issues.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        // If validation is successful, make the API request
        const response = await axios.post("/api/user", {
          userRole: "USER",
          ...userInput,
        });
        if (response.statusText === "FAILED") {
          toast.error(response.data);
        } else {
          toast.success("Registration successful! Please log in.");
          router.push("/login");
        }
      }
    } catch (err) {
      console.error("REGISTRATION_ERROR: " + err);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#4acd8d]">Register</h2>
        <form onSubmit={handleSubmit}>
          <FormField
            label="Name"
            type="text"
            name="name"
            value={name}
            placeholder="Your Name"
            onChange={(e) => setName(e.target.value)}
            classLabel="label_form"
            classInput="input_form"
          />
          <FormField
            label="Email"
            type="email"
            name="email"
            value={email}
            placeholder="Your Email"
            onChange={(e) => setEmail(e.target.value)}
            classLabel="label_form"
            classInput="input_form"
          />
          <FormField
            label="Phone Number"
            type="text"
            name="phoneNumber"
            value={phoneNumber}
            placeholder="+911234567890"
            onChange={(e) => setPhoneNumber(e.target.value)}
            classLabel="label_form"
            classInput="input_form"
          />
          <FormField
            label="Password"
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            classLabel="label_form"
            classInput="input_form"
          />
          <div className="mt-4 space-x-3 flex justify-between">
            <FormButtons
              primaryLabel={isLoading ? "Registering..." : "Register"}
              secondaryLabel="Back to Login"
              onPrimaryClick={handleSubmit}
              onSecondaryClick={() => router.push("/login")}
              primaryClassName="btn_form"
              secondaryClassName="btn_form"
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
