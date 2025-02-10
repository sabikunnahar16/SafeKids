import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Link } from "expo-router";
import Swiper from "react-native-swiper";

const HomePage = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Image Slider */}
      <Swiper style={styles.slider} showsPagination autoplay>
        <View style={styles.slideImageContainer}>
          <Image source={require("@/assets/images/food.jpg")} style={styles.image} />
        </View>
        <View style={styles.slideImageContainer}>
          <Image source={require("@/assets/images/food.jpg")} style={styles.image} />
        </View>
        <View style={styles.slideImageContainer}>
          <Image source={require("@/assets/images/food.jpg")} style={styles.image} />
        </View>
      </Swiper>

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Food Donation</Text>
        <Text style={styles.subtitle}>Help those in need by donating excess food</Text>
      </View>

      {/* Event Cards Section (Horizontal Scroll) */}
      <View style={styles.eventContainer}>
        <Text style={styles.eventTitle}>Recent Events & Stories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventScroll}>
          <View style={styles.eventCard}>
            <Image source={require("@/assets/images/istockphoto-1478316232-612x612.jpg")} style={styles.eventImage} />
            <Text style={styles.eventText}>Helping Hands: 500+ meals distributed in local shelters.</Text>
          </View>
          <View style={styles.eventCard}>
            <Image source={require("@/assets/images/istockphoto-472165353-612x612.jpg")} style={styles.eventImage} />
            <Text style={styles.eventText}>A child's smile: Warm meals provided for underprivileged children.</Text>
          </View>
          <View style={styles.eventCard}>
            <Image source={require("@/assets/images/food.jpg")} style={styles.eventImage} />
            <Text style={styles.eventText}>Community effort: Feeding families in need during the holidays.</Text>
          </View>
        </ScrollView>
      </View>

      {/* Donation & Request Buttons */}
      <View style={styles.buttonContainer}>
        <Link href="./donate-food" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Donate Food</Text>
          </TouchableOpacity>
        </Link>
        <Link href="./request-food" asChild>
          <TouchableOpacity style={[styles.button, styles.requestButton]}>
            <Text style={styles.buttonText}>Request Food</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },

  header: {
    alignItems: "center",
    marginTop: 10,
    padding: 15,
    backgroundColor: "#ecf0f1",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 15,
  },
  title: { 
    fontSize: 30, 
    fontWeight: "bold", 
    color: "#2c3e50", 
    textShadowColor: '#bdc3c7', 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 5 
  },
  subtitle: { 
    fontSize: 18, 
    color: "#7f8c8d", 
    textAlign: "center", 
    marginTop: 5,
    fontStyle: 'italic' 
  },

  slider: { 
    height: 250, 
    marginVertical: 20, 
    borderRadius: 15, 
    overflow: 'hidden' 
  },
  slideImageContainer: { alignItems: "center" },
  image: { width: "100%", height: 250, borderRadius: 15 },

  eventContainer: { 
    padding: 20,
    backgroundColor: "#ffffff",
    marginBottom: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  eventTitle: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#34495e", 
    marginBottom: 15 
  },
  eventScroll: { marginBottom: 15 },
  eventCard: { 
    backgroundColor: "#ffffff", 
    padding: 20, 
    borderRadius: 10, 
    marginRight: 15, // spacing between cards
    shadowColor: "#000", 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 5, 
    width: 250 // fixed width for the event cards
  },
  eventImage: { 
    width: "100%", 
    height: 150, 
    borderRadius: 10, 
    marginBottom: 10 
  },
  eventText: { 
    fontSize: 16, 
    color: "#2c3e50" 
  },

  buttonContainer: { 
    alignItems: "center", 
    marginTop: 20, 
    paddingHorizontal: 15 
  },
  button: { 
    backgroundColor: "#27ae60", 
    padding: 15, 
    borderRadius: 10, 
    width: "100%", 
    alignItems: "center", 
    marginVertical: 10,
    shadowColor: "#27ae60",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3 
  },
  requestButton: { 
    backgroundColor: "#2980b9" 
  },
  buttonText: { 
    color: "white", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
});

export default HomePage;
