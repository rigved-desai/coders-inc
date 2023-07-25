import './App.css';
import Home from './components/home/Home'
import { Routes, Route} from 'react-router-dom';
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

function App() {
  return (
    <>
    <Routes>  
    <Route path='/login' element = {<LoginForm/>}/>
    <Route path='/register' element = {<RegisterForm/>}/>
    
      <Route path='/' element={<Home/>}/>
      
      <Route path = '/problems'>

        <Route index element={<ProblemList/>}/>
        
        <Route path=':id'>
          <Route index element={<Problem/>}/>
          <Route path ='submissions' element = {<SubmissionList/>}/>
        </Route>

        <Route path ='submissions'>
          <Route index element={<SubmissionList/>}/>
          <Route path = ':id' element={<Submission/>}></Route>
        </Route>

      </Route>
      
      <Route path = '/leaderboard' element={<LeaderBoard/>}/>
            
      <Route path = '/users'>
        <Route index element={<UserList/>}/>  
        <Route path = ':username' element={<UserProfile/>}/>
      </Route>

      <Route path = '*' element = {<NotFound/>}/>
    </Routes>
    </>
  );
}

export default App;
