const Problem = require('../models/problemModel')
const Submission = require('../models/submissionModel')

exports.loadSubmitPage = async (req, res, next) => {
    try {
        const problemID = req.params.problemID;
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
        const problemID = req.params.problemID;
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
        const submissions = await Submission.create({

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

exports.loadSubmissionsByProblemID = (req, res, next) => {
    
}
exports.getSubmissionByID = (req, res, next) => {
    
}