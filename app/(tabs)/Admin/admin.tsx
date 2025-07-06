// i give you a dashboard format and you give me a wonderful dashboard like this picture but the sideber menue will be same as my code .you update my code and add pie chart,graph,histograph also fetching the database users


import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image, ScrollView, Dimensions } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { BarChart, PieChart, LineChart } from "react-native-chart-kit";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../constants/FirebaseConfig";

interface MenuItem {
  name: string;
  route: string;
  icon: any;
}

const menuItems: MenuItem[] = [
  { name: "Class", route: "/(tabs)/Admin/class", icon: require("@/assets/icons/class1.png") },
  { name: "Student", route: "/(tabs)/Admin/StudentForm", icon: require("@/assets/icons/class.png") },
  { name: "Bus", route: "/(tabs)/Admin/Bus", icon: require("@/assets/icons/buss.png") },
  { name: "Bus Entries", route: "/(tabs)/Admin/busentries", icon: require("@/assets/icons/bus.jpg") },
  { name: "School Entries", route: "/(tabs)/Admin/SchoolEntries", icon: require("@/assets/icons/school.png") },
  { name: "Leaves", route: "/(tabs)/Admin/LeaveAdmin", icon: require("@/assets/icons/home.png") },
  { name: "All Notifications", route: "/(tabs)/Admin/AllNotifications", icon: require("@/assets/icons/bell.png") },
  { name: "Logout", route: "/logout", icon: require("@/assets/icons/logout.png") },
];

const SIDEBAR_WIDTH = 60;
const SIDEBAR_EXPANDED_WIDTH = 142;

