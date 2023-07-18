const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const Docker = require('dockerode')
const tar = require('tar-stream')
const docker = Docker() 

const createContainer = (language) => {
    let containerOptions
    if(language == 'c++') {
        containerOptions = {
            Image: 'gcc:latest', 
            Tty: true,
            Cmd:  ['sh', '-c', 'g++ -o ./app/output ./app/exeFile.cpp && ./app/output < ./app/inputFile.txt']
        }
    }
    else if(language == 'py') {
        containerOptions = {
            Image: 'python:latest', 
            Tty: true,
            Cmd: ['sh', '-c', `python ./app/exeFile.py < ./app/inputFile.txt`]
        }
    }
    else if(language == 'java') {
        containerOptions = {
            Image: 'amazoncorretto:17', 
            Tty: true,
            Cmd: ['sh', '-c', 'java ./app/exeFile.java < ./app/inputFile.txt']
        }
    }
    else return null;
    return new Promise((resolve, reject) => {
        docker.createContainer(containerOptions, (err, container) => {
            if(err) {
                console.log(err.message)
                reject(err.message)
            }
            else resolve(container)
        })
    })
}


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
        fs.writeFileSync(filePath, code);
        fs.writeFileSync(inputPath, input);
        return {filePath, inputPath};
    }
    catch(e) {
        console.log(e.message)
        return null;
    }
}

exports.executeFile = async(exePath, language, inputPath) => {

    try {
        const container = await createContainer(language)


        const folderName = 'app';
        let exeFileName
        if(language == 'c++') {
            exeFileName = 'exeFile.cpp'
        }
        else if(language == 'py') {
            exeFileName = 'exeFile.py'
        }
        else if(language == 'java') {
            exeFileName = 'exeFile.java'
        }
        else {
            return null;
        }
        const exeContent = fs.readFileSync(exePath);
        const inputContent = fs.readFileSync(inputPath)

        const pack = tar.pack();
        pack.entry({ name: `${folderName}/${exeFileName}` }, exeContent);
        pack.entry({ name: `${folderName}/inputFile.txt` }, inputContent);
        pack.finalize();

        container.putArchive(pack, { path: "/" })

        await container.start()
        const { StatusCode } = await container.wait();

        return new Promise((resolve, reject) => {
            container.logs({stdout: true},  (err, stream) => {
                if(err) {
                    console.log(err.message)
                    reject({
                        message: err.message,
                        code: StatusCode
                    });
                }
                if(!Buffer.isBuffer(stream)) {
                    container.remove()
                    resolve({
                        message: stream.toString(),
                        code: StatusCode})
                }
                else {
                    container.remove()
                    resolve({
                        message: Buffer.from(stream).toString(),
                        code: StatusCode})
                }
            })
        })

    }
    catch(error) {
        console.log(error.message)
        return({
            message: error.message,
            code: -1
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
