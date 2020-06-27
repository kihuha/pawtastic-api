import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"

interface IUser extends mongoose.Document {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  phoneAlt: string
  city: string
  created: Date
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      unique: true,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    phoneAlt: String,
    city: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8)
  }

  next()
})

const User = mongoose.model("User", UserSchema)

export default User
