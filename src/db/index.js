import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        // console.log(`Connection URI : ${process.env.MONGODB_URI}/${DB_NAME}`);

        const mongoConnection = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );

        console.log(
            `Connection to MongoDB Database is Successful !\nDB Host : ${mongoConnection.connection.host}`
        );
    } catch (error) {
        console.log("Connection to MongoDB Database is Failure !\n", error);
        process.exit(1);
    }
};

export default connectDB;
