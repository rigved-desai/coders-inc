import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SolveCounter from './solvecounter/SolveCounter';
import SubmissionCounter from './submissioncounter/SubmissionCounter';
import './UserProfile.css'

const UserProfile = () => {

    const { username } = useParams();
    const [userDetails, setuserDetails] = useState({
        username: '',
        numberOfSolves: '',
        numberOfSubmissions: ''
    })
    const naviagate = useNavigate();


    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token')
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`http://localhost:8000/users/${username}`, config);
                console.log(response.data)
                if(!response.data) {
                    naviagate('/*')
                }
                setuserDetails(response.data)
                console.log(response.data)
            }
            catch (error) {
                console.log("Error fetching user data", error)
                naviagate('/*')
            }
        }

        fetchUserDetails()
    }, [username])


    return (
        <>
            <h2 className='user-header'>{userDetails.username}</h2>
            <div className='counter-container'>
                <SubmissionCounter numberOfSubmissions={userDetails.numberOfSubmissions}/>
                <SolveCounter numberOfSolves={userDetails.numberOfSolves}/>
            </div>
        </>
    )
}

export default UserProfile;