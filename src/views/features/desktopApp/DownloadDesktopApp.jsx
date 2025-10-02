import { memo, useState } from 'react';
import '../../../assets/scss/desktopApp/index.scss';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';
const desktopAppDownloadUrl = import.meta.env.VITE_APP_DESKTOP_APP_DOWNLOAD_URL || null;
import DownloadVeAppPopup from '../../components/desktopApp/DownloadVeAppPopup';
import { ReactComponent as DownloadMacSvg } from '../../components/topNavbar/assets/download-mac.svg';
import { useNavigate } from 'react-router-dom';

const DesktopApp = () => {
	const navigate = useNavigate();
	const [showDownloadVeAppPopup, setShowDownloadVeAppPopup] = useState(false);

	const handleDownload = () => {
		window.open(desktopAppDownloadUrl, '_blank');
		setShowDownloadVeAppPopup(true);
	};
	return (
		<div className="desktop-app-page">
			<div className="desktop-app-container">
				{/* Navbar */}
				<div className="navbar">
					<div className="navbar-content">
						<VeLogo
							className="logo"
							onClick={() => navigate('/')}
							style={{ cursor: 'pointer' }}
						/>
					</div>
				</div>

				{/* Main Content */}
				<div className="main-content">
					<div className="content-wrapper">
						{/* Title Section */}
						<div className="title-section">
							<h1 className="main-title">Thank you for Registering</h1>
							<p className="subtitle">
								Currently we are available for MAC OS ( M1 and later )
							</p>
						</div>

						{/* Download Button */}
						<div className="download-section">
							<button className="download-button" onClick={handleDownload}>
								<div className="button-content">
									<DownloadMacSvg
										className="mac-icon"
										color="var(--primary-button)"
									/>
									<span className="button-text">Download for Mac</span>
								</div>
							</button>
						</div>
					</div>
				</div>
			</div>
			<DownloadVeAppPopup
				isOpen={showDownloadVeAppPopup}
				closeModal={() => setShowDownloadVeAppPopup(false)}
				downloadUrl={desktopAppDownloadUrl}
			/>
		</div>
	);
};

export default memo(DesktopApp);
