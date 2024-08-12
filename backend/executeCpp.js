// const {exec}=require("child_process");
// const fs=require('fs');
// const path=require('path');
// const { stdout } = require("process");

// const outputPath=path.join(__dirname,"outputs")

// if(!fs.existsSync(outputPath)){
//     fs.mkdirSync(outputPath,{recursive:true})
// }

// const executeCpp =(filepath)=>{
//     return new Promise((resolve,reject)=>{
//         const jobId=path.basename(filepath).split(".")[0];
//         const outPath=path.join(outputPath,`${jobId}.out`);
        
//         return new Promise((resolve,reject)=>{
//             exec(`g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out`,
//                 (error,stdout,stderr)=>{

//                     error && reject({error,stderr});
//                     stderr  &&  reject(stderr)
//                     resolve(stdout)
//                 })
//         })

//     })
// }

// module.exports={
//     executeCpp
// }

const { spawn } = require("child_process");
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath) => {
    return new Promise((resolve, reject) => {
        const jobId = path.basename(filepath).split(".")[0];
        const outPath = path.join(outputPath, `${jobId}.out`);

        const compile = spawn("g++", [filepath, "-o", outPath]);

        compile.on('close', (code) => {
            if (code !== 0) {
                reject(`Compilation failed with code ${code}`);
                return;
            }

            const run = spawn(outPath);

            let output = '';
            run.stdout.on('data', (data) => {
                output += data.toString();
            });

            run.stderr.on('data', (data) => {
                reject(data.toString());
            });

            run.on('close', (code) => {
                if (code !== 0) {
                    reject(`Execution failed with code ${code}`);
                } else {
                    resolve(output);
                }
            });
        });

        compile.stderr.on('data', (data) => {
            reject(data.toString());
        });
    });
}

module.exports = {
    executeCpp
}
