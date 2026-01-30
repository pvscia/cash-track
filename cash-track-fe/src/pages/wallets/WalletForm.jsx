import { useFormik } from "formik";
import * as Yup from "yup";

export default function WalletForm({ data, onClose, onSubmit }) {

  const formik = useFormik({
    initialValues: {
      name: data.name || "",
      balance: data.balance || "",
      id: data.id
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      balance: Yup.number().required("Required"),
    }),
    onSubmit: async (values) => {
      await onSubmit(values);
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

      <div className="bg-slate-900 p-6 rounded-xl w-[400px]">

        <h2 className="text-xl font-bold mb-4">
          {data.id ? "Edit Wallet" : "Add Wallet"}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-3">

          <input
            placeholder="Wallet name"
            {...formik.getFieldProps("name")}
            className="w-full bg-slate-800 px-3 py-2 rounded border border-gray-600"
          />

          <input
            placeholder="Balance"
            type="number"
            {...formik.getFieldProps("balance")}
            className="w-full bg-slate-800 px-3 py-2 rounded border border-gray-600"
          />

          <div className="flex justify-end space-x-2 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded"
            >
              Save
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
