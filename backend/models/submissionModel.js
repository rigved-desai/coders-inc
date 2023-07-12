const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema({
    submitterUserName: {
        type: String, 
        required: true
    },
    problemID: {
        type: String,
        required: true
    }, 
    language: {
        type: String,
        required: true
    },
    submissionFile: {
        type: Buffer,
        required: true,
    },
    submissionTime: {
        type: Date,
        default: Date.now
    },
    verdict: {
        type: String, 
        required: true
    } ,
    runTime: {
        type: Number, 
        required: true
    }
})

const Submission = mongoose.model("Submission", submissionSchema)

exports.module = Submission