import React from "react";
import {  View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Link } from "expo-router";
import Swiper from "react-native-swiper";

export default function Index() {
  return (
     <ScrollView style={styles.container}>
           {/* Image Slider */}
           <Swiper style={styles.slider} showsPagination autoplay>
             <View style={styles.slideImageContainer}>
               <Image source={require("@/assets/images/R.jpg")} style={styles.image} />
             </View>
             <View style={styles.slideImageContainer}>
               <Image source={require("@/assets/images/R.jpg")} style={styles.image} />
             </View>
             <View style={styles.slideImageContainer}>
               <Image source={require("@/assets/images/R2.png")} style={styles.image} />
             </View>
           </Swiper>
     
           {/* Header Section */}
           <View style={styles.header}>
             <Text style={styles.title}>SafeKids</Text>
             <Text style={styles.subtitle}>Where Every Child's Safety Comes First.</Text>
           </View>
     
           {/* Event Cards Section (Horizontal Scroll) */}
           <View style={styles.eventContainer}>
             <Text style={styles.eventTitle}> Your Child, Our Priority</Text>
             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventScroll}>
               <View style={styles.eventCard}>
                 <Image source={require("@/assets/images/200312720-001-56a939b03df78cf772a4ee72.jpg")} style={styles.eventImage} />
                 <Text style={styles.eventText}>Building Trust: Seamless communication between school and parents, fostering a secure environment.</Text>
               </View>
               <View style={styles.eventCard}>
                 <Image source={require("@/assets/images/D2115_186_139_1200.jpg")} style={styles.eventImage} />
                 <Text style={styles.eventText}>A parents smile:  Instant alerts sent to families daily for student entry and exit updates.</Text>
               </View>
               <View style={styles.eventCard}>
                 <Image source={require("@/assets/images/children-learning-second-language.jpg")} style={styles.eventImage} />
                 <Text style={styles.eventText}>A Secure Campus: Enhanced monitoring and tracking systems protecting students.</Text>
               </View>
             </ScrollView>
           </View>
     
           {/* Donation & Request Buttons */}
           <View style={styles.buttonContainer}>
             <Link href="../(tabs)/home" asChild>
               <TouchableOpacity style={styles.button}>
                 <Text style={styles.buttonText}>Let's Go SafeKids </Text>
               </TouchableOpacity>
             </Link>
             <Link href="../(tabs)/contact" asChild>
               <TouchableOpacity style={[styles.button, styles.requestButton]}>
                 <Text style={styles.buttonText}>Contact Us</Text>
               </TouchableOpacity>
             </Link>
           </View>
         </ScrollView>
  );
}

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
  highlight: {
    color: "#ff6600",
  },
  title: { 
    fontSize: 30, 
    fontWeight: "bold", 
    color: "#ff6600", 
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

