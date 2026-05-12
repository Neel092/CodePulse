import Progress from "../models/progress.model.js";
import User from "../models/user.model.js";

export const upsertProgress = async (req, res) => {

    try {

        const userId = req.user._id;

        const { problemId, platform, difficulty, status, notes } = req.body;

        console.log("USER:", req.user);
        console.log("BODY:", req.body);

        if (!problemId || !platform || !difficulty) {
            return res.status(400).json({ message: "All required fields missing" })
        }

        let progress = await Progress.findOne({ userId, problemId });


        let solvedAt = null;
        if (status === "solved") {
            solvedAt = new Date();
        }

        if (progress) {

            progress.problemId = problemId;
            progress.platform = platform;
            progress.difficulty = difficulty;
            progress.status = status;
            progress.notes = notes;
            progress.solvedAt = solvedAt;

            await progress.save();

            return res.status(200).json({
                message: "Progress Updated",
                progress,
            });

        }


        progress = await Progress.create({
            userId,
            problemId,
            platform,
            difficulty,
            status,
            solvedAt,
            notes,
        });

        return res.status(201).json({
            message: "Progress created",
            progress,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getUserProgress = async (req, res) => {

    try {

        const userId = req.user._id;

        const progress = await Progress.find({ userId }).sort({ createdAt: -1 });


        return res.status(200).json({
            count: progress.length,
            progress,
        });


    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}