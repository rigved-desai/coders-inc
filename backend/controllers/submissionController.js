const Problem = require('../models/problemModel')
const Submission = require('../models/submissionModel')

exports.loadSubmitPage = async (req, res, next) => {
    try {
        const problemID = req.params.id;
        const problem = await Problem.findById(problemID).select('name')
        return res.status(200).json(problem)
    }
    catch(e) {
        console.log(e.message);
        return res.status(404).json({
            result: "fail"
        })
    }
}

exports.submitSolution = async (req, res, next) => {
    try {
        const problemID = req.params.id;
        const {language, submissionFile}  = req.body;
        
        let solution //get file from user
        //fire container and receive stdout, if stdout does not exist, check stderr and return that
        // compare output.txt of user with checker/ans.txt and return verdict

        // Defining faux variables for now to test API 
        let verdict = "AC"
        let runTime = 100
        const submission = await Submission.create({
            submitterUserName: res.session.user.username,
            problemID: problemID,
            language: language,
            submissionFile: submissionFile,
            verdict: verdict,
            runTime: runTime
        })
        return res.status(200).json({
            result: "success"
        })

    }
    catch(e) {
        console.log(e.message);
        console.log(e.message);
        return res.status(404).json({
            result: "fail"
        })
    }
}

exports.loadAllSubmissions = async (req, res, next) => {
    try {
        const submissions = await Submission.findAll();
        return res.status(200).json(submissions)    
    }
    catch(e) {
        console.log(e.message);
        return res.status(404).json({
            result: "fail"
        })
    }
}

exports.loadSubmissionsByProblemID = async (req, res, next) => {
    const problemID = req.params.id
    try {
        const submissions = await Submission.find({problemID: problemID});
        return res.status(200).json(submissions)
        
    }
    catch(e) {
        console.log(e.message);
        return res.status(404).json({
            result: "fail"
        })
    }
}
exports.getSubmissionByID = async (req, res, next) => {
    const solutionID = req.params.sid
    const problemID = req.params.id

    try  {
        const submission = await Submissions.find({problemID: problemID, _id:solutionID})
        return res.status(200).json(submission)
    }
    catch(e) {
        console.log(e.message);
        return res.status(404).json({
            result: "fail"
        })
    }
}