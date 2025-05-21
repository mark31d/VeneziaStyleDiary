// components/Loader.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
const SplashLogo = require('../assets/Logo.png');


export default function Loader() {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Fade in за 500 мс
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Держим логотип на экране 1000 мс
      Animated.delay(1000),
      // Fade out за 500 мс
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.Image
        source={SplashLogo}
        style={[styles.logo, { opacity }]}
        resizeMode="contain"
      />
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131B28', // тот же тёмный фон, что и на вашем скрине
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 1.2,
    height: height * 1,
  },
});

