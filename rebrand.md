Focus: B2C Loop, "Zero-Friction" Activation, and Onboarding Gamification.

## Enhanced Gamification Features (v2.0)

### Combo & Streak System
- **Answer Streaks**: Build consecutive answer streaks for XP multipliers
- **Combo Meter**: Visual combo counter (up to 5x multiplier) with countdown timer
- **Streak Fire**: Animated fire indicator when streak >= 3 answers
- **Haptic Feedback**: Escalating vibration patterns for combos

### XP Multiplier System
- Base XP: 15 per answer
- 2x multiplier: 2+ consecutive answers
- 3x multiplier: 3+ consecutive answers  
- 4x multiplier: 4+ consecutive answers
- 5x multiplier: 5+ consecutive answers (max)
- Combo resets after 5 seconds of inactivity

### Visual Feedback
- **XP Popups**: Animated floating XP indicators with multiplier display
- **Particle Bursts**: Celebratory particle effects on answers
- **Spring Physics**: Smooth, physics-based animations on buttons and transitions
- **Smooth Number Transitions**: Animated counters with spring easing

### Dashboard Gamification
- **Daily Challenges**: 3 daily tasks with XP rewards (sync, questions, share)
- **Daily Streak Calendar**: 7-day visual streak tracker
- **Level Up Celebration**: Full-screen celebration animation on level up
- **Achievement Unlocks**: Animated achievement popups with rarity tiers

### Achievements System
- **Rarity Tiers**: Common, Rare, Epic, Legendary
- **Visual Distinction**: Color-coded glows and badges per rarity
- **XP Rewards**: Bonus XP for unlocking achievements

---

Screen 1: Zero-Friction Handshake
Delivery: Link sent via SMS/WhatsApp (chromapilot.app/connect?token=...).
Auth: JWT-based Auto-Login. Upon clicking, the web app opens directly to the onboarding flow—No password creation required.
Screen 2: The "Phenotype Pulse" Onboarding (30 Questions)
The 30 questions are divided into three "Calibration Modules" to prevent fatigue.
UI Pattern: One question per screen (Typeform style). Large touch targets. No keyboard input.
Module 1: The Safety Shield (10 Questions)
Goal: Medication Safety.
Visual: Green UI accents. A central shield icon that grows with every "Yes/No" tap.
Interaction: Haptic feedback on every tap.
Module 2: The Ancestral Radar (10 Questions)
Goal: Family History (e.g., "Sudden death before 50?", "Sickle Cell?").
Visual: Blue UI. A radar-sweep animation scanning for "hidden" risks.
Smart Pause: If a user clicks "YES" to a critical risk (e.g., Question #11), show a 1-second overlay: "Noted. We will flag this for your doctor."
Module 3: The Live Context (10 Questions)
Goal: Lifestyle/Environment.
Visual: Amber UI.
Interaction: Circular sliders for units of alcohol/water intake.
