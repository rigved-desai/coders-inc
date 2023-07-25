import React, { useState } from 'react';
import axios from 'axios';
import './RegisterForm.css'
import { useNavigate} from 'react-router-dom';
import { SERVER_BASE_URL } from '../../config';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cnfpassword, setCnfPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        if(password !== cnfpassword) {
            setErrorMessage("Passwords do not match!")
            return;
        }
      const response = await axios.post(`${SERVER_BASE_URL}/register`, {username, email, password });
      if(response.data.status === 'fail') {
        setErrorMessage(response.data.message);
        return;
      }
      console.log('Registration Successful')
      navigate('/login');
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
    <h1>Register</h1>
    <h3>Make an account and start coding!</h3>
    <form onSubmit={handleSubmit}>
    <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
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
        <div>
        <label htmlFor="password2">Confirm Password:</label>
        <input
          type="password"
          id="password2"
          value={cnfpassword}
          onChange={(e) => setCnfPassword(e.target.value)}
        />
      </div>
      </div>
      <button type="submit">Register</button>
      {errorMessage !== null ? (<p>{errorMessage}</p>):(<></>)}
    </form>
    </>
  );
};

export default RegisterForm;
