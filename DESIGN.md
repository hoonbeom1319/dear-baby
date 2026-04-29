---
name: Premium Guidance
colors:
    surface: '#fff8f5'
    surface-dim: '#e0d8d5'
    surface-bright: '#fff8f5'
    surface-container-lowest: '#ffffff'
    surface-container-low: '#faf2ee'
    surface-container: '#f4ece8'
    surface-container-high: '#eee7e3'
    surface-container-highest: '#e9e1dd'
    on-surface: '#1e1b19'
    on-surface-variant: '#554336'
    inverse-surface: '#33302d'
    inverse-on-surface: '#f7efeb'
    outline: '#887364'
    outline-variant: '#dbc2b0'
    surface-tint: '#904d00'
    primary: '#8d4b00'
    on-primary: '#ffffff'
    primary-container: '#b15f00'
    on-primary-container: '#fffbff'
    inverse-primary: '#ffb77d'
    secondary: '#4b41e1'
    on-secondary: '#ffffff'
    secondary-container: '#645efb'
    on-secondary-container: '#fffbff'
    tertiary: '#006c49'
    on-tertiary: '#ffffff'
    tertiary-container: '#00a572'
    on-tertiary-container: '#00311f'
    error: '#ba1a1a'
    on-error: '#ffffff'
    error-container: '#ffdad6'
    on-error-container: '#93000a'
    primary-fixed: '#ffdcc3'
    primary-fixed-dim: '#ffb77d'
    on-primary-fixed: '#2f1500'
    on-primary-fixed-variant: '#6e3900'
    secondary-fixed: '#e2dfff'
    secondary-fixed-dim: '#c3c0ff'
    on-secondary-fixed: '#0f0069'
    on-secondary-fixed-variant: '#3323cc'
    tertiary-fixed: '#6ffbbe'
    tertiary-fixed-dim: '#4edea3'
    on-tertiary-fixed: '#002113'
    on-tertiary-fixed-variant: '#005236'
    background: '#fff8f5'
    on-background: '#1e1b19'
    surface-variant: '#e9e1dd'
typography:
    brand-title:
        fontSize: 24px
        fontWeight: '900'
        lineHeight: '1.2'
        letterSpacing: -0.05em
    h1:
        fontSize: 30px
        fontWeight: '900'
        lineHeight: '1.1'
        letterSpacing: -0.05em
    h2:
        fontSize: 18px
        fontWeight: '900'
        lineHeight: '1.3'
    body-bold:
        fontSize: 14px
        fontWeight: '700'
        lineHeight: '1.5'
    body-medium:
        fontSize: 14px
        fontWeight: '500'
        lineHeight: '1.5'
    caption:
        fontSize: 10px
        fontWeight: '900'
        lineHeight: '1.6'
        letterSpacing: 0.1em
rounded:
    sm: 0.5rem
    DEFAULT: 1rem
    md: 1.5rem
    lg: 2rem
    xl: 3rem
    full: 9999px
spacing:
    unit: 4px
    container-max: 1200px
    gutter: 24px
    margin-mobile: 16px
    margin-desktop: 40px
    stack-sm: 8px
    stack-md: 16px
    stack-lg: 32px
    inset-squish: 12px 20px
    inset-stretch: 24px 16px
---

## Brand & Style

The design system is anchored in the concept of "Parental Confidence." It balances the warmth of a nurturing environment with the structural reliability of expert guidance. The visual style is a hybrid of **Modern Minimalism** and **Tactile Premium**, utilizing generous white space to reduce cognitive load for busy parents while employing high-contrast typography to ensure absolute legibility.

The interface should feel human and approachable, yet authoritative. This is achieved through the juxtaposition of soft, organic amber tones against sharp, disciplined stone neutrals. Every element is designed to evoke a sense of calm efficiency, transforming complex parenting data into a clear, navigable map.

## Colors

The palette for the design system prioritizes visual comfort and semantic clarity. The **Amber** primary scale provides a glowing, optimistic focal point that suggests warmth without the aggression of red or the coolness of blue. **Stone** neutrals are used for the foundation to create a sophisticated, "paper-like" feel that is easier on the eyes than pure grayscale.

High-contrast accessibility is baked into the text tokens. Stone-900 is reserved for critical information and headings to ensure maximum readability against the Stone-50 background. Secondary Indigo is used sparingly to denote interactive depth and specialized navigational paths.

## Typography

Typography in this design system is designed for "glanceability." Using **Plus Jakarta Sans** (or Pretendard for localized contexts), the system leverages heavy weights and tight tracking for headlines to create a strong, editorial presence.

- **Brand Identity:** The Brand Title uses a heavy italic style to suggest momentum and modern parenting.
- **Hierarchy:** H1 and H2 levels use "Black" weights to anchor sections firmly.
- **Readability:** Body text alternates between Bold and Medium weights to maintain high contrast even at smaller sizes.
- **Metadata:** Captions utilize wide tracking and uppercase styling to distinguish micro-copy from instructional body text.

## Layout & Spacing

The design system employs a **Fixed-Fluid Hybrid Grid**. On desktop, content is centered within a 1200px container to prevent eye strain. On mobile devices, a fluid 4-column grid is used with 16px margins.

The spacing rhythm is based on a 4px baseline, but emphasizes large "breathing rooms" (32px+) between major sections to maintain a premium feel. Elements within cards should use "squished" insets (horizontal padding > vertical padding) to create a sense of stability and containment.

## Elevation & Depth

Depth in the design system is communicated through **Tonal Layering** and **Soft Ambient Shadows**. Rather than using harsh black shadows, this system utilizes shadows with a hint of the Stone-900 neutral to maintain a natural, physical appearance.

- **Level 0 (Base):** Stone-50 background. No shadow.
- **Level 1 (Cards):** White surface with `shadow-xl`. This creates a gentle lift that defines the primary content areas.
- **Level 2 (Modals/Overlays):** White surface with `shadow-2xl`. These elements should appear significantly closer to the user to demand focus.
- **Subtle Interaction:** Simple elements like buttons use `shadow-sm` to provide a tactile "pressable" hint without cluttering the UI.

## Shapes

The shape language is **Ultra-Rounded**, designed to feel safe, friendly, and organic. High-radius corners remove the "sharpness" of digital interfaces, aligning with the nurturing nature of a parenting service.

- **Large (64px):** Used for main container wrappers and large hero images.
- **Medium (40px):** The standard for primary buttons, input fields, and featured cards.
- **Small (16px):** Used for internal elements like chips, tags, and small utility buttons.

## Components

### Buttons & Inputs

Buttons must use the **Medium (40px)** radius. Primary buttons are Amber-600 with white text. Input fields use Stone-100 borders that transition to Amber-600 on focus. All interactive elements must utilize the `cubic-bezier(0.16, 1, 0.3, 1)` transition for a "snappy yet smooth" response.

### Cards

Cards are the primary content vehicle. They must be pure white (#FFFFFF) with a **Medium (40px)** or **Large (64px)** radius and `shadow-xl`. Avoid borders on cards; use shadow and background contrast for definition.

### Chips & Tags

Used for categorization (e.g., "New," "Ages 0-2"). These should use the **Small (16px)** radius. Semantic colors (Blue, Red, Emerald) should be used at 50% opacity for backgrounds with 100% opacity text to ensure the "Subtle" aesthetic is maintained.

### Feedback States

- **Success:** Emerald-500 icons or accents.
- **Live/Urgent:** Red-500 pill with a pulsing animation.
- **Disabled:** Apply `grayscale(100%)` and `opacity 0.2` to the entire component tree to clearly communicate non-interactivity while maintaining the visual structure.
