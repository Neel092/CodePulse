import mongoose, { Schema, trusted } from "mongoose";

const progressSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        problemId: {
            type: String,
            required: true,
        },

        platform: {
            type: String,
            enum: ["leetcode", "codeforces", "gfg"],
            required: true,
        },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true,
        },

        status: {
            type: String,
            enum: ["unsolved", "attempted", "solved"],
            default: "unsolved",
        },

        solvedAt: {
            type: Date,
        },

        notes: {
            type: String,
        },
    },
    {
        timestamps: true
    }
);

progressSchema.index({ userId: 1, problemId: 1, platform: 1 }, { unique: true });
progressSchema.index({ userId: 1, status: 1 });
progressSchema.index({ userId: 1, platform: 1 });
progressSchema.index({ userId: 1, createdAt: -1 });

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;