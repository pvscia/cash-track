import React, { useEffect, useState } from "react";
import {
  getCategoryApi,
  addCategoryApi,
  updateCategoryApi,
  deleteCategoryApi
} from "../../api/CategoryApi";
import CategoryForm from "./CategoryForm";
import CategoryItem from "./CategoryItem";
import Swal from "sweetalert2";

export default function Category() {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategorys = async () => {
    try {
      setLoading(true);
      const data = await getCategoryApi();
      setCategories(data.data);
    } catch (err) {
      Swal.fire("Error", err.message || "Failed load targets", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorys();
  }, []);

  const handleAdd = async (values) => {
    await addCategoryApi(values);
    fetchCategorys();
  };

  const handleUpdate = async (values) => {
    await updateCategoryApi(values);
    setSelectedCategory(null);
    fetchCategorys();
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete wallet?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (confirm.isConfirmed) {
      await deleteCategoryApi({ id });
      fetchCategorys();
    }
  };

  return (
    <div className="text-white">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>

        <button
          onClick={() => setSelectedCategory({})}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Category
        </button>
      </div>

      {/* Form */}
      {selectedCategory !== null && (
        <CategoryForm
          data={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onSubmit={selectedCategory.id ? handleUpdate : handleAdd}
        />
      )}

      {/* List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          {categories.map((wallet) => (
            <CategoryItem
              key={wallet.id}
              wallet={wallet}
              onEdit={() => setSelectedCategory(wallet)}
              onDelete={() => handleDelete(wallet.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
