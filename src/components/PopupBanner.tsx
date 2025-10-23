import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface PopupBannerProps {
    visible: boolean;
    onHide: () => void;
}

const PopupBanner: React.FC<PopupBannerProps> = ({ visible, onHide }) => {
    const slideAnim = new Animated.Value(-80);

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();

            const timer = setTimeout(() => {
                Animated.timing(slideAnim, {
                    toValue: -80,
                    duration: 2000,
                    useNativeDriver: true,
                }).start(() => onHide());
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.banner}>
                <Text style={styles.text}>
                    <Text style={styles.bold}>Default view: </Text>
                    Incidents within 2 km around you.
                </Text>
                <Icon name="close-outline" size={20} color="#555" />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 110,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 1000,
    },
    banner: {
        backgroundColor: "rgba(255,255,255,0.95)",
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "90%",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    text: {
        color: "#000",
        fontSize: 14,
        flex: 1,
    },
    bold: {
        fontWeight: "600",
    },
});

export default PopupBanner;
