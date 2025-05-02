import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { useState } from "react";

interface MenuItem {
  name: string;
  route: string;
  icon: any;
}

const menuItems: MenuItem[] = [
  { name: "Class", route: "/class", icon: require("../../assets/icons/class1.png") },
  { name: "Student", route: "/student", icon: require("../../assets/icons/class.png") },
  { name: "Bus", route: "/Bus", icon: require("../../assets/icons/buss.png") },
  { name: "Bus Entries", route: "/busentries", icon: require("../../assets/icons/bus.jpg") },
  { name: "School Entries", route: "/schoolentries", icon: require("../../assets/icons/school.png") },
  { name: "Leaves", route: "/LeaveAdmin", icon: require("../../assets/icons/home.png") },
  { name: "Logout", route: "/logout", icon: require("../../assets/icons/logout.png") },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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
            onPress={() => {
              router.push(item.route as any);
            }}
          >
            <View style={styles.menuItemContent}>
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
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 390,
    height: "100%",
    position: "absolute",
    backgroundColor: "#153370",
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  sidebarCollapsed: {
    width: 80,
  },
  menuItem: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemActive: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
  },
  icon: {
    width: 36,
    height: 23,
    resizeMode: "contain",
    marginRight: 20,
  },
  iconCollapsed: {
    marginRight: 0,
  },
  menuText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
  },
  menuTextActive: {
    color: "#153370",
  },
  collapseButton: {
    paddingVertical: 40,
    alignItems: "center",
  },
  collapseText: {
    fontSize: 22,
    color: "#fff",
  },
});
