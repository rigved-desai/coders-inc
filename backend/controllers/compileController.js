const fileHandlers = require('../filehandlers/fileHandlers')

exports.executeCode = async (req, res, next) => {
    const {language, code, input} = req.body;
    
    if(language != 'c++' && language !='java' && language != 'py') {
        return res.status(404).json({
            status: "fail",
            error: "invalid language"
        })
    }

    const result = fileHandlers.saveFile(language, code,input)
    if(result == undefined) {
        return res.status(404).json({
            status: "fail",
            error: "failed while saving file"
        })
    }
    if(language == 'java') {
        console.log(result.filePath)
        fileHandlers.editJavaFile(result.filePath)
        return res.status(404).json({
            status: "fail"
        })
    }
    await fileHandlers.compileFile(language, result.filePath, res) 
        .then((exePath) => {
            fileHandlers.executeFile(exePath, language, result.inputPath)
                .then((output) => {
                    const files = [exePath, result.inputPath, result.filePath]
                    fileHandlers.deleteFiles(files)
                    return res.status(200).json({
                        status: "success",
                        result: output
                    })
                })
                .catch((message) => {
                    return res.status(200).json({
                        status: "success",
                        result: message
                    })
                })
        })
        .catch((message) => {
            // console.log(message)
            return res.status(200).json({
                status: "success",
                error: "compilation error",
                message: message 
            })
        })
}
    
