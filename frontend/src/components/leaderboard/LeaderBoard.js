import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './LeaderBoard.css'
import { SERVER_BASE_URL } from '../../config';

const LeaderBoard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token')
        const config = {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          };
        const response = await axios.get(`${SERVER_BASE_URL}/leaderboard`, config);
        setLeaderboardData(response.data); 
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setLoading(false); 
        navigate('/*')
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <>
    <h1>Leaderboard</h1>
    <div>
      {loading ? (
        <div>Loading...</div> // Show loading spinner while data is being fetched
      ) : ( 
        <table className='custom-table'>
          <thead>
            <tr className='leaderboard-tr'>
              <th className='leaderboard-th'>Username</th>
              <th className='leaderboard-th'>Number of Solves</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((item, index) => (
              <tr key={index} className='leaderboard-tr'>
                <td className='leaderboard-column1'><Link to={`/users/${item.username}`} className='leaderboard-a'>{item.username}</Link></td>
                <td className='leaderboard-column2'>{item.numberOfSolves}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </>
  );
};

export default LeaderBoard;
