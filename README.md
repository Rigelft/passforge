# Passforge | Premium Password Generator

Passforge is a high-security, RAM-only cryptographic password generator built with Next.js and TypeScript. It focuses on visual excellence and maximum security by using the CSPRNG `window.crypto` API.

## ⚙️ Core Logic

- **Cryptographic Entropy**: Uses `window.crypto.getRandomValues()` exclusively for randomness.
- **Ephemeral Memory**: No `localStorage`, no cookies, no database. History is stored in RAM and cleared on page refresh or tab closure.
- **Algorithms**:
  - **Random**: Weighted character selection based on user preferences.
  - **Memorable**: Adjective-Noun-Number format using pre-defined cryptographic word lists.
  - **PIN**: Numeric-only sequences with uniform distribution.
- **Entropy Calculation**: Theoretical entropy analysis (bits) provided for every generated password.

## 🛠️ Features

- **Three Modes**: Random (Secured), Memorable (Readable), and PIN (Numeric).
- **Customization**:
  - Length adjustment (4-64 for text, 4-12 for PIN).
  - Character set toggles (A-Z, a-z, 0-9, Symbols).
  - Word count and separator configuration for Memorable mode.
- **Session History**: Track up to 50 passwords in the current session. Individual deletion or full clear available.
- **Copy to Clipboard**: One-click secure copy with feedback.
- **Premium UI**: 
  - Dark-mode aesthetic with glassmorphism and holographic glows.
  - Staggered fadeInUp load animations.
  - Responsive design for mobile and desktop.

## 🚀 Technical Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS Modules
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 📝 Recent Updates

- Initial implementation of the CSPRNG backend logic.
- Creation of the premium design system and global theme.
- Implementation of the `GeneratorContainer` orchestrator.
- Added staggered animations for page load.
- Implemented RAM-only history management.
