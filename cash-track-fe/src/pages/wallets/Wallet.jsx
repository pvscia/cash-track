import React, { useEffect, useState } from "react";
import {
  getWalletApi,
  addWalletApi,
  updateWalletApi,
  deleteWalletApi
} from "../../api/WalletApi";
import WalletForm from "./WalletForm";
import WalletItem from "./WalletItem";
import Swal from "sweetalert2";

export default function Wallet() {

  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const data = await getWalletApi();
      setWallets(data.data);
    } catch (err) {
      Swal.fire("Error", err.message || "Failed load wallets", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleAdd = async (values) => {
    await addWalletApi(values);
    fetchWallets();
  };

  const handleUpdate = async (values) => {
    await updateWalletApi(values);
    setSelectedWallet(null);
    fetchWallets();
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete wallet?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (confirm.isConfirmed) {
      await deleteWalletApi({ id });
      fetchWallets();
    }
  };

  return (
    <div className="text-white">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Wallets</h1>

        <button
          onClick={() => setSelectedWallet({})}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Wallet
        </button>
      </div>

      {/* Form */}
      {selectedWallet !== null && (
        <WalletForm
          data={selectedWallet}
          onClose={() => setSelectedWallet(null)}
          onSubmit={selectedWallet.id ? handleUpdate : handleAdd}
        />
      )}

      {/* List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          {wallets.map((wallet) => (
            <WalletItem
              key={wallet.id}
              wallet={wallet}
              onEdit={() => setSelectedWallet(wallet)}
              onDelete={() => handleDelete(wallet.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
