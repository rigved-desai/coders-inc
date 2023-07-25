import { useEffect, useState } from 'react';
import './Home.css'
import axios from 'axios'
import Button from './Button/Button';
import { SERVER_BASE_URL } from '../../config';

const Home = () => {

    const [username, setUsername] = useState('')

    useEffect(() => {
        const fetchUsername = async () => {
            try {
              const token = localStorage.getItem('token')
              const config = {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                  },
                };
              const response = await axios.get(`${SERVER_BASE_URL}/`, config);
              console.log(response.data)
              setUsername(response.data.username); 
            } catch (error) {
              console.error('Error fetching user data:', error); 
            }
          };
      
          fetchUsername();
        }, []);

    return (
        <>
        <h1>Welcome back, {username}</h1>
        <div className='home-buttons'>
        <Button label={"PROBLEMS"} goTo={'problems'}/>
        <Button label={"LEADERBOARD"} goTo={'leaderboard'}/>
        <Button label={"PROFILE"} goTo={`users/${username}`}/>
        </div>
        </>
    )
}

export default Home;
