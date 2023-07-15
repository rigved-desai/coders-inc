const fileHandlers = require('../filehandlers/fileHandlers')
const {CODE_COMPILATION_FAILED,
    CODE_TC_FAILED,
    CODE_TC_PASSED, CODE_SERVER_ERROR} = require('../config/config')

exports.executeCode = async (req, res, next) => {
    let files
    try {
    const {language, code, input} = req.body;
    
    if(language != 'c++' && language !='java' && language != 'py') {
        
        if(req.body.isSubmission == true) {
            return CODE_SERVER_ERROR;
        }

        return res.status(404).json({
            status: "fail",
            error: "invalid language"
        })
    }
    
    const result = fileHandlers.saveFile(language, code,input)
    if(result == undefined) {
        if(req.body.isSubmission == true) {
            return CODE_SERVER_ERROR;
        }

        return res.status(404).json({
            status: "fail",
            error: "failed while saving file"
        })
    }
    files = [result.inputPath, result.filePath]
    const exePath = await fileHandlers.compileFile(language, result.filePath, res);
    const output = await fileHandlers.executeFile(exePath, language, result.inputPath);
    files = [exePath, result.inputPath, result.filePath]

        if (req.body.isSubmission) {
            const userOutput = output.replace(/\s/g, '');
            const requiredOutput = req.body.output.replace(/\s/g, '');
            console.log(userOutput)
            console.log(requiredOutput)
            if (userOutput.localeCompare(requiredOutput) === 0) {
              fileHandlers.deleteFiles(files);
              return CODE_TC_PASSED;
            } 
            else {
              fileHandlers.deleteFiles(files);
                return CODE_TC_FAILED;
            }
          }
          fileHandlers.deleteFiles(files);
        return res.status(200).json({
            status: "success",
            result: output
        });
    }
    catch(error) {
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
    
