import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PopUp from "../components/PopUp";

const STORAGE_KEY = "workshopParticipants";
const defaultForm = {
  name: "",
  email: "",
  phone: "",
  gender: "Female",
  workshop: "React Basics",
};

function Register() {
  const [form, setForm] = useState(defaultForm);
  const [participants, setParticipants] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setParticipants(JSON.parse(saved));
      } catch (error) {
        console.warn("Unable to parse saved participants", error);
      }
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    window.clearTimeout(window.registerToast);
    window.registerToast = window.setTimeout(() => {
      setMessage(null);
    }, 3600);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };

    if (!trimmed.name || !trimmed.email) {
      showMessage("error", "Name and email are required.");
      return;
    }

    const duplicate = participants.some(
      (participant) => participant.email.toLowerCase() === trimmed.email.toLowerCase()
    );

    if (duplicate) {
      showMessage("warning", "A participant with this email is already registered.");
      return;
    }

    const nextParticipant = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now()}`,
      ...trimmed,
      registeredAt: new Date().toISOString(),
    };

    const nextList = [nextParticipant, ...participants];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    setParticipants(nextList);
    setForm(defaultForm);
    showMessage("success", "Registration saved successfully.");
  };

  return (
    <section className="page register-page">
      <div className="page-animation">
        <span className="moon" />
        <span className="star star1" />
        <span className="star star2" />
        <span className="star star3" />
        <span className="star star4" />
        <span className="star star5" />
      </div>
      <div className="register-card">
        <div className="panel-header">
          <div>
            <h1>Workshop registration</h1>
          </div>
          <Link to="/dashboard" className="secondary-button">
            View Dashboard
          </Link>
        </div>

        {message && <PopUp type={message.type} message={message.text} />}

        <form className="register-form" onSubmit={handleSubmit}>
          <label>
            Participant Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </label>

          <label>
            Email address
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </label>

          <label>
            Phone number
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Optional"
            />
          </label>

          <label>
            Gender
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Workshop
            <select name="workshop" value={form.workshop} onChange={handleChange}>
              <option>React Basics</option>
              <option>Advanced React</option>
              <option>UI Design</option>
              <option>Project Management</option>
            </select>
          </label>

          <button type="submit">Register Participant</button>
        </form>

        <div className="summary-box">
          <span>Total registered</span>
          <strong>{participants.length}</strong>
        </div>

        <div className="participant-list">
          <h2>Registered participants</h2>
          {participants.length ? (
            <table className="participant-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>Workshop</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr key={participant.id}>
                    <td>{participant.name}</td>
                    <td>{participant.email}</td>
                    <td>{participant.phone || "-"}</td>
                    <td>{participant.gender}</td>
                    <td>{participant.workshop}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">No participants registered yet.</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Register;
