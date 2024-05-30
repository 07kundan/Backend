// require('dotenv').config({ path: './env' })
// OR
import dotenv from 'dotenv';
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from 'express';
import connectDB from "./db/index.js";


dotenv.config({ path: './env' })
connectDB()

// const app = express()
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