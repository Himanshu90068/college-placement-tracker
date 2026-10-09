import Student from '../models/Student.js';
import { studentsToCsv } from '../utils/csvExporter.js';

export async function listStudents(req, res) {
  try {
    const { department, readiness } = req.query; // readiness: good|average|needs
    const filter = {};
    if (department) filter.department = department;

    const docs = await Student.find(filter);
    const withVirtuals = docs.map((d) => d.toObject({ virtuals: true }));

    let results = withVirtuals;
    if (readiness) {
      results = withVirtuals.filter((s) => {
        const r = s.overallReadiness || 0;
        if (readiness === 'good') return r >= 75;
        if (readiness === 'average') return r >= 50 && r < 75;
        if (readiness === 'needs') return r < 50;
        return true;
      });
    }

    res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function exportCsv(req, res) {
  try {
    const docs = await Student.find({});
    const withVirtuals = docs.map((d) => d.toObject({ virtuals: true }));
    const csv = studentsToCsv(withVirtuals);
    res.header('Content-Type', 'text/csv');
    res.attachment('students_summary.csv');
    res.send(csv);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
