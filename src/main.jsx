
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from "./context/AuthProvider";  // Import the AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>  {/* Wrapping the app here makes `user` available everywhere */}
    <App />
  </AuthProvider>
);