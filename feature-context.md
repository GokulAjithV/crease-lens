
## Crease-Lens Feature Map

### 🏠 Homepage
- Live match banner (if active) with pulse animation
- Quick action row — Start Match, Score Match, Share Score
- Recent matches feed with result summary + top performer
- Top performers horizontal scroll (leaderboard snapshot)
- AI match summary teaser card (CREASE AI differentiator)
- Empty state for first-time users

### 🏆 Rankings
- Weekly / Monthly / All-time toggle
- Overall / Batting / Bowling / Allrounder category tabs
- Player rank cards with tier badge (Elite, Challenger, Rising, Contender, Rookie)
- Rank movement indicator (↑↓ arrows)
- CREASE Rating score per player

### ➕ Match Setup Flow (4 screens)
**Select Teams:**
- Team A + Team B selector cards
- VS divider
- Continue CTA (disabled until both selected)

**Match Setup:**
- Match type selector (Limited Overs, Box/Turf, Pair Cricket, Test, The Hundred)
- No. of Overs + Overs per Bowler inputs
- Powerplay config
- City/Town with location pin
- Ground name input
- Date & Time picker
- Overflow menu (Take photo, Match delayed, Match abandoned, Walkover, Match rules)

**Toss:**
- Coin flip animation
- Toss winner selection
- Bat or Bowl election

**Playing XI:**
- Squad selection per team
- Captain + Vice Captain assignment

### 🏏 Live Scoring (Core Screen)
**Scorer View:**
- Score header (runs/wickets, overs, RR, target + RRR for 2nd innings)
- Striker card (gold highlight, runs, balls, 4s, 6s, SR)
- Non-striker + Bowler side-by-side row
- This Over ball strip (colored circles — green 4, blue 6, red W)
- Quick actions (Scorecard, Change Bowler, Retire Batsman)
- Run buttons: 0/1/2 top row + 3/4/6 bottom row (colored)
- Extras row (Wide, No Ball, Bye, Leg Bye)
- Wicket button (full width red) + Undo button
- Overs progress bar (top)

**Wicket Sheet:**
- Dismissed batsman shown first
- Wicket type grid (Bowled, Caught, LBW, Run Out, Stumped, Hit Wicket, Retired, Obstructing)
- Fielder details (optional)
- Confirm Wicket CTA

**Change Bowler Sheet:**
- Current over context card
- Bowler eligibility list with overs quota progress bars
- Disabled state for last-over bowler + quota-complete bowler

**Viewer View (Scorecard tab):**
- Batting table (R, B, 4s, 6s, SR)
- Bowling table (O, M, R, W, Econ)
- Commentary tab
- Wagon Wheel tab
- Stats tab
- Current Partnership card

### 📊 Match Summary
- Match result hero (winner, margin, teams, scores)
- Player of the Match card (gold glow)
- Summary tab (innings highlights, match stats row)
- Top Performers tab (Batting/Bowling/Fielding sub-tabs with ranked list)
- CREASE AI tab (match story, turning point, player insights)
- Share Scorecard + Back to Home sticky bottom

### 👤 Player Profile
- Player hero card (avatar, team, role badges, CREASE Rating)
- Quick stats row (Matches, Runs, Wickets, Catches)
- Batting tab (stats grid, recent form strip, performance bars vs pace/spin/powerplay/death)
- Bowling tab
- Match History tab (result + batting + bowling per match, MOM badge)
- CREASE AI insight card

### 🤖 CREASE AI (cross-cutting feature)
- Match summary generation
- Turning point detection
- Player strength/weakness analysis
- Batting style insight (vs pace, vs spin)
- Match report shareable card

***

## Database Design — Start Here

Given this feature map, you need **8 core tables**:

```
users
teams
team_players (junction)
matches
innings
overs
balls
player_match_stats (computed cache)
```

Want me to generate the **complete PostgreSQL schema** with all columns, relationships, indexes, and constraints for these 8 tables right now? That's your backend Day 1 foundation — everything else (APIs, WebSockets, AI) plugs into it.