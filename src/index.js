import { httpServer, io } from "./app.js";
import dotenv from "dotenv";
import connectDb from "./dbconfig/connect.db.js";

dotenv.config({
  path: "./env",
});

connectDb()
  .then(() => {
    io.on("connection", (socket) => {
      console.log("Client connected");

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
    console.log("done");
    httpServer.listen(process.env.PORT || 8080, () => {
      console.log("Server is rocking at 8080 !!!");
    });
  })
  .catch((err) => {
    console.log(err);
    throw err;
  });
