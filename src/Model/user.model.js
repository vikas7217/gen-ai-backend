import mongoose from "mongoose";
import bycrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "email must be unique"],
    },
    password: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
      default: "normal",
    },
    isActive: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

// hashing ths password

userSchema.pre("save", async function () {
  try {
    if (!this.isModified("password")) return;

    const addSalt = await bycrypt.genSalt(11);
    this.password = await bycrypt.hash(this.password, addSalt);
  } catch (error) {
    throw new Error(`Error while hashing the password: ${error.message}`);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
