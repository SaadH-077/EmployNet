import mongoose from "mongoose";


const teamsSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manager",
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
        },
    ],
});

const Team = mongoose.model("Teams", teamsSchema);
export default Team;