export default function AdminSidebarAndDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? SIDEBAR_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  // User stats state
  const [userStats, setUserStats] = useState([
    { label: "Parents", count: 0, color: "#3B82F6" },
    { label: "Students", count: 0, color: "#10B981" },
    { label: "Bus Drivers", count: 0, color: "#F59E42" },
    { label: "School Authority", count: 0, color: "#F43F5E" },
  ]);
  const [lineData, setLineData] = useState([100, 200, 150, 300, 250, 400, 350, 500, 450, 600, 550, 700]); // Example

  // Fetch user stats from Firestore
  useEffect(() => {
    async function fetchStats() {
      // Example: fetch students, parents, bus drivers, school authority
      const studentsSnap = await getDocs(collection(firestore, "students"));
      const parentsSnap = await getDocs(collection(firestore, "parents"));
      const driversSnap = await getDocs(collection(firestore, "busDrivers"));
      const authoritySnap = await getDocs(collection(firestore, "schoolAuthority"));
      setUserStats([
        { label: "Parents", count: parentsSnap.size, color: "#3B82F6" },
        { label: "Students", count: studentsSnap.size, color: "#10B981" },
        { label: "Bus Drivers", count: driversSnap.size, color: "#F59E42" },
        { label: "School Authority", count: authoritySnap.size, color: "#F43F5E" },
      ]);
      // Example: set line data as monthly student registrations (replace with real data)
      // setLineData([...]);
    }
    fetchStats();
  }, []);

  return (
    <View style={{ flex: 1, flexDirection: "row", backgroundColor: "#F1F5F9" }}>
      {/* Sidebar */}
      <View style={[styles.sidebar, { width: sidebarWidth }]}> 
        <View style={styles.logoContainer}>
          <Image source={require("@/assets/images/logo.jpg")} style={styles.logo} />
          {!collapsed && <Text style={styles.logoText}>SafeKids</Text>}
        </View>
        <Pressable style={styles.collapseButton} onPress={() => setCollapsed(!collapsed)}>
          <Text style={styles.collapseText}>{collapsed ? "➔" : "⇦"}</Text>
        </Pressable>
        <View style={styles.divider} />
        <View style={styles.menuList}>
          {menuItems.map((item, index) => {
            const isActive = pathname === item.route;
            return (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.menuItem,
                  (pressed || isActive) && styles.menuItemActive,
                  collapsed && styles.menuItemCollapsed,
                  { alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'row' }, // force left alignment
                ]}
                onPress={() => router.push(item.route as any)}
              >
                <View style={[styles.menuItemContent, { justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }]}> 
                  <Image
                    source={item.icon}
                    style={[styles.icon, collapsed && styles.iconCollapsed]}
                  />
                  {!collapsed && (
                    <Text style={[styles.menuText, isActive && styles.menuTextActive]}>
                      {item.name}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
      {/* Dashboard Area */}
      <ScrollView contentContainerStyle={[styles.dashboard, { marginLeft: sidebarWidth }]}> 
        <Text style={styles.title}>Admin Dashboard</Text>
        <View style={styles.cardsRow}>
          {userStats.map((item, idx) => (
            <View key={item.label} style={[styles.card, { backgroundColor: item.color }]}> 
              <Text style={styles.cardCount}>{item.count}</Text>
              <Text style={styles.cardLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
        {/* Charts Grid - horizontal scroll for full visibility */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', minWidth: Dimensions.get('window').width - sidebarWidth, paddingRight: 24 }}>
            {/* Bar Chart */}
            <View style={[styles.chartBox, { width: 320, marginRight: 18 }]}> 
              <Text style={styles.chartTitle}>User Bar Chart</Text>
              <Text style={styles.chartSubtitle}>A bar chart provides a way of showing data values represented as vertical bars.</Text>
              <BarChart
                data={{
                  labels: userStats.map(u => u.label),
                  datasets: [{ data: userStats.map(u => u.count) }],
                }}
                width={300}
                height={200}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: { r: '6', strokeWidth: '2', stroke: '#3B82F6' },
                }}
                style={{ borderRadius: 16 }}
                fromZero
              />
            </View>
            {/* Pie Chart */}
            <View style={[styles.chartBox, { width: 320, marginRight: 18 }]}> 
              <Text style={styles.chartTitle}>User Pie Chart</Text>
              <Text style={styles.chartSubtitle}>Pie charts are excellent at showing the relational proportions between data.</Text>
              <PieChart
                data={userStats.map(u => ({
                  name: u.label,
                  population: u.count,
                  color: u.color,
                  legendFontColor: '#334155',
                  legendFontSize: 14,
                }))}
                width={300}
                height={200}
                chartConfig={{
                  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                }}
                accessor={'population'}
                backgroundColor={'transparent'}
                paddingLeft={'15'}
                absolute
              />
            </View>
            {/* Line Chart */}
            <View style={[styles.chartBox, { width: 340 }]}> 
              <Text style={styles.chartTitle}>User Growth (Line)</Text>
              <Text style={styles.chartSubtitle}>A line chart is a way of plotting data points on a line.</Text>
              <LineChart
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                  datasets: [
                    {
                      data: lineData,
                      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                    },
                  ],
                }}
                width={320}
                height={200}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
                  style: { borderRadius: 10 },
                  propsForDots: { r: '6', strokeWidth: '2', stroke: '#3B82F6' },
                }}
                style={{ borderRadius: 10 }}
                fromZero
              />
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: "#111827",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 10,
    borderRightWidth: 1,
    borderRightColor: "#222b3a",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
    backgroundColor: "#1E293B",
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 8,
  },
  logoText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  collapseButton: {
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
    backgroundColor: "#1E293B",
  },
  collapseText: {
    fontSize: 18,
    color: "#E5E7EB",
  },
  divider: {
    height: 1,
    backgroundColor: "#222b3a",
    marginVertical: 8,
    marginHorizontal: 10,
  },
  menuList: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    marginHorizontal: 6,
  },
  menuItemCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  menuItemActive: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    marginRight: 12,
  },
  iconCollapsed: {
    marginRight: 0,
    alignSelf: "center",
  },
  menuText: {
    color: "#CBD5E1",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  menuTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  dashboard: {
    flexGrow: 1,
    padding: 24,
    minHeight: "100%",
    backgroundColor: "#F1F5F9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 24,
    textAlign: "left",
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    flexWrap: "wrap",
  },
  card: {
    width: 120,
    height: 80,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  cardCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  cardLabel: {
    fontSize: 14,
    color: "#fff",
    marginTop: 8,
    fontWeight: "600",
  },
  chartsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  chartBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: Dimensions.get("window").width / 2 - 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
    textAlign: "center",
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
    textAlign: 'center',
  },
});
