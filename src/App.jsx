import { ThemeProvider } from "./theme/ThemeContext";
import World from "./components/world/World";
import "./components/explorers/explorers.css";

export default function App() {
  return (
    <ThemeProvider>
      <World />
    </ThemeProvider>
  );
}
