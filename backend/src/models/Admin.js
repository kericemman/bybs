const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "manager"],
      default: "admin",
    },
    permissions: {
      type: [String],
      default: [],
    },
    mustChangePassword: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: Date,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
