import AStarVisualizer from "./components/AStarVisualizer";
import Node from "./components/Node";
import "./App.css";
import Header from "./components/Header";

function App() {
  return (
    <div className="main bg-white min-h-[50rem]">
      <Header />

      <AStarVisualizer />
    </div>
  );
}

export default App;
