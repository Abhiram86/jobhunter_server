import mongoose from "mongoose";

interface GigPurchaseType {
  gig: mongoose.Schema.Types.ObjectId;
  client: mongoose.Schema.Types.ObjectId;
  status: "pending" | "in_progress" | "delivered" | "completed" | "cancelled";
  delivery?: string;
  createdAt?: Date;
}

const gigPurchaseSchema = new mongoose.Schema<GigPurchaseType>({
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gig",
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "in_progress", "delivered", "completed", "cancelled"],
    default: "pending",
  },
  delivery: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<GigPurchaseType>(
  "GigPurchase",
  gigPurchaseSchema
);
