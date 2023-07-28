import axios from 'axios';
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { SERVER_BASE_URL } from '../../config';
import usePageTitle from '../../hooks/usePageTitle';
import './AddProblem.css';

const AddProblem = ({ isAdmin }) => {

    usePageTitle("Add New Problem")

    // Encapsulate all of these in a single object  
    const [problemName, setProblemName] = useState('');
    const [problemStatement, setProblemStatement] = useState('');
    const [problemDifficulty, setProblemDifficulty] = useState('easy');
    const [sampleInput, setSampleInput] = useState('');
    const [sampleOutput, setSampleOutput] = useState('');
    const [tags, setTags] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const navigate = useNavigate()
    const handleTagChange = (e) => {
        const selectedTag = e.target.value;
        setTags((prevTags) => (prevTags.includes(selectedTag) ? prevTags.filter((tag) => tag !== selectedTag) : [...prevTags, selectedTag]));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token')
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },

            };
            const data = {
                name: problemName,
                statement: problemStatement,
                tags: tags,
                difficulty: problemDifficulty,
                sampleInput: sampleInput,
                sampleOutput: sampleOutput
            }
            await axios.post(`${SERVER_BASE_URL}/problems`, data, config);
            setProblemName('');
            setProblemStatement('');
            setProblemDifficulty('easy');
            setSampleInput('');
            setSampleOutput('');
            setTags([]);
            setErrorMessage(null);
            navigate('/problems');
        }
        catch (error) {
            setErrorMessage("Error creating a new problem")
        }
    };

    return (
        <>{isAdmin ?
            <>
                <div className="add-problem-container">
                    <h2>New Problem</h2>
                    <form className="add-problem-form" onSubmit={handleSubmit}>
                        <label htmlFor="problemName">Problem Name:</label>
                        <input
                            type="text"
                            id="problemName"
                            value={problemName}
                            onChange={(e) => setProblemName(e.target.value)}
                            required
                        />

                        <label htmlFor="problemStatement">Problem Statement:</label>
                        <textarea
                            id="problemStatement"
                            value={problemStatement}
                            onChange={(e) => setProblemStatement(e.target.value)}
                            required
                        />

                        <label htmlFor="problemDifficulty">Problem Difficulty:</label>
                        <select id="problemDifficulty" value={problemDifficulty} onChange={(e) => setProblemDifficulty(e.target.value)}>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>

                        <label htmlFor="sampleInput">Sample Input:</label>
                        <textarea
                            id="sampleInput"
                            value={sampleInput}
                            onChange={(e) => setSampleInput(e.target.value)}
                            required
                        />

                        <label htmlFor="sampleOutput">Sample Output:</label>
                        <textarea
                            id="sampleOutput"
                            value={sampleOutput}
                            onChange={(e) => setSampleOutput(e.target.value)}
                            required
                        />

                        <label>Tags:</label>
                        <div className="tags-container">
                            <label>
                                <input type="checkbox" value="greedy" checked={tags.includes('greedy')} onChange={handleTagChange} />
                                Greedy
                            </label>
                            <label>
                                <input type="checkbox" value="dp" checked={tags.includes('dp')} onChange={handleTagChange} />
                                DP
                            </label>
                            <label>
                                <input type="checkbox" value="constructive algorithms" checked={tags.includes('constructive algorithms')} onChange={handleTagChange} />
                                Constructive Algorithms
                            </label>
                            <label>
                                <input type="checkbox" value="graphs" checked={tags.includes('graphs')} onChange={handleTagChange} />
                                Graphs
                            </label>
                            <label>
                                <input type="checkbox" value="number theory" checked={tags.includes('number theory')} onChange={handleTagChange} />
                                Number Theory
                            </label>
                        </div>

                        <button type="submit" className="submit-button">Add Problem</button>
                    </form>
                    {errorMessage ? <p>{errorMessage}</p> : <></>}
                </div>
            </>
            : <>
                <Navigate to={'/*'} replace></Navigate>
            </>}
        </>
    );
};

export default AddProblem;
