const {Schema, model} = require("mongoose");

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            trim: true,
            required: [true, "Username is required."]
        },
        email: {
            type: String,
            unique: true,
            trim: true, 
            required: [true, "Email is required."],
            lowercase: true
        },
        passwordHash: {
            type: String,
            required: [true, "Password is required."]
        }
    },
    {
        timestamps: true,
    }
);

module.exports = model("User", userSchema);