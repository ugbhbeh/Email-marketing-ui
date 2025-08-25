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
        <form onSubmit={handleSubmit} >
          <h2>Welcome Back</h2>
          <div >
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit">
            Login
          </button>
          <p>
            Don't have an account?{' '}
            <Link to="/signup">
              Sign up
            </Link>
          </p>
        </form>

  );
}
export default Login;