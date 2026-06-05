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
        setFormData({
          company: "",
          role: "",
          status: "",
          dateApplied: "",
          link: "",
          notes: "",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failure", error.message);
        setLoading(false);
      });
  };

  console.log(jobs.map((jobs) => jobs.company));
  return (
    <main className="p-5">
      <h1 className="text-3xl font-bold">Welcome Back Javascript</h1>
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
            className="bg-black text-white self-end px-4 py-1 rounded"
          >
            {loading ? "Loading" : "Submit"}
          </button>
        </div>
      </form>

      <table className="w-full overflow-x-scroll">
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Date Applied</th>
            <th>Link</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {jobs.map((job) => (
            <tr className="text-center" key={job._id}>
              <td>{job.company}</td>
              <td>{job.role}</td>
              <td>{job.status}</td>
              <td>{new Date(job.dateApplied).toLocaleDateString()}</td>
              <td>{job.link}</td>
              <td>{job.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default App;
