import { io } from "../app";
import { userModel } from "../models/user.model";

userModel.watch().on("change", (change) => {
  if (change.operationType === "update") {
    const updatedIsVerified = change.updateDescription.updatedFields.isVerified;
    io.emit("isVerifiedChanged", updatedIsVerified);
  }
});
