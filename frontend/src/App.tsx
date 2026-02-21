import "./App.css";
import Game_component from "./OneGameContent/components/Game"
import MainRoom from "./allMainPage/components/mainPage"
import { Routes, Route } from 'react-router-dom'
import GameWaitingRoom from "./p2pGameRoom/Room"

export default function Game() {
  return (
    <Routes>
      <Route path="main" element={<MainRoom/>} />
      <Route path="game" element={<div className="main"><Game_component/></div>} />
      <Route path="gameroom/:roomId" element={<div className="main"><GameWaitingRoom/></div>} />
    </Routes>
  );
}
