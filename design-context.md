# CREASE
```
Crease is a grassroots cricket scoring mobile first web application, which leverages AI for better UX with match score prediction, summary and RAG based insights.
```

## Features

### Tabs

1. Home Page
    - The homepage has two user types: scorer (wants to start a match fast) and fan/viewer (wants to check live or recent scores). Both must be served within 3 seconds of opening the app.

    - Homepage Structure (Priority Order)
        1. Live Match Banner (if active) — Full width, top
            - This is the #1 most important element. If a match is live, it dominates the top section:
            - Live indicator (🔴 LIVE pulse animation)
            - Team A vs Team B with current score
            - Current batsman + bowler stat line
            - "Watch Live" CTA → opens full scorecard

        2. Quick Action Row — Right below live banner
            - Three tappable cards, full-width on mobile:
            - Start Match — primary CTA, teal accent, always visible
            - Score Match — for the scorer role, opens scoring screen
            - Share Score — deep-link to share live match with family

        3. Recent Matches Feed — Card list
            - Your "social proof" section. Each card shows:
            - Match result summary (Team A beat Team B by X runs)
            - Top performer highlight ("Gokul smashed 67* off 42 balls")
            - Date + ground name
            - Tap to view full scorecard

        4. Top Performers — Horizontal scroll strip
            - Leaderboard snapshot: most runs this month, most wickets. Tappable player cards with their avatar + key stat. This is the "ego hook" — players keep coming back to see their rank.

        5. AI Match Summary Teaser — One card
            - One recent match with your AI-generated summary ("Crease AI: Gokul's innings turned the match in the 12th over…"). This is your key differentiator from CricHeroes — show it on the homepage.

    - Progressive Disclosure Rule
        - Before first match: Show only "Start your first match" hero + 3-sentence explainer. Clean, zero clutter.
        - After first match: Full homepage unlocks with all the above sections. 