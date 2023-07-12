const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');

exports.saveFile = (language, code, input) => {

    const path = '.\\codes\\'

    if(!fs.existsSync(path)) {
        fs.mkdir(path, { recursive: true }, (e) => {
        if (e) {
            console.error('Error creating directory:', e);
            return null
        }
        console.log('Directory created successfully.');
        });
    }
    let filePath = path + uuidv4()
    let inputPath = path + uuidv4() + '.txt'
    let newClassName
    if(language == 'c++') {
        filePath += '.cpp'
    }
    else if(language == 'py') {
        filePath += '.py'
    }
    else if(language == 'java') {
        filePath += '.java'
    }
    try {
        fs.writeFileSync(filePath, code)
        fs.writeFileSync(inputPath, input)
        return {filePath, inputPath};
    }
    catch(e) {
        console.log(e.message)
        return null;
    }
}

exports.compileFile = async (language, filePath, res) => {
    if(language == 'py') return filePath

    const exePath = '.\\codes\\' + uuidv4() + '.exe';

    if (language === 'c++') {
        return new Promise((resolve, reject) => {
            exec(`g++ ${filePath} -o ${exePath}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(error.message);
                    reject(error.message);
                } 
                else {
                    resolve(exePath);
                }
            });
        });
    }
    else if(language == 'java') {
        
    }
}

exports.executeFile = async(exePath, language, inputPath) => {
    if(language == 'c++') {
        return new Promise((resolve, reject) => {
            exec(`${exePath} < ${inputPath}`, {timeout: 1000}, (error, stdout, stderr) => {
                if (error) {
                    console.log(error.message);
                    reject(error.message);
                } 
                else {
                    resolve(stdout);
                }
            });
        });
    }
    else if(language == 'py') {
        return new Promise((resolve, reject) => {
            //type input.txt | python your_script.py
            exec(`type ${inputPath} | python ${exePath}`, {timeout: 2000}, (error, stdout, stderr) => {
                if (error) {
                    console.log(error.message);
                    reject(error.message);
                } 
                else {
                    resolve(stdout);
                }
            });
        });
    }
}

exports.deleteFiles = async(files) => {
    try {
        files.forEach(file => fs.unlinkSync(file))
    }
    catch(error) {
        console.log(error.message)
    }
}

exports.editJavaFile = async (filePath)  => {
    let newClassName = '';
    for (let i = filePath.length - 6; i >= 0; i--) {
        if (filePath[i] === '\\') break;
        else newClassName += filePath[i];
    }

    newClassName = newClassName.split('').reverse().join('');
    console.log(newClassName);
    return new Promise((resolve, reject) => {
        exec(
          `(Get-Content -Raw ${filePath}) -replace "(?sm)public\\s+class .+?\\{", "public class ${newClassName} {" | Out-File -Encoding UTF8 ${filePath}`,
          (error, stdout, stderr) => {
            if (error) {
                console.log(error.message)
              reject(error);
            } else {
              resolve();
            }
          }
        );
      });
}