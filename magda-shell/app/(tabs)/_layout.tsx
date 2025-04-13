import { Tabs } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#007aff',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'index':
              return <Ionicons name="home-outline" size={size} color={color} />;
            case 'records':
              return <MaterialIcons name="folder-open" size={size} color={color} />;
            case 'upload':
              return <Ionicons name="cloud-upload-outline" size={size} color={color} />;
            case 'ai':
              return <FontAwesome5 name="robot" size={size} color={color} />;
            case 'providers':
              return <MaterialIcons name="local-hospital" size={size} color={color} />;
            default:
              return <Ionicons name="ellipse" size={size} color={color} />;
          }
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="records" options={{ title: 'Records' }} />
      <Tabs.Screen name="upload" options={{ title: 'Upload' }} />
      <Tabs.Screen name="ai" options={{ title: 'AI Assistant' }} />
      <Tabs.Screen name="providers" options={{ title: 'Providers' }} />
    </Tabs>
  );
}
