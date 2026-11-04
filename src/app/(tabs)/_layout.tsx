import { Lucide } from '@/components/ui/icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 64,
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Decks',
          tabBarIcon: ({ color }) => (
            <Lucide name="layers" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Lucide name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
