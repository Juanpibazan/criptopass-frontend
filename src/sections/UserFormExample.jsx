// UserForm.jsx
export default function UserForm() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-slate-800">Edit User</h2>
      <input
        className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Name"
      />
      <input
        type="email"
        className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Email"
      />
      <button className="w-full rounded-md bg-indigo-600 py-2 text-white hover:bg-indigo-700">
        Save
      </button>
    </div>
  );
}