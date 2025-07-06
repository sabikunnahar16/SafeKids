import { Stack } from 'expo-router';

export default function SchoolAuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="SchoolAuth"
        options={{
          title: 'School Authority',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Recordscan"
        options={{
          title: 'School Scanner',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
