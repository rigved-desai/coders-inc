import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css'
import { useNavigate} from 'react-router-dom';
import { SERVER_BASE_URL } from '../../config';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    setErrorMessage(null)
      const response = await axios.post(`${SERVER_BASE_URL}/login`, { email, password });
      
      const authHeader = response.headers['authorization'];
        if(authHeader === undefined)  {
            console.log(response.data.message)
            setErrorMessage(response.data.message)
            return;
        }
      const token = authHeader ? authHeader.split(' ')[1] : null;
      console.log(token)
      if(token !== undefined) {
        console.log(token)
        localStorage.setItem('token', token);
      }
      navigate('/');
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
    <h1>Login</h1>
    <h3>Login and start coding!</h3>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
      {errorMessage !== null ? (<p>{errorMessage}</p>):(<></>)}
    </form>

    </>
  );
};

export default LoginForm;
