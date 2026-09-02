/**
 * Design tokens — healthcare-trust palette.
 * Calm teal primary, warm coral accent used sparingly, generous neutrals.
 * Keep every color here; screens/components never hard-code hex.
 */

export const color = {
  // brand
  primary: "#0E9F9F",
  primaryDark: "#0B7C7C",
  primarySoft: "#E6F7F7",
  primaryTint: "#F2FBFB",

  accent: "#FF7A59",
  accentSoft: "#FFEDE7",

  // text
  ink: "#14202E",
  body: "#3C4A5A",
  muted: "#7A8794",
  faint: "#A9B4BF",

  // surfaces
  bg: "#F5F8FA",
  surface: "#FFFFFF",
  surfaceAlt: "#FBFCFD",
  border: "#E7ECF1",
  borderStrong: "#D6DEE6",

  // status
  success: "#1BA672",
  successSoft: "#E4F6EF",
  warning: "#E0912B",
  warningSoft: "#FBEEDD",
  danger: "#E5484D",
  dangerSoft: "#FBE9E9",
  info: "#2F80ED",
  infoSoft: "#E7F0FD",

  // caregiver tiers
  tierAssistant: "#5B6B7B",
  tierAssistantSoft: "#EDF0F3",
  tierNaPn: "#2F80ED",
  tierNaPnSoft: "#E7F0FD",
  tierRn: "#7A3DB8",
  tierRnSoft: "#F1E9FA",

  white: "#FFFFFF",
  black: "#000000",
  overlay: "rgba(14, 32, 46, 0.45)",
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 44,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const font = {
  regular: "NotoSansThai_400Regular",
  medium: "NotoSansThai_500Medium",
  semibold: "NotoSansThai_600SemiBold",
  bold: "NotoSansThai_700Bold",
} as const;

export const type = {
  display: { fontFamily: font.bold, fontSize: 28, lineHeight: 36 },
  h1: { fontFamily: font.bold, fontSize: 22, lineHeight: 30 },
  h2: { fontFamily: font.semibold, fontSize: 18, lineHeight: 26 },
  h3: { fontFamily: font.semibold, fontSize: 16, lineHeight: 24 },
  body: { fontFamily: font.regular, fontSize: 15, lineHeight: 23 },
  bodyMedium: { fontFamily: font.medium, fontSize: 15, lineHeight: 23 },
  small: { fontFamily: font.regular, fontSize: 13, lineHeight: 19 },
  smallMedium: { fontFamily: font.medium, fontSize: 13, lineHeight: 19 },
  tiny: { fontFamily: font.medium, fontSize: 11, lineHeight: 15 },
} as const;

export const shadow = {
  card: {
    shadowColor: "#0B2942",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  raised: {
    shadowColor: "#0B2942",
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
} as const;
