import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Pages
import Homepage from './pages/Homepage'
import Rankings from './pages/Rankings'
import StartMatch from './pages/StartMatch'
import SelectTeam from './pages/SelectTeam'
import AddTeam from './pages/AddTeam'
import AddPlayers from './pages/AddPlayers'
import AddViaPhone from './pages/AddViaPhone'
import AddFromContacts from './pages/AddFromContacts'
import Toss from './pages/Toss'
import PlayingXI from './pages/PlayingXI'
import LiveScoring from './pages/LiveScoring'
import LiveScorecard from './pages/LiveScorecard'
import MatchSummary from './pages/MatchSummary'
import PlayerProfile from './pages/PlayerProfile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Core */}
        <Route path="/" element={<Homepage />} />
        <Route path="/rankings" element={<Rankings />} />

        {/* Match Setup Flow */}
        <Route path="/match/new" element={<StartMatch />} />
        <Route path="/match/select-team" element={<SelectTeam />} />
        <Route path="/match/:matchId/toss" element={<Toss />} />
        <Route path="/match/:matchId/playing-xi/:teamId" element={<PlayingXI />} />
        <Route path="/match/:matchId/scoring" element={<LiveScoring />} />
        <Route path="/match/:matchId/scorecard" element={<LiveScorecard />} />
        <Route path="/match/:matchId/summary" element={<MatchSummary />} />

        {/* Team Management Flow */}
        <Route path="/team/add" element={<AddTeam />} />
        <Route path="/team/:teamId/players" element={<AddPlayers />} />
        <Route path="/team/:teamId/players/phone" element={<AddViaPhone />} />
        <Route path="/team/:teamId/players/contacts" element={<AddFromContacts />} />

        {/* Player */}
        <Route path="/player/:playerId" element={<PlayerProfile />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}