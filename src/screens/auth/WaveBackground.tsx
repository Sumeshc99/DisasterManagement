// WaveBackground.js (or .tsx)
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const WaveBackground = () => {
    return (
        <View style={styles.container}>
            <Svg
                height="130"
                width="100%"
                viewBox="0 0 512 230"
                preserveAspectRatio="none"
            >
                <Path
                    d="M0,180 C100,120 250,240 400,160 C470,120 512,50 512,50 L512,230 L0,230 Z"
                    fill="#125FAA"
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent', // make it transparent
    },
});

export default WaveBackground;
