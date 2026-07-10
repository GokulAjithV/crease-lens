# CREASE Lens 🏏

CREASE Lens is the frontend client for the **CREASE** grassroots cricket scoring platform. It is a mobile-first Single Page Application (SPA) built using React, TypeScript, and Vite, designed to provide a premium, dynamic, and responsive interface for both scorer and fan roles.

---

## 🏗️ Architecture & System Design
- **System Design & Architecture**: Read the full system design document in the [System Design Guide](file:///v:/workspace/business/crease/docs/system-design.md).
- **Interview Preparation**: If you're preparing for interviews, check out our [Interview Prep Guide](file:///v:/workspace/business/crease/docs/interview-prep.md) to understand design decisions, databases, real-time aspects, and AI integrations.

---

## ✨ Features
- **Live Match Banner**: Prominently displayed with real-time updates and pulse animations.
- **Match Setup Flow**: Quick and simple coin toss, playing XI selection, captain/vice-captain assignments.
- **Live Scoring Interface**: Ball-by-ball event entry (dots, runs, wickets, extras) with robust undo capabilities.
- **Leaderboards & Rankings**: Track player ratings, batting/bowling statistics across weekly/monthly/all-time brackets.
- **Scouting Hub & Chat**: RAG-based strategic chat for coaches and captains, powered by Google Gemini-2.5-flash.
- **Match Summaries**: Auto-generated post-match narrative highlights and turning points.

---

## 🚀 Run Locally

**Prerequisites:** Node.js (v18+)

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Configure Environment**:
   Set `GEMINI_API_KEY` in `.env.local` to your Google Gemini API key.
3. **Run the Vite Dev Server**:
   ```bash
   npm run dev
   ```

View your app in AI Studio: https://ai.studio/apps/be6f84d8-4d96-465e-8cc7-4152884473be

