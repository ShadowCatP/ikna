import { Lucide } from '@/components/ui/icons';
import { Tabs } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const floatingButtonStyle = StyleSheet.create({
  button: {
    position: 'absolute',
    top: -24,
    left: '50%',
    width: 64,
    height: 64,
    marginLeft: -32,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 0;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 64 + bottomInset,
          overflow: 'visible',
          paddingTop: 4,
          paddingBottom: bottomInset,
          borderTopWidth: StyleSheet.hairlineWidth,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarBackground: () => (
          <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add deck"
              onPress={() => {}}
              className="bg-primary"
              style={floatingButtonStyle.button}
            >
              <Lucide name="plus" size={28} color="white" />
            </Pressable>
          </View>
        ),
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
