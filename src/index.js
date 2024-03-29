// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({ path: "./env" });

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8001, () => {
            console.log(
                `Server started at port number : ${process.env.PORT || 8000}`
            );
        });
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB Database !");
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
