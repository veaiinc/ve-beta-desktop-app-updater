// src/pages/LandingPage.jsx
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Context from '../../../context/context';
import TabNavigation from '../../components/landing_screen/TabNavigation';
import Tagline from './Tagline';
import Footer from './Footer';
import ChatBox from '../../components/chat/ChatBox';
import Suggestions from '../homePage/Suggestions';
import MobileMenu from '../../components/landing_screen/MobileMenu';
import ContactUs from '../../components/landing_screen/ContactUs';
import OurMission from './OurMission';
import EarlyAccess from './EarlyAccess';
import WebsitePricingPage from '../pricingPlans/PricingPageWebsite';

import { ReactComponent as MenuIcon } from '../../../assets/svg/menu.svg';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';
import { ReactComponent as PlayIcon } from './assets/playIcon.svg';
import { ReactComponent as PauseIcon } from './assets/pauseIcon.svg';

import '../../../assets/scss/landingScreen/index.scss';
import CustomToast from '../../components/globalComponents/CustomToast';

const pathToTabMap = {
  '/': 0,            // ← added
  '/thebridge': 1,
  '/contact-us': 2,
  '/pricing': 3,
  '/careers': 4,
  '/forefront': 5,
};

const LandingPage = () => {
  const {
    templates: { updateStateValues, currentSessionId },
  } = useContext(Context);

  const navigate = useNavigate();
  const location = useLocation();

  const [tab, setTab] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const isMobileScreen = window.innerWidth < 768;

  // sync tab with URL
  useEffect(() => {
    const path = location.pathname;
    // fallback to 0 if path not in map
    setTab(pathToTabMap[path] ?? 0);
  }, [location.pathname]);

  // redirect if onboarded
  useEffect(() => {
    const token = localStorage.getItem('usertoken');
    const region = localStorage.getItem('region');
    const workspaceId = localStorage.getItem('workspaceId');
    const isOnboard = JSON.parse(localStorage.getItem('isOnboard') || 'false');

    if (token && region && workspaceId) {
      if (!isOnboard) return navigate('/early-access');
      return navigate('/home');
    }
  }, [navigate]);

  // play/pause handler
  const handleVideoClick = async () => {
    const video = document.getElementById('landing-video');
    if (!video) return;
    try {
      if (video.paused) {
        await video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
      setHasPlayed(true);
    } catch (err) {
      console.error('Video play failed:', err);
    }
  };

  // chat send
  const handleCustomOnSendFunction = useCallback(
    (data) => {
      updateStateValues({ activePayloadForChat: data });
      navigate(`/c/${currentSessionId}`);
      setShowSuggestions(false);
    },
    [currentSessionId, updateStateValues, navigate],
  );

  const handleSetTab = (tabVal) => {
    setTab(tabVal);
    const tabRoutes = ['/', '/thebridge', '/contact-us', '/pricing'];
    navigate(tabRoutes[tabVal]);
  };

  const tabComponents = {
    0: (
      <div className="page-body">
        <div className={`title-container${showSuggestions ? ' with-suggestions' : ''}`}>
          <div className="title-text">
            <div className="title-text-container">
              <span className="title-one">The World's First</span>
              <span className="title-two">Ambient AI</span>
            </div>
            <p className="title-three">
              Your Living Memory Intelligence — built to think, remember, and act.
            </p>
          </div>

          <div className="chatbox-container">
            <ChatBox
              customChatActions
              autoFocus={false}
              isPublicChat
              animatePlaceholder
              onSend={handleCustomOnSendFunction}
              isBuildEnbled={false}
              showUpgradeSubscriptionBtn={false}
            />
          </div>
          {showSuggestions && (
            <div className="suggestions-container">
              <Suggestions landingPage />
            </div>
          )}
        </div>

        <div className={`videoContainer ${hasPlayed ? 'played' : 'unplayed'}`}>
          <button onClick={handleVideoClick}>
            {isPlaying ? (
              <>
                <PauseIcon /> Pause
              </>
            ) : (
              <>
                <PlayIcon /> Play
              </>
            )}
          </button>
          <video
            id="landing-video"
            src="https://ap.images.ve.ai/public/dashboard/login_page.mp4"
            muted
            style={{ width: '100%' }}
            controls={isMobileScreen}
            controlsList="nofullscreen nodownload noremoteplayback noplaybackrate foobar"
            autoPlay={isMobileScreen}
          />
        </div>

        <Tagline />
        <EarlyAccess />
        <Footer />
      </div>
    ),
    1: <OurMission tab={tab} />,
    2: <ContactUs type="Enterprise" />,
    3: <WebsitePricingPage />,
    4: <OurMission tab={tab} />,
    5: <OurMission tab={tab} />,
  };

  return (
    <>
      <Helmet>
        <title>Ve - The World's First Ambient AI OS</title>
      </Helmet>
      <main
        className={`landing-page-container${
          location.pathname === '/thebridge' ? ' fullHeight' : ''
        }`}
      >
        <header className="page-header">
          <div className="page-header-wrapper">
            <div className="left-container">
              <VeLogo className="ve-logo" onClick={() => navigate('/')} />
            </div>
            <div className="middle-container">
              {!mobileMenuOpen && (
                <TabNavigation tab={tab} handleSetTab={handleSetTab} />
              )}
            </div>
            <div className="right-container">
              <Link className="login-btn-text hide-on-mobile" to="/verify-user">
                Login
              </Link>
              <div className="login-container">
                <button
                  className="login-btn"
                  onClick={() => navigate('/verify-user')}
                >
                  Get VE Free
                </button>
                <button
                  className="sidebar-button mobile-only"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <MenuIcon />
                </button>
              </div>
            </div>
          </div>
          <MobileMenu
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            onLogin={() => navigate('/verify-user')}
            onGetFree={() => {}}
          />
        </header>
        {tabComponents[tab]}
      </main>
    </>
  );
};

export default memo(LandingPage);
