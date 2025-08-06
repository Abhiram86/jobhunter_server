import mongoose from "mongoose";

interface GigType {
  freelancer: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: number;
  skills: string[];
  status: "active" | "paused";
  createdAt?: Date;
  updatedAt?: Date;
}

const gigSchema = new mongoose.Schema<GigType>({
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Freelancer",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  deliveryTime: {
    type: Number,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "paused"],
    default: "active",
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

export default mongoose.model<GigType>("Gig", gigSchema);
