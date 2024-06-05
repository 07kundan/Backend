import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        // console.log(connectionInstance)
        console.log(`\n monogoDB connected Db Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("monogoDB connection error", error)
        process.exit(1)
    }
}

export default connectDB