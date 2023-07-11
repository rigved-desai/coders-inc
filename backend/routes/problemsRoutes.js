const express = require('express')

const router = express.Router()
const protect = require('../middleware/protect.js')
const problemsController = require('../controllers/problemsController')

router
    .route('/')
        .get(protect.allProtect, problemsController.getAllProblems)
        .post(protect.adminProtect, problemsController.addProblem)
    
router
    .route('/:id')
        .get(protect.allProtect, problemsController.getProblemByID)
        .delete(protect.adminProtect, problemsController.deleteProblem)
        .patch(protect.adminProtect, problemsController.updateProblem)

module.exports = router 