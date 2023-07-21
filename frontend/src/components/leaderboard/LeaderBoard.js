import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './LeaderBoard.css'

const LeaderBoard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token')
        const config = {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          };
        const response = await axios.get('http://localhost:8000/leaderboard', config);
        setLeaderboardData(response.data); 
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setLoading(false); 
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading...</div> // Show loading spinner while data is being fetched
      ) : (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Number of Solves</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((item, index) => (
              <tr key={index}>
                <td><Link to={`/users/${item.username}`}>{item.username}</Link></td>
                <td>{item.numberOfSolves}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaderBoard;
