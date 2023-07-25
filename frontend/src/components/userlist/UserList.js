import './UserList.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const UserList = () => {
    const navigate = useNavigate();
    const fetchUsername = async () => {
        try {
          const token = localStorage.getItem('token')
          const config = {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            };
          const response = await axios.get('http://localhost:8000/', config);
          console.log(response.data)
          navigate(`/users/${response.data.username}`)
        } 
        catch (error) {
          console.error('Error fetching user data:', error); 
          navigate('/login')
        }
      };
      fetchUsername();

    return (<></>)
}

export default UserList;