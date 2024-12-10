import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "../../../components/ui/form";
import { Button } from "../../../components/ui/button";
import Loading from "../../../components/Loader";
import CustomFormField, {
  FormFieldTypes,
} from "../../../components/CustomFormField";
import { CardWrapper } from "./CardWrapper";
import { LockIcon, Mail } from "lucide-react";
import { toast } from "react-toastify";
import { supabase } from "../../../services/supabase";
import { useState } from "react";

// Will have to more this to validation file later
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

export const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "admin@gmail.com",
      password: "admin@Admin",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    if (!values.email || !values.password) {
      toast.error("Please enter both email and password", {
        position: "top-center",
        autoClose: 5000,
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error("Invalid email or password", {
        position: "top-center",
        autoClose: 5000,
      });
      setLoading(false);
      return;
    }

    toast.success("Login was successful", {
      position: "top-center",
      autoClose: 5000,
    });
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="bg-bgSecondary p-4 sm:p-6 lg:p-8 w-full max-w-5xl rounded-2xl flex flex-col md:flex-row items-center md:space-x-8">
        {/* Welcome Section */}
        <div className="w-full md:w-1/2 text-left space-y-4 mb-8 md:mb-0">
          <div className="flex items-center">
            <img
              src="/mohs.svg"
              alt="Ministry of health Logo"
              width={50}
              height={50}
              className="w-20 sm:w-24 md:w-28 h-auto"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#16151C]">
            Moh Policy Document Hub
          </h2>
          <p className="text-base sm:text-lg font-normal">
            Policy Document <br /> System
          </p>
        </div>

        {/* Login Form Section */}
        <div className="w-full md:w-1/2">
          <CardWrapper headerLabel="Welcome 👋">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-6 "
              >
                <div className="space-y-4 w-full">
                  <CustomFormField
                    formFieldType={FormFieldTypes.INPUT}
                    control={form.control}
                    name="email"
                    placeholder="Email Address"
                    iconSrc={Mail}
                    className="rounded-lg shadow-md p-3 sm:p-4 bg-gray-50 border w-full"
                    disabled={loading}
                    label="Email Address"
                  />
                  <CustomFormField
                    formFieldType={FormFieldTypes.INPUT}
                    control={form.control}
                    name="password"
                    placeholder="Enter Password"
                    iconSrc={LockIcon}
                    className="rounded-lg shadow-md p-3 sm:p-4 bg-gray-50 border w-full"
                    type="password"
                    disabled={loading}
                    label="Password"
                  />
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full font-semibold bg-bgPrimary text-white hover:bg-[#61aaaa] rounded-lg py-2 sm:py-3"
                  disabled={loading}
                >
                  {loading ? (
                    <Loading size={30} />
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Login</span>
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </CardWrapper>
        </div>
      </div>
    </div>
  );
};
