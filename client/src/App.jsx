import { useState } from "react";
import "./App.css";
import axios from "axios";
import { useEffect } from "react";

function App() {
  const [jobs, setJob] = useState([]);

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

  useEffect(() => {
    axios
      .get("http://localhost:5050/jobs")
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
      .post("http://localhost:5050/jobs", formData)
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
      })
      .catch((error) => {
        console.error("Failure", error.message);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5050/jobs/${id}`)
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
      .patch(`http://localhost:5050/jobs/${id}`, { status: newStatus })
      .then((response) => {
        setJob(jobs.map((job) => (job._id === id ? response.data : job)));
      })
      .catch((error) => console.error(error));
  };

  const getStatusStyle = (status) => {
  switch(status) {
    case "Applied": return "bg-blue-100 text-blue-700"
    case "Interview": return "bg-yellow-100 text-yellow-700"
    case "Offer": return "bg-green-100 text-green-700"
    case "Rejected": return "bg-red-100 text-red-700"
    default: return "bg-gray-100 text-gray-700"
  }
} 

  return (
    <main className="p-5 overflow-hidden">
      <h1 className="text-3xl font-bold">Welcome Back Javascript</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 my-4">
        <div className="border rounded p-3 text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-gray-500">Total</p>
        </div>
        <div className="border rounded p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.applied}</p>
          <p className="text-sm text-gray-500">Applied</p>
        </div>
        <div className="border rounded p-3 text-center">
          <p className="text-2xl font-bold text-yellow-500">
            {stats.interview}
          </p>
          <p className="text-sm text-gray-500">Interview</p>
        </div>
        <div className="border rounded p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.offer}</p>
          <p className="text-sm text-gray-500">Offer</p>
        </div>
        <div className="border rounded p-3 text-center">
          <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
          <p className="text-sm text-gray-500">Rejected</p>
        </div>
      </div>
      <form className="w-2xs border-2 p-3 mt-4" onSubmit={handleSubmit}>
        <h1 className="text-xl font-semibold">Job Track Form</h1>
        <div className="flex flex-col gap-3">
          <label>
            Company
            <input
              type="text"
              placeholder="company"
              name="company"
              className="border rounded block w-full p-1"
              onChange={handleChange}
            />
          </label>
          <label>
            Role
            <input
              type="text"
              placeholder="role"
              name="role"
              className="border rounded block w-full p-1"
              onChange={handleChange}
            />
          </label>
          <label>
            Status
            <select
              name="status"
              className="border rounded block w-full p-1"
              onChange={handleChange}
            >
              <option value="">-- Select Status</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </label>
          <label>
            Date Applied{" "}
            <input
              type="date"
              placeholder="Date Applied"
              name="dateApplied"
              className="border rounded block w-full p-1"
              onChange={handleChange}
            />
          </label>

          <label>
            {" "}
            Link
            <input
              type="text"
              placeholder="link"
              name="link"
              className="border rounded block w-full p-1"
              onChange={handleChange}
            />
          </label>

          <label>
            Notes{" "}
            <textarea
              type="text"
              placeholder="notes"
              name="notes"
              className="border rounded block w-full p-1"
              onChange={handleChange}
            />
          </label>
          <button
            type="submit"
            className="bg-black text-white self-end px-4 py-1 rounded cursor-pointer"
          >
            {loading ? "Loading" : "Submit"}
          </button>
        </div>
      </form>

      <table className="w-full overflow-scroll">
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Date Applied</th>
            <th>Link</th>
            <th>Notes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {jobs.map((job) => (
            <tr className="text-center border-b" key={job._id}>
              <td className="py-3 px-2">{job.company}</td>
              <td className="py-3 px-2">{job.role}</td>
              <td className="py-3 px-2">
                {" "}
                <select
                  value={job.status}
                  onChange={(e) => handleStatusChange(job._id, e.target.value)}
                  className={`rounded px-2 py-1 text-sm font-medium border-0 ${getStatusStyle(job.status)}`}
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
              <td className="py-3 px-2">{new Date(job.dateApplied).toLocaleDateString()}</td>
              <td className="py-3 px-2">{job.link}</td>
              <td className="py-3 px-2">{job.notes}</td>
              <td className="py-3 px-2">
                <button
                  onClick={() => handleDelete(job._id)}
                  className="bg-red-500 text-white px-2 rounded cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default App;
