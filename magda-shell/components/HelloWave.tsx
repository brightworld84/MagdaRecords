// components/HelloWave.tsx
import React from 'react';
import { Text, Animated, Easing } from 'react-native';
import { ThemedText } from './ThemedText'; // ✅ updated to relative import

export function HelloWave() {
  const waveAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotate = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '10deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <ThemedText>👋</ThemedText>
    </Animated.View>
  );
}
