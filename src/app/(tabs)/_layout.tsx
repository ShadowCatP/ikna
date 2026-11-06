import { AddMenuSheet } from '@/components/AddMenuSheet';
import { TabBar } from '@/components/navigation/TabBar';
import { Lucide } from '@/components/ui/icons';
import { Tabs } from 'expo-router';
import { useState } from 'react';

export default function TabLayout() {
  const [isAddMenuVisible, setIsAddMenuVisible] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => (
          <TabBar
            props={props}
            handleAddButtonPress={() => setIsAddMenuVisible(true)}
          />
        )}
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

      <AddMenuSheet
        visible={isAddMenuVisible}
        onClose={() => setIsAddMenuVisible(false)}
      />
    </>
  );
}
