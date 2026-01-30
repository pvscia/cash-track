import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { forgotPasswordApi } from "../../api/AuthApi";
import Swal from "sweetalert2";

export default function ForgotPassword() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validateOnMount: true,
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Must be filled")
        .email("Invalid email format"),
    }),

     onSubmit: async (values) => {
          try {
            Swal.fire({
              title: "Submitting...",
              allowOutsideClick: false,
              didOpen: () => Swal.showLoading(),
            });
            const data = await forgotPasswordApi(values);
            Swal.close();
            navigate("/login");
            Swal.fire("Success", data.message, "success");
          } catch (err) {
            Swal.close();
    
            Swal.fire({
              icon: "error",
              title: "Submit Failed",
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

        <h2 className="text-white text-3xl font-bold mb-1">Forgot Password</h2>
        <h4 className="text-lg text-gray-400 mb-8">Get password reset email</h4>

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


          <button
            type="submit"
            disabled={!formik.isValid}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Submit
          </button>

          <p className="text-white text-center">
            Back to{" "}
            <Link
              to="/login"
              className="font-bold underline cursor-pointer"
            >
              Login
            </Link>
          </p>

          {/* Button */}

        </form>
      </div>
    </div>
  );
}
