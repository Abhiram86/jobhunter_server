import mongoose from "mongoose";

interface ExperienceType {
  company: string;
  jobType: string;
  type: "full-time" | "part-time" | "contract" | "internship" | "permanent";
  startDate: Date;
  endDate: Date;
}

interface ProjectType {
  title: string;
  description?: string;
  technologies: string[];
  link?: string;
}

interface SocialType {
  name: string;
  link: string;
}

export interface Freelancer {
  user: mongoose.Schema.Types.ObjectId;
  bio?: string;
  rating?: number;
  experience?: ExperienceType[];
  skills: string[];
  availability?: boolean;
  projects?: ProjectType[];
  socials?: SocialType[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Client {
  user: mongoose.Schema.Types.ObjectId;
  company?: string;
  about?: string;
  totalSpent: number;
  avgRatingGiven: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const freelancerSchema = new mongoose.Schema<Freelancer>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bio: {
    type: String,
  },
  rating: {
    type: Number,
  },
  experience: [
    {
      company: {
        type: String,
      },
      position: {
        type: String,
      },
      type: {
        type: String,
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
    },
  ],
  skills: [
    {
      type: String,
    },
  ],
  availability: {
    type: Boolean,
  },
  projects: [
    {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      technologies: [
        {
          type: String,
        },
      ],
      link: {
        type: String,
      },
    },
  ],
  socials: [
    {
      name: {
        type: String,
      },
      link: {
        type: String,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const clientSchema = new mongoose.Schema<Client>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  company: {
    type: String,
    default: "N/A",
  },
  about: {
    type: String,
  },
  totalSpent: {
    type: Number,
  },
  avgRatingGiven: {
    type: Number,
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

export const Freelancer = mongoose.model<Freelancer>(
  "Freelancer",
  freelancerSchema
);
export const Client = mongoose.model<Client>("Client", clientSchema);
