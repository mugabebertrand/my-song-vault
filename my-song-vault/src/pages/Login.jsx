import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    fetch("https://my-song-vault.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/songs");
        } else {
          setError(data.message || "Login failed");
        }
      })
      .catch(() => setError("Server error"));
  }

  return (
    <div className="page">
      <h1>Login</h1>
      <form className="add-song-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button type="submit" className="btn-primary">Login</button>
      </form>
    </div>
  );
}

export default Login;