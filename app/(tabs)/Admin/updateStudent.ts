import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../../constants/FirebaseConfig";

/**
 * Update an existing student in Firestore by document id.
 * @param docId Firestore document id of the student
 * @param studentData Object containing the fields to update
 * @returns Promise<void>
 */
export async function updateStudent(docId: string, studentData: any): Promise<void> {
  if (!docId) throw new Error("No Firestore document id provided for update.");
  const studentRef = doc(firestore, "students", docId);
  await updateDoc(studentRef, {
    ...studentData,
    updatedAt: new Date(),
  });
}
