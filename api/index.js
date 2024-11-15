const express = require("express")
const app = express()
const mongoose = require("mongoose")
const { z } = require("zod")
const bycrpt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const {ObjectId} = require('mongodb')

const { UserModel , TaskModel } = require("./databases")
const { auth , JWT_SECRET } = require("./auth")

const crypto = require("crypto")
require("dotenv").config({path: "./plaintext.env"});

mongoose.connect(process.env.MONGO_URI)

app.use(express.json())
app.use(cors())
app.use(express.static('public'))

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post("/verification", async function(req,res){
    const requireBody = z.object({
        email: z.string().min(10).max(50).email(),
    });

    try{
        const email = req.body.email;
        requireBody.parse({
            email: email
        });

        const otp = Math.floor(Math.random()*1000000)

        const response = await UserModel.findOne({ email : email });

        if(response){
            return res.json({
                message: "User Already Exist"
            })
        }else{
            const mailOptions = {
                from: 'castsnippets76@gmail.com',
                to: email,
                subject: 'Email Verification',
                text: `Please verify your email by entering your OTP: ${otp}`,
            };

            await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending email: ', error);
                    return res.status(500).json({ message: 'Error sending OTP' });
                }
                console.log('Email sent: ' + info.response);
            });

            function hashotp(message){
                return crypto.createHash("sha256").update(message).digest("hex")
            }
        
            res.json({ 
                message: 'Otp has been sent to your email',
                otp: hashotp(otp.toString())
             });
        }

    }
    catch(error){
        if(error instanceof z.ZodError){
            const issues = error.issues.map((issues) => issues.message);
            return res.json({message: issues})
        }else{
            console.log("Unexpected error:", error);
            return res.status(500).json({message: "An unexpected error occured"})
        }
    }
})

app.post("/otp",function(req,res){
    const requiredBody = z.object({
        otp: z.string().max(6)
    })

    try{
        const otp = req.body.otp
        const hashedOtp = req.body.hashedOtp
        requiredBody.parse({
            otp: otp
        })

        function hashotp(message){
            return crypto.createHash("sha256").update(message).digest("hex")
        }

        if(hashotp(otp) !== hashedOtp){
            res.json({
                message: "Wrong OTP"
            })
        }
        else{
            res.json({
                message: "Create Your Password"
            })
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            const issues = error.issues.map((issue) => issue.message);
            return res.json({ message: issues });
        } else {
            console.log('Unexpected error:', error);
            return res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
})

app.post("/signUp", async function(req,res){
    const requireBody = z.object({
        password: z.string().regex(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/),
        name: z.string().min(1).max(100)
    })

    try{
        const password = req.body.password
        const email = req.body.email
        const name = req.body.name

        requireBody.parse({
            password: password,
            name: name
        })
        try{
            const hashedPassword = await bycrpt.hash(password,5)
            await UserModel.create({
                email: email,
                password: hashedPassword,
                name: name
            })

            res.json({
                message: "Your account has been created"
            })
        }
        catch(e){
            res.json({
                message: "User Already Exist"
            })
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            const issues = error.issues.map((issue) => issue.message); 
            return res.json({ message: issues });
        } else {
            console.log('Unexpected error:', error);
            return res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
})

app.post("/signIn",async function(req,res){
    const requireBody = z.object({
        password:z.string().regex(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/),
        email: z.string().min(10).max(100).email()
    })

    try{
        const email = req.body.email
        const password = req.body.password

        requireBody.parse({
            email: email,
            password: password
        })

        const response = await UserModel.findOne({
            email: email
        })

        if(!response){
            res.json({
                message: "User Dose Not Exist"
            })
        }
        else{
            const passwordMatch = await bycrpt.compare(password , response.password);

            if(passwordMatch){
                const token = jwt.sign({
                    userId: response._id
                },JWT_SECRET)
                res.json({
                    token: token,
                    message:"Sign In Successful",
                    detail: response
                })
            }
            else{
                res.json({
                    message: "Incorrect credentials?"
                })
            }
        }
    }
    catch(error){
        if (error instanceof z.ZodError) {
            const issues = error.issues.map((issue) => issue.message);
            return res.json({ message: issues });
        } else {
            console.log('Unexpected error:', error);
            return res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
})

app.post("/addTasks", auth , async function(req,res){
    const userId = req.userId
    const tasks = req.body.task
    const response = await TaskModel.create({
        userId: userId,
        tasks: tasks,
        done: false,
    })
    res.json({
        message: "Task is added"
    })
})
app.get("/readTask", auth, async function(req, res) {
    try {
      const userId = req.userId;
      const response = await TaskModel.find({ userId: userId });
      res.json({
        message: response,
        message1: "readed"
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error fetching tasks',
        error: error.message
      });
    }
  });

app.delete("/deleteTask",auth,async function(req,res){
    const userId = req.userId
    const id = req.body.id
    const response = await TaskModel.deleteOne({
        userId: userId,
        _id: new ObjectId(id)
    })
    if(response){
        res.json({
            message: "Task is deleted"
        })
    }
})

app.put("/doneTask", auth, async function(req, res) {
    const userId = req.userId;
    const id = req.body.id;

    const task = await TaskModel.findOne({ userId: userId, _id: id });
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    const response = await TaskModel.findOneAndUpdate(
        {
            userId: userId,
            _id: id
        },
        {
            $set: { done: !task.done }  
        },
        { new: true }
    );

    res.status(200).json({ message: "Task updated", task: response });
});

app.listen(3000)