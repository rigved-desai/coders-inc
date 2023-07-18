const fileHandlers = require('../filehandlers/fileHandlers')
const { CODE_COMPILATION_FAILED,
    CODE_TC_FAILED,
    CODE_TC_PASSED,
    CODE_SERVER_ERROR } = require('../config/config')

exports.executeCode = async (req, res, next) => {
    let files
    try {
        const { language, code, input } = req.body;

        if (language != 'c++' && language != 'java' && language != 'py') {

            if (req.body.isSubmission == true) {
                return CODE_SERVER_ERROR;
            }

            return res.status(404).json({
                status: "fail",
                error: "invalid language"
            })
        }

        const result = fileHandlers.saveFile(language, code, input)
        if (result == undefined) {
            if (req.body.isSubmission == true) {
                return CODE_SERVER_ERROR;
            }

            return res.status(404).json({
                status: "fail",
                error: "failed while saving file"
            })
        }
        
        const output = await fileHandlers.executeFile(result.filePath, language, result.inputPath);
        
        files = [result.inputPath, result.filePath]
        fileHandlers.deleteFiles(files);

        if (req.body.isSubmission) {

            if (output.code !== 0) {
                return CODE_COMPILATION_FAILED;
            }
            const userOutput = output.message.replace(/\s/g, '');
            const requiredOutput = req.body.output.replace(/\s/g, '');

            if (userOutput.localeCompare(requiredOutput) === 0) {
                return CODE_TC_PASSED;
            }
            else {
                return CODE_TC_FAILED;
            }
        }
        return res.status(200).json({
            status: "success",
            result: output
        });
    }
    catch (error) {
        console.log(error)
        fileHandlers.deleteFiles(files);
        if (req.body.isSubmission) {
            return CODE_COMPILATION_FAILED;
        }
        return res.status(200).json({
            status: "success",
            error: "compilation error",
            message: error.message
        });
    }
}

