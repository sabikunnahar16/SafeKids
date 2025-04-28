// app/[page]/index.tsx
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

// Import all your pages
import Class from '../../components/pages/class';
import Student from '../../components/pages/student';
import Bus from '../../components/pages/Bus';
import BusEntries from '../../components/pages/busentries';
import SchoolEntries from '../../components/pages/schoolentries';
import Leaves from '../../components/pages/leaves';

// Map route params to component
const pagesMap: { [key: string]: React.ComponentType } = {
  class: Class,
  student: Student,
  bus: Bus,
  busentries: BusEntries,
  schoolentries: SchoolEntries,
  leaves: Leaves,
};

export default function DynamicPage() {
  const { page } = useLocalSearchParams();

  const PageComponent = pagesMap[page as string];

  if (!PageComponent) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>404 - Page Not Found</Text>
      </View>
    );
  }

  return <PageComponent />;
}
