export const mockData = {
  mvps: [
    { id: 1, name: "Virat K.", initials: "VK", role: "Batter", points: 85, matches: 3, rank: 1 },
    { id: 2, name: "Rashid K.", initials: "RK", role: "Bowler", points: 72, matches: 3, rank: 2 },
    { id: 3, name: "MS Dhoni", initials: "MD", role: "Wicket Keeper", points: 68, matches: 2, rank: 3 }
  ],
  recentBattles: [
    {
      id: 101,
      teamA: { name: "Royal Challengers", shortName: "RCB", score: "185/4", overs: "20.0" },
      teamB: { name: "Mumbai Indians", shortName: "MI", score: "181/7", overs: "20.0" },
      result: "RCB won by 4 runs",
      date: "Today",
      status: "COMPLETED"
    },
    {
      id: 102,
      teamA: { name: "Chennai Super Kings", shortName: "CSK", score: "210/3", overs: "20.0" },
      teamB: { name: "Gujarat Titans", shortName: "GT", score: "195/8", overs: "20.0" },
      result: "CSK won by 15 runs",
      date: "Yesterday",
      status: "COMPLETED"
    }
  ],
  liveMatches: [
    {
      id: 201,
      teamA: { name: "Delhi Capitals", shortName: "DC", score: "145/2", overs: "15.2" },
      teamB: { name: "Sunrisers Hyderabad", shortName: "SRH", score: "0/0", overs: "0.0" },
      result: "DC opted to bat",
      status: "LIVE"
    }
  ],
  aiInsight: "RCB's middle order looks vulnerable against spin. Recommending bringing on early slow bowlers in the next match."
};
