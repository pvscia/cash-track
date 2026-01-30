import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { registerApi } from "../../api/AuthApi";


export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confPassword: "",
      type: "manual"
    },
    validateOnMount: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Must be filled"),

      email: Yup.string()
        .required("Must be filled")
        .email("Invalid email format"),

      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Must be filled"),

      confPassword: Yup.string()
        .required("Must be filled")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),

    }),

    onSubmit: async (values) => {
      try {
        Swal.fire({
          title: "Registering...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });
        await registerApi(values);
        Swal.close();
        navigate("/login");
        Swal.fire("Success", "Register success", "success");
      } catch (err) {
        Swal.close();

        Swal.fire({
          icon: "error",
          title: "Register Failed",
          text: err.error,
          background: "#020617",
          color: "#fff",
        });
      }
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-[80vw] max-w-[500px] rounded-2xl border border-gray-100/20 p-6">

        <h2 className="text-white text-3xl font-bold mb-1">Register</h2>
        <h4 className="text-lg text-gray-400 mb-8">Register an account</h4>

        <form onSubmit={formik.handleSubmit} className="space-y-3">

          <div>
            <label className="block text-gray-300 mb-2">
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              {...formik.getFieldProps("name")}
              className={`w-full bg-slate-900 text-white px-4 py-3 rounded-lg border 
                
                ${formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : "border-gray-600"
                }`}
            />

            {formik.touched.name && formik.errors.name && (
              <p className="text-red-400 text-sm mt-1">
                {formik.errors.name}
              </p>
            )}
          </div>

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

          <div>
            <label className="block text-gray-300 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              {...formik.getFieldProps("confPassword")}
              className={`w-full bg-slate-900 text-white px-4 py-3 rounded-lg border 
                ${formik.touched.confPassword && formik.errors.confPassword
                  ? "border-red-500"
                  : "border-gray-600"
                }`}
            />

            {formik.touched.confPassword && formik.errors.confPassword && (
              <p className="text-red-400 text-sm mt-1">
                {formik.errors.confPassword}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={!formik.isValid}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Register
          </button>

          <p className="text-white text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold underline cursor-pointer"
            >
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}
