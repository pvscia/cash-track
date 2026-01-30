import React, { useEffect, useState } from "react";
import {
  getTargetApi,
  addTargetApi,
  updateTargetApi,
  deleteTargetApi
} from "../../api/TargetApi";
import TargetForm from "./TargetForm";
import TargetItem from "./TargetItem";
import Swal from "sweetalert2";

export default function Target() {

  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);

  const fetchTargets = async () => {
    try {
      setLoading(true);
      const data = await getTargetApi();
      setTargets(data.data);
    } catch (err) {
      Swal.fire("Error", err.message || "Failed load targets", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargets();
  }, []);

  const handleAdd = async (values) => {
    await addTargetApi(values);
    fetchTargets();
  };

  const handleUpdate = async (values) => {
    await updateTargetApi(values);
    setSelectedTarget(null);
    fetchTargets();
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete wallet?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (confirm.isConfirmed) {
      await deleteTargetApi({ id });
      fetchTargets();
    }
  };

  return (
    <div className="text-white">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Targets</h1>

        <button
          onClick={() => setSelectedTarget({})}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Target
        </button>
      </div>

      {/* Form */}
      {selectedTarget !== null && (
        <TargetForm
          data={selectedTarget}
          onClose={() => setSelectedTarget(null)}
          onSubmit={selectedTarget.id ? handleUpdate : handleAdd}
        />
      )}

      {/* List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          {targets.map((wallet) => (
            <TargetItem
              key={wallet.id}
              wallet={wallet}
              onEdit={() => setSelectedTarget(wallet)}
              onDelete={() => handleDelete(wallet.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
