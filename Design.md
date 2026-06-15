---
name: DMFT Baseline Survey System
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf4'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dde9ff'
  surface-container-highest: '#d5e3fd'
  on-surface: '#0d1c2f'
  on-surface-variant: '#43474e'
  inverse-surface: '#233144'
  inverse-on-surface: '#ebf1ff'
  outline: '#73777f'
  outline-variant: '#c3c6cf'
  surface-tint: '#436084'
  primary: '#002444'
  on-primary: '#ffffff'
  primary-container: '#1a3a5c'
  on-primary-container: '#87a4cc'
  inverse-primary: '#abc9f2'
  secondary: '#5c5f61'
  on-secondary: '#ffffff'
  secondary-container: '#e0e3e5'
  on-secondary-container: '#626567'
  tertiary: '#222424'
  on-tertiary: '#ffffff'
  tertiary-container: '#373939'
  on-tertiary-container: '#a2a2a2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#abc9f2'
  on-primary-fixed: '#001c37'
  on-primary-fixed-variant: '#2a486b'
  secondary-fixed: '#e0e3e5'
  secondary-fixed-dim: '#c4c7c9'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f8f9ff'
  on-background: '#0d1c2f'
  surface-variant: '#d5e3fd'
typography:
  display-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  hindi-body:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  gutter: 16px
  row-height-sm: 32px
  row-height-md: 40px
---

## Brand & Style
This design system is engineered for the District Mineral Foundation Trust (DMFT) Baseline Survey, prioritizing institutional authority, data integrity, and administrative efficiency. The aesthetic is strictly **Utilitarian Minimalism**—a "form follows function" approach that eliminates decorative elements to focus on readability and high-density data entry.

The personality is professional and impartial. The UI utilizes a flat architectural style with no shadows or gradients, relying on thin, precise borders and clear tonal shifts to define hierarchy. It is designed to feel like a digital extension of formal government documentation: reliable, structured, and permanent.

## Colors
The palette is restricted to high-contrast, institutional tones to ensure maximum legibility for long-form survey tasks.

- **Primary Navy (#1A3A5C):** Used for headers, primary actions, and active states. It conveys stability and government branding.
- **Surface White (#FFFFFF):** The primary background for all data entry areas to maintain high contrast.
- **Secondary Light Gray (#F5F7F9):** Used for row striping in tables, container backgrounds, and disabled states.
- **Borders (#E0E0E0):** A consistent, neutral hair-line border for all structural divisions.
- **Status Colors:** Use standard semantic colors (Success: #166534, Error: #991B1B, Warning: #854D0E) but desaturated to match the professional tone.

## Typography
The system uses **Inter** for its exceptional legibility in dense interfaces. The scale is intentionally compact to maximize the information density required for baseline surveys.

**Bilingual Implementation:** 
Since the survey is English/Hindi, the line-height is strictly managed. Hindi text should be set 1pt larger than English text (e.g., 15px vs 14px) to ensure optical vertical alignment and legibility of complex characters. Labels are consistently uppercase and bold to differentiate from user input.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for desktop administration tools and a **Fluid Stack** for mobile field data collection. 

- **Grid:** A 12-column grid with a 1140px max-width for desktop. 
- **Density:** Spacing follows a 4px baseline. Vertical margins between form fields are kept to a minimum (16px) to reduce scrolling.
- **Data Tables:** Use a 32px fixed row height for "Compact" mode and 40px for "Standard" mode. 
- **Margins:** 24px page margins on desktop, reducing to 16px on mobile devices.

## Elevation & Depth
This system uses **Zero Elevation**. Depth is communicated exclusively through:
- **Tonal Layering:** The background is #F5F7F9, while the active workspace containers are #FFFFFF.
- **Hairline Borders:** All interactive elements and containers use a 0.5px or 1px border (#E0E0E0).
- **No Shadows:** Shadows are strictly prohibited to ensure the interface remains lightweight and performs well on lower-end mobile devices used in the field.
- **Active State:** The only "elevation" is psychological—achieved by filling an element with the Primary Navy color.

## Shapes
Shapes are conservative and geometric. 
- **Standard Radius:** 4px (Soft) for buttons and input fields to provide just enough distinction from the browser chrome without appearing "playful."
- **Data Inputs:** Square corners (0px) are permitted for table-integrated inputs to maintain grid alignment.
- **Status Pills:** Fully rounded (pill) shapes are used exclusively for status indicators (e.g., "Completed," "Pending") to differentiate them from actionable buttons.

## Components
- **Data Tables:** High-density with 1px #E0E0E0 borders. Header cells use #F5F7F9 background with `label-md` typography. Zebra striping is used for readability in wide rows.
- **Segmented Button Groups:** Used for mutually exclusive survey options. The container has a 1px border; the active segment is Primary Navy (#1A3A5C) with White text; inactive segments are White with Navy text.
- **Input Fields:** Small (32px height). No box-shadow on focus; use a 2px Primary Navy border to indicate focus state.
- **Status Pills:** Small, high-contrast text on desaturated semantic backgrounds.
- **Progress Bars:** Thin (4px height). Track color is #E0E0E0, fill color is Primary Navy. Used for survey completion tracking.
- **Bilingual Labels:** Question text should display English on top (Bold) and Hindi directly below (Regular, muted color) within the same form-group.