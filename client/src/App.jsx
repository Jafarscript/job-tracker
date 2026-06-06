import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [jobs, setJob] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "",
    dateApplied: "",
    link: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const stats = {
    total: jobs.length,
    applied: jobs.filter((job) => job.status === "Applied").length,
    interview: jobs.filter((job) => job.status === "Interview").length,
    offer: jobs.filter((job) => job.status === "Offer").length,
    rejected: jobs.filter((job) => job.status === "Rejected").length,
  };

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API}jobs`)
      .then((response) => {
        setJob(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${API}jobs`, formData)
      .then((response) => {
        console.log("Success");
        setJob([...jobs, response.data]);
        setLoading(false);
        setFormData({
          company: "",
          role: "",
          status: "",
          dateApplied: "",
          link: "",
          notes: "",
        });
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Failure", error.message);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`${API}jobs/${id}`)
      .then((response) => {
        console.log(response);
        setJob(jobs.filter((job) => job._id !== id));
      })
      .catch((error) => {
        console.error("Failure", error.message);
      });
  };

  const handleStatusChange = (id, newStatus) => {
    axios
      .patch(`${API}jobs/${id}`, { status: newStatus })
      .then((response) => {
        setJob(jobs.map((job) => (job._id === id ? response.data : job)));
      })
      .catch((error) => console.error(error));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-500/15 text-blue-400 border-blue-500/25";
      case "Interview":
        return "bg-amber-500/15 text-amber-400 border-amber-500/25";
      case "Offer":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
      case "Rejected":
        return "bg-red-500/15 text-red-400 border-red-500/25";
      default:
        return "bg-slate-500/15 text-slate-400 border-slate-500/25";
    }
  };

  const statCards = [
    { label: "Total", value: stats.total, color: "text-slate-100", bar: "bg-slate-500" },
    { label: "Applied", value: stats.applied, color: "text-blue-400", bar: "bg-blue-500" },
    { label: "Interview", value: stats.interview, color: "text-amber-400", bar: "bg-amber-500" },
    { label: "Offer", value: stats.offer, color: "text-emerald-400", bar: "bg-emerald-500" },
    { label: "Rejected", value: stats.rejected, color: "text-red-400", bar: "bg-red-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

      {/* ── Sticky Navbar ── */}
      <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <svg className="w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-slate-100">
              Job<span className="text-emerald-400">Track</span>
            </span>
          </div>

          {/* CTA */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-150 shadow-lg shadow-emerald-500/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add Application</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── Page heading ── */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Track the full lifecycle of your job search.</p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {statCards.map(({ label, value, color, bar }) => (
            <div
              key={label}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors duration-200 col-span-1"
            >
              <p className={`text-3xl font-bold tabular-nums ${color}`}>{value}</p>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mt-2">{label}</p>
              <div className={`w-7 h-0.5 rounded-full mt-3 ${bar} opacity-60`} />
            </div>
          ))}
        </div>

        {/* ── Applications Table ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

          {/* Table header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">All Applications</h2>
            <span className="text-xs text-slate-500 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-full tabular-nums">
              {jobs.length} {jobs.length === 1 ? "entry" : "entries"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/70">
                  {["Company", "Role", "Status", "Date Applied", "Link", "Notes", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-600">
                        <svg className="w-10 h-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-3-3v6M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                        </svg>
                        <p className="text-sm">No applications yet.</p>
                        <button
                          onClick={() => setShowModal(true)}
                          className="text-emerald-400 text-sm hover:text-emerald-300 underline underline-offset-2 transition-colors"
                        >
                          Add your first one →
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr
                      key={job._id}
                      className="hover:bg-slate-800/25 transition-colors group"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-slate-100 whitespace-nowrap">{job.company}</td>
                      <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">{job.role}</td>

                      {/* Status as styled select-badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job._id, e.target.value)}
                          className={`appearance-none cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-full border bg-transparent text-center transition-colors focus:outline-none ${getStatusStyle(job.status)}`}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Interview">Interview</option>
                          <option value="Offer">Offer</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                        {new Date(job.dateApplied).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        {job.link ? (
                          <a
                            href={job.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            View
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : (
                          <span className="text-slate-700">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-400 max-w-xs">
                        <span className="line-clamp-1">{job.notes || <span className="text-slate-700">—</span>}</span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="text-xs text-slate-600 hover:text-red-400 font-medium opacity-0 group-hover:opacity-100 transition-all duration-150 px-2 py-1 rounded hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── Add Application Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Panel */}
          <div className="relative w-full sm:max-w-md bg-slate-900 sm:rounded-2xl rounded-t-2xl border border-slate-700/80 shadow-2xl shadow-black/50 overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
              <div>
                <h2 className="text-base font-semibold text-slate-100">New Application</h2>
                <p className="text-xs text-slate-500 mt-0.5">Fill in the details below</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Company + Role side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Stripe"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                    Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Engineer"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition"
                  />
                </div>
              </div>

              {/* Status + Date side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition"
                  >
                    <option value="">Select…</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                    Date Applied
                  </label>
                  <input
                    type="date"
                    name="dateApplied"
                    value={formData.dateApplied}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                  Job Link
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                  Notes
                </label>
                <textarea
                  placeholder="Referral, recruiter name, salary range…"
                  name="notes"
                  value={formData.notes}
                  rows={3}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm px-4 py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-slate-950 font-semibold text-sm px-4 py-2.5 rounded-lg transition-all shadow-lg shadow-emerald-500/20"
                >
                  {loading ? "Saving…" : "Save Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;