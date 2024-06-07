import mongoose from "mongoose";

export const dbConnection = async () => {
   try {
   await mongoose.connect(process.env.MONGODB_URI)
    console.log('db connection successfull');
   } catch (error) {
    console.log('Error in db connection', error);
   }
}
