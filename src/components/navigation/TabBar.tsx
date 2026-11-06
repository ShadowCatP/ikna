import Lucide from '@react-native-vector-icons/lucide';
import { BottomTabBarProps } from 'expo-router/build/layouts/TabsClient.js';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NavBarProps {
  props: BottomTabBarProps;
  handleAddButtonPress: () => void;
}

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

export function TabBar({ props, handleAddButtonPress }: NavBarProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 0;

  return (
    <View
      className="bg-surface flex-row items-center"
      style={{
        height: 64 + bottomInset,
      }}
    >
      <View className="flex-row justify-around">
        {props.state.routes.map((route, index) => {
          const isFocused = props.state.index === index;
          const options = props.descriptors[route.key].options;
          const navigation = props.descriptors[route.key].navigation;
          const color = isFocused
            ? (options.tabBarActiveTintColor ?? '#6a5af9') // react native does not resolve css vars apparently ;)
            : (options.tabBarInactiveTintColor ?? 'black');
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : (options.title ?? route.name);

          function handlePress() {
            if (!isFocused) {
              navigation.navigate(route.name, route.params);
            }
          }

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={handlePress}
              className="flex-1 items-center"
            >
              {options.tabBarIcon?.({
                focused: isFocused,
                color,
                size: 24,
              })}
              {options.tabBarShowLabel !== false && (
                <Text style={{ color }} className="mt-0.5 text-xs">
                  {label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add deck"
        onPress={handleAddButtonPress}
        className="bg-primary"
        style={floatingButtonStyle.button}
      >
        <Lucide name="plus" size={28} color="white" />
      </Pressable>
    </View>
  );
}
