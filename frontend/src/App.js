import './App.css';
import Home from './components/home/Home'
import { Routes, Route, Navigate} from 'react-router-dom';
import ProblemList from './components/problemlist/ProblemList';
import LeaderBoard from './components/leaderboard/LeaderBoard';
import UserList from './components/userlist/UserList';
import UserProfile from './components/userprofile/UserProfile';
import NotFound from './components/notfound/NotFound';
import Problem from './components/problem/Problem';
import SubmissionList from './components/submissionlist/SubmissionList';
import Submission from './components/submission/Submission';
import LoginForm from './components/loginform/LoginForm';
import RegisterForm from './components/registerform/RegisterForm';
import axios from 'axios';
import { useEffect, useState } from 'react';
import NavBar from './components/navbar/Navbar';

function App() {

  const [isAuthenticated, setisAuthenticated] = useState(false)

  const ProtectedRoute = ({ children }) => {
    const [isTokenValid, setIsTokenValid] = useState(null);
  
    const validateToken = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        };
        const response = await axios.get('http://localhost:8000/validate', config);
        console.log(response.data)
        return response.data.valid === true;
      } catch (error) {
        console.log(error.message);
        return false;
      }
    };
  
    useEffect(() => {
      const checkTokenValidity = async () => {
        const isValid = await validateToken();
        setIsTokenValid(isValid);
        setisAuthenticated(isValid)
      };
  
      checkTokenValidity();
    }, []);

    if(isTokenValid == null) {
      return null;
    }
    
    if (isTokenValid) {
      return children;
    } else {
      return <Navigate to="/login" replace />;
    }
  };


  return (
    <>
    <NavBar isAuthenticated={isAuthenticated}/>
    <Routes>  
    <Route path='/login' element = {<LoginForm/>}/>
    <Route path='/register' element = {<RegisterForm/>}/>
    <Route path={'/logout'}/>
    
      <Route path='/' element={
      <ProtectedRoute> <Home/> </ProtectedRoute>
      }/>
      
      <Route path = '/problems'>

        <Route index element={<ProtectedRoute> <ProblemList/> </ProtectedRoute>}/>
        
        <Route path=':id'>
          <Route index element={<ProtectedRoute> <Problem/> </ProtectedRoute>}/>
          <Route path ='submissions' element = {<ProtectedRoute> <SubmissionList/> </ProtectedRoute>}/>
        </Route>

        <Route path ='submissions'>
          <Route index element={<ProtectedRoute> <SubmissionList/> </ProtectedRoute>}/>
          <Route path = ':id' element={<ProtectedRoute> <Submission/> </ProtectedRoute>}></Route>
        </Route>

      </Route>
      
      <Route path = '/leaderboard' 
            element={
              <ProtectedRoute> <LeaderBoard/> </ProtectedRoute>
            }/>
            
      <Route path = '/users'>
        <Route index element={<ProtectedRoute> <UserList/> </ProtectedRoute>}/>  
        <Route path = ':username' element={<ProtectedRoute> <UserProfile/> </ProtectedRoute>}/>
      </Route>

      <Route path = '*' element = {<NotFound/>}/>
    </Routes>
    </>
  );
}

export default App;
