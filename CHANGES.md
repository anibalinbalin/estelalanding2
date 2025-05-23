# Changes Tracking

## 2025-01-22

### Language Toggle Feature
- Created `LanguageProvider` component for managing language state across the application
- Created `ToolbarSwitcher` component that combines both theme and language switching in a single unified toolbar
- Language toggle uses Chinese character (文) icon and is integrated within the same bar as theme switches
- Added visual divider between language and theme toggles for better UI organization
- Updated hero section to be language-aware with translations for:
  - H1 title
  - Subtitle description
  - Button labels ("Start Building" / "Comenzar", "Request a demo" / "Solicitar demo")
  - "Powering the best teams" text
- Language preference is persisted in localStorage
- Default language is set to Spanish (es)
- Active language state is highlighted with same styling as theme selection

### Text Alignment Fix
- Changed text alignment in hero section from right to left across all breakpoints
- Updated company logo alignment
- Fixed "Powering the best teams" section alignment

### Typography Updates
- Added Inter font from Google Fonts to the project
- Updated H1 styling:
  - Font: Inter Variable with system font fallbacks
  - Size: 56px
  - Line Height: 61.6px
  - Weight: 400 (Regular)
  - Color: #F7F8F8
- Updated subtitle styling:
  - Font: Inter Variable with system font fallbacks
  - Size: 21px
  - Line Height: 27.93px
  - Weight: 400 (Regular)
  - Color: #F7F8F8

### Styling
- Language switcher matches the theme switcher styling
- Positioned to the left of the theme switcher in the header toolbar
- Uses same rounded button style and hover effects
- Includes smooth animation transitions when toggling languages