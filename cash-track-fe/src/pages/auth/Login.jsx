import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Must be filled")
        .email("Invalid email format"),

      password: Yup.string()
        .required("Must be filled"),
    }),

    onSubmit: async (values) => {
      try {
        await login(values);
        navigate("/");
      } catch {
        alert("Login failed");
      }
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-[80vw] max-w-[500px] rounded-2xl border border-gray-100/20 p-6">

        <h2 className="text-white text-3xl font-bold mb-1">Login</h2>
        <h4 className="text-lg text-gray-400 mb-8">Login into your account</h4>

        <form onSubmit={formik.handleSubmit} className="space-y-3">

          <div>
            <label className="block text-gray-300 mb-2">
              Email
            </label>

            <input
              type="text"
              placeholder="Enter your email"
              {...formik.getFieldProps("email")}
              className={`w-full bg-slate-900 text-white px-4 py-3 rounded-lg border 
                
                ${formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-600"
                }`}
            />

            {formik.touched.email && formik.errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {formik.errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              {...formik.getFieldProps("password")}
              className={`w-full bg-slate-900 text-white px-4 py-3 rounded-lg border 
                ${formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-600"
                }`}
            />

            {formik.touched.password && formik.errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          <Link
            to="/forgot-password"
            className="block text-sm text-right font-medium underline cursor-pointer text-gray-400 hover:text-gray-300 transition"
          >
            Forgot Password
          </Link>


          <button
            type="submit"
            disabled={!formik.isValid}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Login
          </button>

          <p className="text-white text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold underline cursor-pointer"
            >
              Register
            </Link>
          </p>

          {/* Button */}

        </form>
      </div>
    </div>
  );
}
