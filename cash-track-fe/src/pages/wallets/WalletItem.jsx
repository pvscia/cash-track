export default function WalletItem({ wallet, onEdit, onDelete }) {
  return (
    <div className="bg-slate-900 border border-gray-700 p-4 rounded-lg flex justify-between items-center">

      <div>
        <p className="font-semibold">{wallet.name}</p>
        <p className="text-gray-400 text-sm">
          Balance: {wallet.balance}
        </p>
      </div>

      <div className="space-x-2">
        <button
          onClick={onEdit}
          className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-700"
        >
          Edit
        </button>

        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
