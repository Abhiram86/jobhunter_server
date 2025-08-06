import mongoose from "mongoose";

interface BookmarkType {
  target: mongoose.Schema.Types.ObjectId;
  type: "job" | "gig";
  user: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
}

const bookmarkSchema = new mongoose.Schema<BookmarkType>({
  target: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    enum: ["job", "gig"],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Freelancer",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bookmarkSchema.index({ target: 1, type: 1, user: 1 }, { unique: true });

export default mongoose.model<BookmarkType>("Bookmark", bookmarkSchema);
