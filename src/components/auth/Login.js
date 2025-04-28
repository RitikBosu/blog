import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticate } from '../../services/authService';
import { AuthContext } from '../../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await authenticate(username, password);
      login(userData);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    // For demo purposes, we'll just show an alert
    alert("Sign up functionality would be implemented here");
    // In a real app, you would navigate to a signup page
    // navigate('/signup');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Resource Blog</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="signup-section">
          <p>Don't have an account?</p>
          <button 
            type="button" 
            className="signup-btn" 
            onClick={handleSignup}
          >
            Sign Up
          </button>
        </div>
        
        <div className="login-info">
          <p>Demo Accounts:</p>
          <ul>
            <li>Facilitator: username: facilitator1, password: pass123</li>
            <li>Student: username: student1, password: student123</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;