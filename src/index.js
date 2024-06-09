// require('dotenv').config({ path: './env' })
// OR
import dotenv from 'dotenv';
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from 'express';
import connectDB from "./db/index.js";
import { app } from './app.js'

dotenv.config(
    {
        path: './env'
    }
)


connectDB()     //connecting database in different file
    .then(() => {
        app.on("error", (error) => {
            console.log("error", error)
            throw error
        })
        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running at : ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("MongoDB connnection failed : ", err)
    })




// ---------- Another way of connecting database -----------------
// const app = express()
// -------------------- effy to call function inplace
// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
//         // If database connect but express unable to talk

//         app.on("error", (error) => {
//             console.log("error", error)
//             throw error
//         })

//         // If app is listenging to database

//         app.listen(process.env.DB_NAME, () => {
//             console.log(`app is listening on port ${process.env.PORT}`)
//         })

//     } catch (error) {
//         console.log("error:", error)
//         throw err
//     }
// })()