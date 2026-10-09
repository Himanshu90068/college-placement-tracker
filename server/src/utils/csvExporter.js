import Papa from 'papaparse';

export function studentsToCsv(students) {
  const rows = students.map((s) => ({
    name: s.name,
    rollNo: s.rollNo,
    department: s.department,
    cgpa: s.cgpa,
    resumeScore: s.resumeScore,
    topAptitudePercentile: s.aptitudeTests?.length ? Math.max(...s.aptitudeTests.map((t) => t.percentile)) : 0,
    interviewRating: s.interviewReadiness?.rating || 0,
    overallReadiness: s.overallReadiness
  }));
  return Papa.unparse(rows);
}
