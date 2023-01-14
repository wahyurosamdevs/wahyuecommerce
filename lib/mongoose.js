import mongoose from "mongoose";

export async function initMongoose(){

  const dotenv = require('dotenv');
  dotenv.config();
  mongoose.set('strictQuery', false);

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }
  const db = process.env.MONGOURI;

  return await mongoose.connect(`${db}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });;
}