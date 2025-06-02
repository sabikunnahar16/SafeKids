// ...existing code...
// Class 1 students page
import StudentPage from './class';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../../constants/FirebaseConfig";
export default function Class1() { return <StudentPage selectedClass="1" />; }
// ...existing code...
