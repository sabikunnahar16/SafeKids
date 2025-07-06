import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../../constants/FirebaseConfig';
import { supabase } from '../../../constants/supabaseClient';

type Student = {
  id: string;
  studentName: string;
  studentClass: string;
  idNumber: string;
  parentName: string;
  email: string; // This is the parent's Gmail stored in the student table
  parentContact: string;
  parentAddress: string;
  imageUrl?: string;
};

const ViewChildInfo = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Get logged-in parent email from Firebase Auth
        const auth = getAuth();
        const user = auth.currentUser;
        const parentEmail = user?.email;

        if (!parentEmail) {
          Alert.alert('Error', 'No logged-in parent found.');
          setLoading(false);
          return;
        }

        console.log('🔍 Searching for student with parent email:', parentEmail);

        // Fetch student info from Firestore using parent's Gmail
        const studentsQuery = query(
          collection(firestore, 'students'),
          where('email', '==', parentEmail) // 'email' field contains parent's Gmail
        );

        const studentSnapshot = await getDocs(studentsQuery);

        if (studentSnapshot.empty) {
          console.log('❌ No student found for parent email:', parentEmail);
          Alert.alert('No Child Found', 'No student record found for your account. Please contact the school administration.');
          setStudent(null);
        } else {
          // Get the first student record (assuming one child per parent for now)
          const studentDoc = studentSnapshot.docs[0];
          const studentData = studentDoc.data();
          
          console.log('✅ Student found:', studentData);

          // Try to get the image URL from Supabase storage if imageUrl exists
          let imageUrl = studentData.imageUrl;
          if (studentData.imageUrl) {
            try {
              const { data } = supabase.storage
                .from('student-images')
                .getPublicUrl(studentData.imageUrl);
              imageUrl = data.publicUrl;
              console.log('📸 Student image URL:', imageUrl);
            } catch (imageError) {
              console.log('⚠️ Could not load student image:', imageError);
              imageUrl = null;
            }
          }

          setStudent({
            id: studentDoc.id,
            studentName: studentData.studentName,
            studentClass: studentData.studentClass,
            idNumber: studentData.idNumber,
            parentName: studentData.parentName,
            email: studentData.email,
            parentContact: studentData.parentContact,
            parentAddress: studentData.parentAddress,
            imageUrl: imageUrl
          });
        }
      } catch (err) {
        console.error('❌ Error fetching student data:', err);
        Alert.alert('Error', 'Something went wrong while fetching student information.');
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  if (!student) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>No child information found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Child's Profile</Text>
      <View style={styles.profileContainer}>
        <Image
          source={
            student.imageUrl
              ? { uri: student.imageUrl }
              : require('../../../assets/images/avatar.png')
          }
          style={styles.profileImage}
        />
        <View style={styles.infoRow}>
          <Text style={styles.label}>Student Name:</Text>
          <Text style={styles.value}>{student.studentName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Class:</Text>
          <Text style={styles.value}>{student.studentClass}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Student ID:</Text>
          <Text style={styles.value}>{student.idNumber}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Parent Name:</Text>
          <Text style={styles.value}>{student.parentName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Parent Email:</Text>
          <Text style={styles.value}>{student.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Parent Contact:</Text>
          <Text style={styles.value}>{student.parentContact || 'Not provided'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{student.parentAddress}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7faff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 24,
    textAlign: 'center',
  },
  profileContainer: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  infoRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: 'bold',
    color: '#153370',
    fontSize: 16,
    width: '45%',
  },
  value: {
    color: '#333',
    fontSize: 16,
    width: '55%',
    textAlign: 'right',
  },
});

export default ViewChildInfo;