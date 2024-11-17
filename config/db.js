import mongoose from "mongoose";



export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://homemade:39796868@cluster0.55vcn.mongodb.net/HomeMade').then(()=>console.log("DB Connected"));
}