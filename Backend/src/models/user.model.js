import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

const userSchema = new Schema(

    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        password:
        {
            type: String,
            required: [true, "password is required"],
            minlength: 8,
        },
        refreshToken: {
            type: String,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        displayName: String,
        graduationYear: String,
        location: String,
        college: String,
        degree: String,
        branch: String,
        profileDetails: String,
        platforms: {
            github: String,
            leetcode: String,
            codechef: String,
            codeforces: String,
            hackerrank: String,
            interviewbit: String,
            geeksforgeeks: String,
            atcoder: String,
            codestudio: String,
        },
        visibility: {
            type: String,
            enum: ["public", "private"],
            default: "public"
        },
        syncMetadata: {
            leetcode: {
                totalSolved: Number,
                easySolved: Number,
                mediumSolved: Number,
                hardSolved: Number,
                streak: Number,
                totalActiveDays: Number,
                submissionCalendar: String
            },
            codeforces: {
                rating: Number,
                maxRating: Number,
                rank: String,
                maxRank: String,
                ratingHistory: [Schema.Types.Mixed],
                submissionCalendar: String
            },
            codechef: {
                rating: Number,
                maxRating: Number,
                stars: String,
                totalSolved: Number,
                submissionCalendar: String
            }
        }
    },
    {
        timestamps: true,
    }
);

// jo bhi data save ho usse phle 
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);


});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        return ret;
    }
});

const User = mongoose.model("User", userSchema);

export default User;
