import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

const classList = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

export default function ClassListPage() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="school" size={32} color="#2563EB" style={{ marginRight: 10 }} />
        <Text style={styles.headerTitle}>Select a Class</Text>
      </View>
      <ScrollView contentContainerStyle={styles.classList} showsVerticalScrollIndicator={false}>
        {classList.map((cls) => (
          <Pressable
            key={cls}
            style={({ pressed }) => [
              styles.classButton,
              pressed && styles.classButtonPressed
            ]}
            onPress={() => router.push(`/(tabs)/Admin/class${cls}` as any)}
          >
            <Text style={styles.classButtonText}>Class {cls}</Text>
            <Ionicons name="chevron-forward" size={22} color="#2563EB" style={{ marginLeft: 8 }} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    padding: 24,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E293B',
    letterSpacing: 1,
  },
  classList: {
    paddingBottom: 40,
  },
  classButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 28,
    marginBottom: 18,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'space-between',
  },
  classButtonPressed: {
    backgroundColor: '#e0e7ff',
    borderColor: '#2563EB',
  },
  classButtonText: {
    fontSize: 20,
    color: '#2563EB',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
