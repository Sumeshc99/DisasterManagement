import React from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const WaveBackgroundHeader = () => {
    return (
        <View style={styles.container}>
            {/* Blue background */}
            <View style={styles.blueBackground}>
                {/* Logo */}
                <Image
                    source={require('../../assets/citizen/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* Header text */}
                <Text style={styles.headerTitle}>Select Language</Text>

                {/* White wave at bottom (flipped horizontally) */}
                <Svg
                    width={width}
                    height={110}
                    viewBox="0 0 512 120"
                    style={styles.wave}
                    preserveAspectRatio="none"
                >
                    <Path
                        d="M0,60 C150,120 300,0 512,90 L512,120 L0,120 Z"
                        fill="#FFFFFF"
                    />
                </Svg>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
    },
    blueBackground: {
        backgroundColor: '#125FAA',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
        paddingBottom: 100,
        position: 'relative',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 16,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    wave: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        transform: [{ scaleX: -1 }], // 👈 flips the wave horizontally
    },
});

export default WaveBackgroundHeader;
