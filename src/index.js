// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import express from "express";
dotenv.config({ path: "./env" });

const app = express();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log(`Server started at port : ${process.env.PORT || 3001}`);
    });
  })
  .catch((error) => {
    console.log("Error in index connection db failed !");
  });

// import mongoose from "mongoose";
// const app = express()(async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("Error :" ,error);
//       throw error
//     });
//     app.listen(process.env.PORT,()=>{
//         console.log(`app is listening on port ${process.env.PORT }`);
//     })
//   } catch (error) {
//     console.error("Error : ", error);
//     throw err;
//   }
// })();
