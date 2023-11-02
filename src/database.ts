import mongoose from "mongoose";

mongoose.set("strictQuery", true);
mongoose.set("strictPopulate", false);

export async function connect() {
  try {
    const connection = await mongoose.connect(
      "mongodb+srv://luiz-h:1234@cluster0.vhj8rge.mongodb.net/socket-forum?retryWrites=true&w=majority"
    );
    console.log("connected to MongoDB");
    return connection;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}
