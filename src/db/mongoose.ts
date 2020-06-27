import mongoose from "mongoose"

mongoose.connect("mongodb://localhost/pawtastic", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
