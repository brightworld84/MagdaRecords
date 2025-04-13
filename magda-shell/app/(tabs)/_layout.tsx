import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }: { route: { name: string } }) => ({
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          switch (route.name) {
            case 'index':
              iconName = 'home';
              break;
            case 'records':
              iconName = 'document-text';
              break;
            case 'upload':
              iconName = 'cloud-upload';
              break;
            case 'providers':
              iconName = 'people';
              break;
            case 'ai':
              iconName = 'medkit'; // valid Ionicon name
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'dodgerblue',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    />
  );
}
