import mongoose from "mongoose";

interface JobApplicationType {
  job: mongoose.Schema.Types.ObjectId;
  freelancer: mongoose.Schema.Types.ObjectId;
  status: "open" | "closed" | "accepted" | "rejected";
  createdAt?: Date;
}

const jobApplicationSchema = new mongoose.Schema<JobApplicationType>({
  status: {
    type: String,
    enum: ["open", "closed", "accepted", "rejected"],
    default: "open",
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Freelancer",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<JobApplicationType>(
  "JobApplication",
  jobApplicationSchema
);
