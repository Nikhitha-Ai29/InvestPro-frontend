import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SplashScreen.css';

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <div className="logo-container">
        <div className="logo">IP</div>
        <h1 className="app-name">InvestPro</h1>
      </div>
    </div>
  );
}

export default SplashScreen;
