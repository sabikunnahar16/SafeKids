import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { useState } from "react";

interface MenuItem {
  name: string;
  route: string;
  icon: any;
}

const menuItems: MenuItem[] = [
  { name: "Class", route: "/class", icon: require("../assets/icons/class1.png") },
  { name: "Student", route: "/student", icon: require("../assets/icons/clas.png") },
  { name: "Bus", route: "/bus", icon: require("../assets/icons/bus.jpg") },
  { name: "Bus Entries", route: "/busentries", icon: require("../assets/icons/bus.jpg") },
  { name: "School Entries", route: "/schoolentries", icon: require("../assets/icons/school.png") },
  { name: "Leaves", route: "/leaves", icon: require("../assets/icons/home.png") },
  { name: "Logout", route: "/logout", icon: require("../assets/icons/logout.png") },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname(); // current path
  const [collapsed, setCollapsed] = useState(false); // for sidebar collapse

  return (
    <View style={[styles.sidebar, collapsed && styles.sidebarCollapsed]}>
      {/* Collapse Toggle Button */}
      <Pressable style={styles.collapseButton} onPress={() => setCollapsed(!collapsed)}>
        <Text style={styles.collapseText}>{collapsed ? "➔" : "⇦"}</Text>
      </Pressable>

      {menuItems.map((item, index) => {
        const isActive = pathname === item.route;
        return (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.menuItem,
              (pressed || isActive) && styles.menuItemActive,
            ]}
            onPress={() => router.push(item.route as any)}

          >
            <Image source={item.icon} style={[styles.icon, collapsed && styles.iconCollapsed]} />
            {!collapsed && <Text style={styles.menuText}>{item.name}</Text>}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 220,
    backgroundColor: "#153370",
    paddingVertical: 20,
  },
  sidebarCollapsed: {
    width: 80,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  menuItemActive: {
    backgroundColor: "#D3D3D3", // Light Grey for active
  },
  menuText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  iconCollapsed: {
    marginLeft: 10,
  },
  collapseButton: {
    padding: 10,
    alignItems: "center",
  },
  collapseText: {
    fontSize: 20,
    color: "#fff",
  },
});
