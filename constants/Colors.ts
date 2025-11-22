const primaryColor = '#BB86FC'; // Purple
const secondaryColor = '#03DAC6'; // Teal
const dangerColor = '#CF6679'; // Red
const backgroundColor = '#F2F4F8'; // Light gray-blue
const cardBackground = '#FFFFFF';
const textPrimary = '#1A1D26';
const textSecondary = '#6B7280';
const inputBorder = '#D1D5DB';

const tintColorLight = primaryColor;
const tintColorDark = '#fff';

export default {
  light: {
    text: textPrimary,
    background: backgroundColor,
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    primary: primaryColor,
    secondary: secondaryColor,
    danger: dangerColor,
    card: cardBackground,
    input: inputBorder,
    textPrimary: textPrimary,
    textSecondary: textSecondary,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    primary: primaryColor,
    secondary: secondaryColor,
    danger: dangerColor,
    card: '#2D2D2D',
    input: '#4A4A4A',
    textPrimary: '#FFFFFF',
    textSecondary: '#CCCCCC',
  },
};
