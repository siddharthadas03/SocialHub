import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is missing from the server environment");
    }

    await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: "majority",
    });

    console.log("✅ MongoDB connected successfully");
    console.log(`Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
