import AppRoutes from "./routes/appRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position="bottom-left" reverseOrder={true} />
    </>
  );
}

export default App;
