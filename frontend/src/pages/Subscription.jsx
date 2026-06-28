import React from "react";

export default function Subscriptions({ subsData, onDelete }) {
  const dummySubs = [
    {
      _id: "1",
      name: "Netflix",
      category: "Entertainment",
      price: 15.49,
      status: "Active",
      nextBilling: "2026-07-04",
    },
    {
      _id: "2",
      name: "AWS Cloud",
      category: "Infrastructure",
      price: 84.0,
      status: "Active",
      nextBilling: "2026-07-12",
    },
    {
      _id: "3",
      name: "ChatGPT Plus",
      category: "Productivity",
      price: 20.0,
      status: "Paused",
      nextBilling: "N/A",
    },
  ];

  const subscriptions = subsData || dummySubs;

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Subscriptions
          </h1>
          <p className="text-sm text-slate-500">
            Manage and monitor all your recurring operational assets.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">Subscription Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Monthly Cost</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Next Renewal</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
            {subscriptions.map((sub) => (
              <tr
                key={sub._id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-semibold text-slate-900">
                  {sub.name}
                </td>
                <td className="px-6 py-4 text-slate-500">{sub.category}</td>
                <td className="px-6 py-4 font-medium text-slate-900">
                  ${sub.price.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      sub.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{sub.nextBilling}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(sub._id)}
                    className="text-rose-600 hover:text-rose-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
