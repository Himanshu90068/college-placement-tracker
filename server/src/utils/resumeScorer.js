// Simple placeholder resume scoring logic.
// In production, integrate a proper parser & NLP logic.
export function scoreResume(buffer, originalName = '') {
  const sizeFactor = Math.min(1, buffer?.length ? buffer.length / (200 * 1024) : 0); // up to 200KB
  const nameBonus = /resume|cv|profile/i.test(originalName) ? 10 : 0;
  const base = 50 + Math.round(sizeFactor * 40) + nameBonus; // 50-100
  return Math.max(0, Math.min(100, base));
}

export function suggestionsFor(score) {
  const notes = [];
  if (score < 70) {
    notes.push('Add clear sections: Summary, Skills, Experience, Projects, Education.');
    notes.push('Quantify achievements with metrics (e.g., reduced time by 20%).');
    notes.push('Fit resume into 1 page with concise bullet points.');
  } else if (score < 85) {
    notes.push('Fine-tune keywords for ATS (technologies, role-specific terms).');
    notes.push('Ensure consistent formatting and alignment.');
  } else {
    notes.push('Great job! Consider tailoring to specific roles for maximum impact.');
  }
  return notes;
}
