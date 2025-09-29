import { lightColors, darkColors } from "../constants/colors";

// Keep track of used colors
const usedLightColors = new Set<string>();
const usedDarkColors = new Set<string>();

export function getUniqueColorPair(): [string, string] {
  const availableLightColor = lightColors.find(
    (color) => !usedLightColors.has(color)
  );
  const availableDarkColor = darkColors.find(
    (color) => !usedDarkColors.has(color)
  );

  if (!availableLightColor || !availableDarkColor) {
    usedLightColors.clear();
    usedDarkColors.clear();
    usedLightColors.add(lightColors[0]);
    usedDarkColors.add(darkColors[0]);
    return [lightColors[0], darkColors[0]];
  }

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
