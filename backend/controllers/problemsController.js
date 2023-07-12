const Problem = require('../models/problemModel')

exports.getAllProblems = async (req, res, next) => {
    try {
        const problems = await Problem.findAll().select('name, tags, difficulty, numberOfSolves')
        return res.status(200).json(problems)
    }
    catch(e) {
        console.log(e.message);
        return res.status(404).json({
            result: "fail"
        })
    }
}

exports.addProblem = async (req, res, next) => {
    try {
        const {name, statement, tags, difficulty, sampleInput, sampleOutput, testCases} = req.body;

        await Problem.create({
            name: name,
            statement: statement,
            tags: tags,
            difficulty: difficulty, 
            sampleInput: sampleInput,
            sampleOutput: sampleOutput, 
            testCases: testCases

        })
        return res.status(200).json({
            result: "success"
        })
    }
    catch(e) {
        console.log(e.message);
        return res.status(404).json({
            result: "fail"
        })
    }
}

exports.getProblemByID = async (req, res, next) => {
    try {
        const problemID = req.body;
        const problem = await Problem.findById(problemID).select('name statement tags difficulty sampleInput sampleOutput');
        return res.status(200).json(problem)

    }
    catch(e) {
        console.log(e.message);
        return res.status(404).json({
            result: "fail"
        })
        
    }
}

exports.deleteProblem = async (req, res, next) => {
    try {
        const problemID = req.params.problemID;
        await Problem.findByIdAndDelete(problemID);
        return res.status(200).json({
            result: "success" 
        })

    }
    catch(e) {
        console.log(e.message);
        return res.status(404).json({
            result: "fail"
        })
        
    }
}

exports.updateProblem = async (req, res, next) => {
    try {
        const problemID = req.params.problemID;
        const params = req.body;
        const problem = await Problem.findOneAndUpdate({_id: problemID}, params, {new: true})
        return res.status(200).json(problem)    
    }
    catch(e) {
        console.log(e.message);
        return res.status(404).json({
            result: "fail"
        })
    }

}