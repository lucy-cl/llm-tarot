import { useRoutes } from "react-router-dom";
import routeConfig from "@/router/index";
import "./App.css";
function App() {
  const children = useRoutes(routeConfig);
  return children;
}

export default App;
