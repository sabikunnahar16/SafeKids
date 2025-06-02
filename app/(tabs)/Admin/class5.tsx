// ...existing code...
// Class 5 students page
import StudentPage from './class';
export default function Class5() { return <StudentPage selectedClass="5" />; }

interface StudentPageProps {
  selectedClass: string;
}

function StudentPage({ selectedClass }: StudentPageProps) {
  // ...existing code...
  return <div>Class {selectedClass} students page</div>;
}
// ...existing code...
