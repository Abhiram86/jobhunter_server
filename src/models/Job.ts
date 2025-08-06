import mongoose from "mongoose";

interface JobType {
  client: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  status: "open" | "closed";
  freelancer?: mongoose.Schema.Types.ObjectId;
  skills: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const jobSchema = new mongoose.Schema<JobType>({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Freelancer",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  skills: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<JobType>("Job", jobSchema);
