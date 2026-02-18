import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Intro from "./pages/Intro";
import Register from "./pages/Register";
import CodeEditor from "./pages/CodeEditor";
import ProtectedRouter from "./middleWare/ProtectedRouter";


const App = () => {
  return (
    <Router>
      <Routes>

        {/* 🔰 Intro Page */}
        <Route path="/" element={<Intro />} />

        {/* 🧾 Register Page */}
        <Route path="/register" element={<Register />} />

        {/* 🧾 Register with Room ID */}
        <Route path="/:roomId" element={<Register />} />

        {/* 💻 Code Editor (Protected) */}
        <Route
          path="/code/:roomId"
          element={
            <ProtectedRouter>
              <CodeEditor />
            </ProtectedRouter>
          }
        />

      </Routes>
    </Router>
  );
};

export default App;
