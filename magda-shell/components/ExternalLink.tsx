import React from 'react';
import { View, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import * as WebBrowser from 'expo-web-browser';

export default function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const colorScheme = useColorScheme() || 'light';

  const handlePress = async () => {
    await WebBrowser.openBrowserAsync(href);
  };

  return (
    <Pressable onPress={handlePress}>
      <ThemedView
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          borderRadius: 8,
          backgroundColor: Colors[colorScheme].background,
        }}
      >
        <IconSymbol name="arrow.up.right" size={16} color={Colors[colorScheme].text} />
        <ThemedText style={{ marginLeft: 8 }}>{children}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}
