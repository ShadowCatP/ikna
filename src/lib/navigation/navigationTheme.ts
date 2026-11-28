import { DarkTheme, DefaultTheme } from 'expo-router';

export const lightNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    card: '#ffffff',
  },
};

export const darkNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#1e1450',
    card: '#1e1450',
    border: '#3a2e7a',
  },
};
