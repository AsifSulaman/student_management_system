// GPA scale: each letter grade is worth a number of grade points.
// This is an "object": a list of key: value pairs.
const gradePoints = {
  "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7, "D": 1.0, "F": 0.0
};

// Takes a list of courses and returns the GPA as a number.
// GPA = sum of (grade points x credit hours) / total credit hours
function calculateGPA(courses) {
  let totalPoints = 0;
  let totalCredits = 0;

  for (const course of courses) {
    totalPoints = totalPoints + gradePoints[course.grade] * course.credits;
    totalCredits = totalCredits + course.credits;
  }

  if (totalCredits === 0) {
    return 0; // no courses yet, so avoid dividing by zero
  }
  return totalPoints / totalCredits;
}
