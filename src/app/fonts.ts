import { 
  Space_Grotesk, 
  Audiowide, 
  JetBrains_Mono, 
  Quicksand,
  Playfair_Display,
  Roboto_Condensed,
  Bebas_Neue,
  Orbitron,
  Poppins,
  Montserrat,
  Inter,
  Raleway,
  Caveat,
  Nunito,
  Special_Elite,
  DM_Sans
} from "next/font/google";

// Modern Sans (Clean, professional)
export const fontModern = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Techno / Display (Futuristic)
export const fontTechno = Audiowide({
  subsets: ["latin"],
  weight: "400",
});

// Mono (Code-like)
export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Soft Rounded (Friendly)
export const fontSoft = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Elegant Serif (Classic, sophisticated)
export const fontSerif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Condensed (Space-efficient, modern)
export const fontCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Bold Display (Impact, headlines)
export const fontBold = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

// Sci-Fi (Futuristic, geometric)
export const fontSciFi = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Corporate Sans (Professional)
export const fontCorporate = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Geometric Sans (Modern, clean)
export const fontGeometric = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Minimal Sans (Ultra-clean)
export const fontMinimal = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Elegant Sans (Sophisticated)
export const fontElegant = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export const fontHandwritten = Caveat({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const fontRounded = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const fontEditorial = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const fontTypewriter = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
});

export const fontLuxury = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400"],
});


// Map font_key to className
export const fontClassMap: Record<string, string> = {
  modern: fontModern.className,
  techno: fontTechno.className,
  mono: fontMono.className,
  soft: fontSoft.className,
  serif: fontSerif.className,
  condensed: fontCondensed.className,
  bold: fontBold.className,
  scifi: fontSciFi.className,
  corporate: fontCorporate.className,
  geometric: fontGeometric.className,
  minimal: fontMinimal.className,
  elegant: fontElegant.className,
  handwritten: fontHandwritten.className,
  rounded: fontRounded.className,
  editorial: fontEditorial.className,
  typewriter: fontTypewriter.className,
  luxury: fontLuxury.className,
};
