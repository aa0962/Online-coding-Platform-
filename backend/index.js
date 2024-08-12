const express=require("express")

const {generateFile}=require('./generateFile')

const app=express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/',(req,res)=>{
    return res.json({hello:"world!"})
})

app.post('/run',async(req,res)=>{
    const {language="cpp",code}=req.body;

    if(code=== undefined){
        return res.status(400).json({success:false,error:"Empty code body"})
    }
    

   //need to generate a c++ file content from the request
    const filepath=await generateFile(language,code);
   //we need to run the file and send the response


    return res.json({filepath})
})

app.listen(4000,()=>{
    console.log('Listening on port 4000!');
})