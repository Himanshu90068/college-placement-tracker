import mongoose from 'mongoose';

const AptitudeSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  score: { type: Number, required: true },
  percentile: { type: Number, required: true }
});

const CertificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  provider: String,
  link: String,
  verified: { type: Boolean, default: false }
});

const InterviewReadinessSchema = new mongoose.Schema({
  rating: { type: Number, default: 0 }, // 0-5
  checklist: {
    communication: { type: Boolean, default: false },
    technical: { type: Boolean, default: false },
    hr: { type: Boolean, default: false },
    problemSolving: { type: Boolean, default: false }
  }
});

const GoalSchema = new mongoose.Schema({
  title: String,
  targetDate: Date,
  completed: { type: Boolean, default: false }
});

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    cgpa: { type: Number, required: true },

    resumeUrl: String,
    resumeScore: { type: Number, default: 0 },

    aptitudeTests: [AptitudeSchema],
    certifications: [CertificationSchema],
    interviewReadiness: { type: InterviewReadinessSchema, default: () => ({}) },

    recommendations: [String],
    goals: [GoalSchema]
  },
  { timestamps: true }
);

StudentSchema.virtual('overallReadiness').get(function () {
  const resume = this.resumeScore || 0;
  const aptitude = this.aptitudeTests.length
    ? Math.max(...this.aptitudeTests.map((t) => t.percentile))
    : 0;
  const interview = this.interviewReadiness?.rating ? (this.interviewReadiness.rating / 5) * 100 : 0;
  const cgpaScaled = Math.min(10, this.cgpa) * 10; // scale 0-100
  // weighted average
  const score = 0.35 * resume + 0.3 * aptitude + 0.2 * interview + 0.15 * cgpaScaled;
  return Math.round(score);
});

export default mongoose.model('Student', StudentSchema);
