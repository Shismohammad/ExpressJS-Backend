import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const mongoConnection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `MongoDB Database Connected ! \nDB Host : ${mongoConnection.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB Database connection error !\n", error);
    process.exit(1);
  }
};

export default connectDB;
