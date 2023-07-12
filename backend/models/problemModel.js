const mongoose = require('mongoose')

const problemSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        unique: true
    },
    statement: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
    },
    difficulty: {
        type: String, 
        required: true
    },
    sampleInput: {
        type : String,
        required: true
    },
    sampleOutput: {
        type : String,
        required: true
    },
    numberOfSolves: {
        type: Number,
        default: 0
    },
    solvers: {
        type: [String]        
    },
    testCases: {
        type: [Buffer],
        required: true
    }
})

const Problem = mongoose.model("Problem", problemSchema)

exports.module = Problem