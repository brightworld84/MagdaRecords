import React, { useState } from 'react';
import { View, Text, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Collapsible({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const colorScheme = useColorScheme() || 'light';

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <ThemedView
      style={{
        marginVertical: 8,
        backgroundColor: Colors[colorScheme].background,
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <Pressable
        onPress={toggle}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 12,
          backgroundColor: Colors[colorScheme].tint,
        }}
      >
        <ThemedText type="subtitle">{title}</ThemedText>
        <IconSymbol
          name={expanded ? 'chevron.down' : 'chevron.up'}
          size={16}
          color={Colors[colorScheme].text}
        />
      </Pressable>
      {expanded && (
        <View style={{ padding: 12 }}>
          {children}
        </View>
      )}
    </ThemedView>
  );
}
