const express =require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const cors=require('cors')
const path = require('path');
const userRoutes=require('./routes/userRoutes')
const fileUpload = require('express-fileupload');


const app=express()
dotenv.config()

app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 } 
}))


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
}));

const PORT=3000

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('DataBase connected sucessfully');
})
.catch((error)=>{
    console.log('error', error);
})

app.use('/api',userRoutes)

// const now = Date.now();
const utc =new Date()

app.listen(PORT,'0.0.0.0',()=>{
    console.log('server is started',utc,PORT);
})