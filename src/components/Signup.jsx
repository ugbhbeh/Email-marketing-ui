import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

import AuthContext from '../services/AuthContext.js';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.username || !formData.password) {
      setError('All fields are required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await api.post('/users', formData);
      if (response.status === 201 && response.data.token && response.data.userId) {
        login(response.data.userId, response.data.token);
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setError('Email or username already exists.');
      } else {
        setError(error.response?.data?.error || 'Signup failed, please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const res = await api.post('/users/guest');
      if (res.status !== 200) {
        throw new Error('Guest login failed');
      }
      const data = res.data;
      if (data.token && data.userId) {
        login(data.userId, data.token);
        navigate('/');
      } else {
        setError('Guest login failed. Please try again.');
      }
    } catch (err) {
      console.error('Guest login error:', err);
      setError('Guest login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
      <div>
        <form onSubmit={handleSubmit} >
          <h2 >Sign Up</h2>
          {error && <div >{error}</div>}
          <div>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <div >
          <p>Or continue as guest:</p>
          <button
            onClick={handleGuestLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in as Guest...' : 'Continue as Guest'}
          </button>
          <p>
            Already have an account?{' '}
            <Link to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
  );
}

export default Signup;