import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import AuthContext from "../services/AuthContext.js";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', {
        email,
        password
      });
      if (response?.data?.token && response?.data?.userId) {
         login(response.data.userId, response.data.token);
       navigate('/');
;
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.log('Login failed', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
<form
  onSubmit={handleSubmit}
  className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-lg"
>
  <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

  <div className="space-y-4">
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <button
    type="submit"
    className="w-full mt-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
  >
    Login
  </button>

  <p className="mt-4 text-center text-sm text-gray-600">
    Don&apos;t have an account?{" "}
    <Link to="/signup" className="text-blue-600 hover:underline">
      Sign up
    </Link>
  </p>
</form>

  );
}
export default Login;