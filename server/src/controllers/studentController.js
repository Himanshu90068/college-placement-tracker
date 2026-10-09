import Student from '../models/Student.js';
import fs from 'fs';
import path from 'path';
import { scoreResume, suggestionsFor } from '../utils/resumeScorer.js';

export async function upsertProfile(req, res) {
  try {
    const { name, rollNo, department, cgpa, certifications, interviewReadiness, goals } = req.body;

    const parsed = {
      name,
      rollNo,
      department,
      cgpa,
    };

    if (Array.isArray(certifications)) parsed.certifications = certifications;
    if (interviewReadiness) parsed.interviewReadiness = interviewReadiness;
    if (Array.isArray(goals)) parsed.goals = goals;

    const student = await Student.findOneAndUpdate(
      { rollNo },
      { $set: parsed },
      { upsert: true, new: true }
    );

    res.json(student);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function getStudent(req, res) {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const data = student.toObject({ virtuals: true });
    data.resumeSuggestions = suggestionsFor(student.resumeScore || 0);
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function addAptitudeScore(req, res) {
  try {
    const { id } = req.params;
    const { score, percentile, date } = req.body;
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.aptitudeTests.push({ score, percentile, date: date ? new Date(date) : undefined });
    await student.save();
    res.json(student);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function uploadResume(req, res) {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const filePath = req.file.path;
    const buffer = fs.readFileSync(filePath);
    const score = scoreResume(buffer, req.file.originalname);

    student.resumeUrl = `/uploads/${path.basename(filePath)}`;
    student.resumeScore = score;
    await student.save();

    res.json({ resumeUrl: student.resumeUrl, resumeScore: score, suggestions: suggestionsFor(score) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
