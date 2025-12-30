import { useEffect, useState } from "react";
import bgiamge from "../../assets/login bg.png";
import { Checkbox, Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import { notifyError, notifySuccess } from "../../Components/Toast";
import Logo from "../../assets/Brand.png";
import LoginImage from "../../assets/loginImage.png";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { setIsLoggedIn, setToken, setUser } from "../../redux/userSlice";
import { adminLogin } from "../../api/adminServices";
import { LoginSchema } from "../../utils/contant";
const Login = () => {
  useEffect(() => {
    document.title = "HR-Management | Login";
  }, []);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    document.title = "MediRep | Login";
  }, []);
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      await handleLogin(values);
    },
  });
  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await adminLogin(values);
      const data = response.data;

      const Role = data?.user?.role;
      if (Role !== "Admin") {
        notifyError("You are not allowed to login.");
        setLoading(false);
        return;
      }
      dispatch(setUser({ user: data.user, token: data.token }));
      dispatch(setIsLoggedIn(true));
      dispatch(setToken(data.token));
      notifySuccess("Successfully Logged In");
    } catch (error: any) {
      notifyError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  return (
    <div className="w-full h-screen xl:px-23.75 px-5 py-8 gap-15 flex items-center">
      <div className="xl:w-[calc(50%-30px)] w-full">
        <div className="flex items-center justify-center gap-4">
          <p className="text-[#0755E9] font-medium text-[36px]">
            <img src={Logo} className="h-auto w-125" alt="logo" />
          </p>
        </div>
        <div className="bg-[#F7F7F7] xl:px-11.5 px-6 py-8 text-center mt-5 rounded-[1px]">
          <p className="text-heading text-[24px] font-medium">Sign In</p>
          <p className="text-[#7D7D7D] md:text-[18px] text-sm font-medium mt-5">
            Welcome Back! Please enter your details
          </p>
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-3 mt-5"
          >
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm text-start text-[#7D7D7D] mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                onChange={formik.handleChange}
                value={formik.values.email}
                className="w-full h-13.75 px-4 rounded-md bg-[#29AAE10F] text-heading
                  border-none outline-none focus:ring-0 focus:border-none"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="mt-1 text-sm text-red-500 text-start">
                  *{formik.errors.email}
                </div>
              ) : null}
            </div>
            <div className="relative flex flex-col">
              <label
                htmlFor="password"
                className="text-sm text-start text-[#7D7D7D] mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                onChange={formik.handleChange}
                value={formik.values.password}
                className="w-full h-13.75 px-4 rounded-md bg-[#29AAE10F] text-heading 
                  border-none outline-none focus:ring-0 focus:border-none pr-12"
              />
              <span
                className="absolute right-4 top-10 cursor-pointer text-[#7D7D7D]"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <FiEye
                    className="text-[#0755E9]"
                    style={{ fontSize: "20px" }}
                  />
                ) : (
                  <FiEyeOff style={{ fontSize: "20px" }} />
                )}
              </span>
              {formik.touched.password && formik.errors.password ? (
                <div className="mt-1 text-sm text-red-500 text-start">
                  *{formik.errors.password}
                </div>
              ) : null}
            </div>
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-3">
                <Checkbox
                  className="[&_.ant-checkbox-inner]:border-[#0755E9] 
                  [&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-[#0755E9]"
                />
                <p className="text-heading sm:text-[14px] text-xs font-medium">
                  Remember for 30 Days
                </p>
              </div>
              <p className="text-[#0755E9] text-[12px] font-medium cursor-pointer">
                Forget password
              </p>
            </div>
            <button
              type="submit"
              className="bg-[#0755E9] cursor-pointer text-white w-full h-13.75 mt-5 rounded-md text-xl font-medium flex items-center justify-center"
            >
              {loading ? <Spin indicator={antIcon} /> : "Login"}
            </button>
          </form>
        </div>
      </div>
      <div
        className="w-[calc(50%-30px)] p-9 xl:flex hidden flex-col justify-between h-full rounded-xl text-white"
        style={{
          backgroundImage: `url(${bgiamge})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <p className="font-semibold text-[48px] leading-[100%]">
          Welcome Back! Please sign in to your{" "}
          <span className="underline">MediRep</span> account
        </p>
        <img
          src={LoginImage}
          className="w-full xl:h-76.25 2xl:h-137.5"
          alt="login"
        />
      </div>
    </div>
  );
};

export default Login;
