import { lightColors, darkColors } from "../constants/colors";

// Keep track of used colors
let usedLightColors = new Set<string>();
let usedDarkColors = new Set<string>();

export function getUniqueColorPair(): [string, string] {
  // Find first unused light color
  const availableLightColor = lightColors.find(
    (color) => !usedLightColors.has(color)
  );
  // Find first unused dark color
  const availableDarkColor = darkColors.find(
    (color) => !usedDarkColors.has(color)
  );

  if (!availableLightColor || !availableDarkColor) {
    // If we run out of colors, reset the used colors
    usedLightColors.clear();
    usedDarkColors.clear();
    // Return the first color pair
    usedLightColors.add(lightColors[0]);
    usedDarkColors.add(darkColors[0]);
    return [lightColors[0], darkColors[0]];
  }

  // Mark colors as used
  usedLightColors.add(availableLightColor);
  usedDarkColors.add(availableDarkColor);

  return [availableLightColor, availableDarkColor];
}

export function releaseColorPair(lightColor: string, darkColor: string) {
  usedLightColors.delete(lightColor);
  usedDarkColors.delete(darkColor);
}

export function resetColorUsage() {
  usedLightColors.clear();
  usedDarkColors.clear();
}
