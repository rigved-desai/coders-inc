import './ProblemList.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { SERVER_BASE_URL } from '../../config';

const ProblemList = () => {

    const [problemList, setProblemList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

  useEffect(() => {

    const fetchProblemList = async () => {
      try {
        const token = localStorage.getItem('token')
        const config = {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          };
        const response = await axios.get(`${SERVER_BASE_URL}/problems`, config);
        setProblemList(response.data); 
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching problem data:', error);
        setLoading(false); 
        navigate('/*')
      }
    };

    fetchProblemList();
  }, []);

    return (
        <>
    <h1 style={{fontFamily: 'Titillium Web'}}>Problems</h1>
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : ( 
        <table className='custom-table'>
          <thead>
            <tr>
              <th>Problem Name</th>
              <th>Difficulty</th>
              <th>Tags</th>
              <th>Number of Solves</th>
            </tr>
          </thead>
          <tbody>
            {problemList.map((item, index) => (
              <tr key={index}>
                <td className='column1'><Link to={`/problems/${item._id}`}>{item.name}</Link></td>
                <td>{item.difficulty}</td>
                <td>{item.tags}</td>
                <td className='column2'>{item.numberOfSolves}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </>
    )
}

export default ProblemList;