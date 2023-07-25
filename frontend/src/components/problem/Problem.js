import './Problem.css'
import ProblemDesc from './problemdesc/ProblemDesc';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Editor from "@monaco-editor/react"
import Select from "react-select";
import ToggleThemeButton from './togglethemebutton/ToggleThemeButton';
import CompileButton from './compilebutton/CompileButton';
import Input from './input/Input';
import Output from './output/Output';
import Verdict from './verdict/Verdict';
import SubmitButton from './submitbutton/SubmitButton';

const Problem = () => {
    let { id } = useParams();
    const [problemData, setProblemData] = useState(null);

    const [language, setLanguage] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [editorValue, setEditorValue] = useState('');
    
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    
    const [compileBtnPressed, setCompileBtnPressed] = useState(false);
    const [submiBtnPressed, setSubmitBtnPressed] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false)
    const [isSubmitting, setIsSubmitting]  = useState(false)
    const [execTime, setExecTime] = useState(null)
    

    const [verdict, setVerdict] = useState(null)
    const [isAccepted, setIsAccepted] = useState(false)
    const [submissionID, setSubmissionID] = useState(null)


    const outputRef = useRef(null);
    const verdictRef = useRef(null);

    const handleEditorChange = (value) => {
        setEditorValue(value);
    };

    const handleToggleMode = () => {
        setIsDarkMode(!isDarkMode);
    };
    const onSelectLanguageChange = (sl) => {
        setLanguage(sl.value);
    };

    const handleInputChange = (event) => {
        setInput(event.target.value)
    }

    const handleSubmit = async() => {
        setSubmitBtnPressed(true);
        setTimeout(() => {
        setSubmitBtnPressed(false);
        }, 200);

        setVerdict(false)
        setIsSubmitting(true)

        try {
            const token = localStorage.getItem('token')
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
               
            };
            const data = {
                language: language,
                code: editorValue
            }
            const response = await axios.post(`http://localhost:8000/problems/${id}/submit`,data, config);
            if(response.data.verdict === 1)  {
                setVerdict("Accepted")
                setIsAccepted(true)
            }
            else{
                setVerdict(response.data.message)
                setIsAccepted(false)
            }
            verdictRef.current?.scrollIntoView({ behavior: 'smooth' });
            setSubmissionID(response.data.submissionID)

        } catch (error) {
            verdictRef.current?.scrollIntoView({ behavior: 'smooth' });
            setVerdict("Error submitting code!")
            setIsAccepted(false)
            setIsSubmitting(false)
            console.error('Error submitting data:', error);
        }
        setIsSubmitting(false)
    };



  const handleCompile = async() => {
    setCompileBtnPressed(true);
    setTimeout(() => {
      setCompileBtnPressed(false);
    }, 200);

    setIsCompiling(true)
    setOutput('')

    try {
        const token = localStorage.getItem('token')
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
           
        };
        const data = {
            language: language,
            code: editorValue,
            input: input
        }
        const response = await axios.post(`http://localhost:8000/compile`,data, config);
        if(response.data.result.code !== 0) {
            setOutput("Compilation Error");
            setExecTime(`${response.data.result.timeTaken}ms`)
        } 
        else {
            setOutput(response.data.result.message);
            console.log(response.data.result.timeTaken)
            setExecTime(`${response.data.result.timeTaken}ms`)
        }

    } catch (error) {
        outputRef.current?.scrollIntoView({ behavior: 'smooth' });
        setOutput('Some Error Occured')
        setExecTime(null)
        setIsCompiling(false)
        console.error('Error sending code for compilation!', error);
    }
    outputRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsCompiling(false)
    
  };

    useEffect(() => {
        const fetchProblemData = async () => {
            try {
                const token = localStorage.getItem('token')
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`http://localhost:8000/problems/${id}`, config);
                setProblemData(response.data)

            } catch (error) {
                console.error('Error fetching problem data:', error);
            }
        }
        fetchProblemData();
    }, [id])

    return (
        <>
            <div className='parent-container'>
                <div className='child-container'>
                    {problemData ? <ProblemDesc data={problemData} /> : <div>Problem data loading...</div>}
                </div>
                <div className='child-container'>
                    <p className='code-title'>Code here!</p>
                    <div className='parent-container'>
                        <div className='editor-header-container'>
                        <Select
                            placeholder={`Select Language`}
                            options={
                                [
                                    { value: 'cpp', label: 'C++' },
                                    { value: 'python', label: 'Python' },
                                    { value: 'java', label: 'Java' },
                                ]
                            }
                            onChange={(selectedOption) => onSelectLanguageChange(selectedOption)}
                        />
                        <ToggleThemeButton className='child' handleToggleMode={handleToggleMode} isDarkMode={isDarkMode} />
                        { verdict ? <Verdict ref={verdictRef} verdict={verdict} isAccepted = {isAccepted} submissionID={submissionID} /> : <></>}
                        </div>
                    </div>
                    <br />
                    <div className='editor-container'>
                        <Editor
                            fontSize='16px'
                            height="60vh"
                            width={`100%`}
                            language={language}
                            value={editorValue}
                            onChange={handleEditorChange}
                            theme={isDarkMode ? 'vs-dark' : 'vs-light'}
                            defaultValue="// some comment"
                            options={{
                                fontSize: "16px"
                            }}
                        />
                    </div>
                    <br />
                    <div className='parent-container'>
                        <CompileButton 
                         isPressed={compileBtnPressed} 
                         isCompiling={isCompiling}
                         isSubmitting={isSubmitting}
                         handlePress={handleCompile}
                         />
                        <SubmitButton 
                        isPressed={submiBtnPressed}
                        isCompiling={isCompiling}
                        isSubmitting={isSubmitting}
                        handlePress={handleSubmit}
                        />
                    </div>
                    <div ref={outputRef} className='parent-container'>
                    <Input inputValue={input} handleInputChange={handleInputChange} />
                    <Output outputValue={output} isCompiling={isCompiling} execTime={execTime}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Problem;