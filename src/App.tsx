import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Pages
import Homepage from './pages/Homepage'
import Rankings from './pages/Rankings'
import StartMatch from './pages/StartMatch'
import SelectTeam from './pages/SelectTeam'
import AddTeam from './pages/AddTeam'
import ManageTeams from './pages/ManageTeams'
import EditTeam from './pages/EditTeam'
import AddPlayers from './pages/AddPlayers'
import AddViaPhone from './pages/AddViaPhone'
import AddFromContacts from './pages/AddFromContacts'
import AddGuestPlayer from './pages/AddGuestPlayer'
import JoinTeam from './pages/JoinTeam'
import Toss from './pages/Toss'
import PlayingXI from './pages/PlayingXI'
import LiveScoring from './pages/LiveScoring'
import LiveScorecard from './pages/LiveScorecard'
import MatchSummary from './pages/MatchSummary'
import PlayerProfile from './pages/PlayerProfile'
import MatchHistory from './pages/MatchHistory'
import Login from './pages/Login'
import Register from './pages/Register'
import ScoutingHub from './pages/ScoutingHub'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Core */}
        <Route path="/home" element={<Homepage />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/matches" element={<MatchHistory />} />

        {/* Match Setup Flow */}
        <Route path="/match/new" element={<StartMatch />} />
        <Route path="/match/select-team" element={<SelectTeam />} />
        <Route path="/match/:matchId/toss" element={<Toss />} />
        <Route path="/match/:matchId/playing-xi/:teamId" element={<PlayingXI />} />
        <Route path="/match/:matchId/scoring" element={<LiveScoring />} />
        <Route path="/match/:matchId/scorecard" element={<LiveScorecard />} />
        <Route path="/match/:matchId/summary" element={<MatchSummary />} />

        {/* Team Management Flow */}
        <Route path="/teams" element={<ManageTeams />} />
        <Route path="/team/add" element={<AddTeam />} />
        <Route path="/team/:teamId/edit" element={<EditTeam />} />
        <Route path="/team/:teamId/players" element={<AddPlayers />} />
        <Route path="/join/:token" element={<JoinTeam />} />
        <Route path="/team/:teamId/players/phone" element={<AddViaPhone />} />
        <Route path="/team/:teamId/players/contacts" element={<AddFromContacts />} />
        <Route path="/team/:teamId/players/guest" element={<AddGuestPlayer />} />

        {/* Player */}
        <Route path="/player/:playerId" element={<PlayerProfile />} />
        <Route path="/scouting" element={<ScoutingHub />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}