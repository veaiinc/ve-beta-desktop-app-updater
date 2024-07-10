import React, { useContext, useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import ToggleSlider from '../../components/input/slider';
import '../../../assets/scss/CompanySettings/branding.scss';
import ReusableButtonSettings from '../workspace_settings/ReusableButtonSettings';
import InstagramLogoColorless from '../../../assets/svg/workspaceSettings/InstagramLogoColorless.svg';
import FacebookLogoColorless from '../../../assets/svg/workspaceSettings/FacebookLogoColorless.svg';
import PinterestLogoColorless from '../../../assets/svg/workspaceSettings/PinterestLogoColorless.svg';
import YouTubeLogoColorless from '../../../assets/svg/workspaceSettings/YouTubeLogoColorless.svg';
import LinkedinLogoColorless from '../../../assets/svg/workspaceSettings/LinkedinLogoColorless.svg';
import TiktokLogoColorless from '../../../assets/svg/workspaceSettings/TiktokLogoColorless.svg';
import SpotifyLogoColorless from '../../../assets/svg/workspaceSettings/SpotifyLogoColorless.svg';
import BehanceLogoColorless from '../../../assets/svg/workspaceSettings/BehanceLogoColorless.svg';
import TelegramLogoColorless from '../../../assets/svg/workspaceSettings/TelegramLogoColorless.svg';
import DribbbleLogoColorless from '../../../assets/svg/workspaceSettings/DribbbleLogoColorless.svg';
// import CompanySocialMediaPopup from '../workspace_settings/CompanySocialMediaPopup';
import SocialMediaPopup from './SocialMediaPopup';
// import CompanyBrandingPopup from '../workspace_settings/CompanyBrandingPopup';
import BrandingColorPopUp from './BrandingColorPopup';
// import CompanyFontPopup from '../workspace_settings/CompanyFontPopup';
import ChangeFontPopup from './ChangeFontPopup';
import ActiveYoutube from '../../../assets/images/companySettings/activeYoutube.png';
import BehanceActive from '../../../assets/images/companySettings/behanceActive.png';
import DribbbleLogoactive from '../../../assets/images/companySettings/dribbbleLogoactive.png';
import FacebookActive from '../../../assets/images/companySettings/facebookActive.png';
import InstagramActive from '../../../assets/images/companySettings/instagramActive.png';
import LinkedInActive from '../../../assets/images/companySettings/linkedInActive.png';
import PinterestActive from '../../../assets/images/companySettings/pinterestActive.png';
import TelegramActive from '../../../assets/images/companySettings/telegramActive.png';
import TiktokActive from '../../../assets/svg/workspaceSettings/activeTiktok.svg';
import ActiveSpotify from '../../../assets/svg/workspaceSettings/activeSpotify.svg';
import validator from 'validator';
import Context from '../../../context/context';

const CompanyBranding = () => {
	const {
		profileInfo: { getTenantSettings, tennantSettingsData },
		companyInfo: {
			updatePrefernces,
			getTenantPreferences,
			tenantPreferenceData,
			uploadTenantLogo,
		},
	} = useContext(Context);
	const [file, setFile] = useState(null);
	const [isAdmin, setIsAdmin] = useState(true); // Set this based on your logic
	const [logoUrl, setLogoUrl] = useState('');
	const [brandState, setbrandState] = useState({
		brandingMediaPopup: false,
		socialMediaType: '',
		instagramProfile: '',
		facebookProfile: '',
		pinterestProfile: '',
		linkedinProfile: '',
		tiktonProfile: '',
		spotifyProfile: '',
		behanceProfile: '',
		telegramProfile: '',
		steamProfile: '',
		youtubeProfile: '',
		isEnabled: false,
		brandingPopup: false,
		fontPopup: false,
		brandColor: '',
	});

	const logos = [
		{ name: 'instagram', component: InstagramLogoColorless },
		{ name: 'facebook', component: FacebookLogoColorless },
		{ name: 'pinterest', component: PinterestLogoColorless },
		{ name: 'youtube', component: YouTubeLogoColorless },
		{ name: 'linkedIn', component: LinkedinLogoColorless },
		{ name: 'tiktok', component: TiktokLogoColorless },
		{ name: 'spotify', component: SpotifyLogoColorless },
		{ name: 'behance', component: BehanceLogoColorless },
		{ name: 'telegram', component: TelegramLogoColorless },
		{ name: 'steam', component: DribbbleLogoColorless },
	];

	const activeLogo = [
		{ name: 'instagramProfile', component: InstagramActive },
		{ name: 'facebookProfile', component: FacebookActive },
		{ name: 'pinterestProfile', component: PinterestActive },
		{ name: 'youtubeProfile', component: ActiveYoutube },
		{ name: 'linkedInProfile', component: LinkedInActive },
		{ name: 'tiktokProfile', component: TiktokActive },
		{ name: 'spotifyProfile', component: ActiveSpotify },
		{ name: 'behanceProfile', component: BehanceActive },
		{ name: 'telegramProfile', component: TelegramActive },
		{ name: 'steamProfile', component: DribbbleLogoactive },
	];

	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		}
		if (!tenantPreferenceData) {
			getTenantPreferences();
		}
	}, []);
	useEffect(() => {
		if (tennantSettingsData) {
			setbrandState((prev) => ({
				...prev,
				instagramProfile:
					tennantSettingsData?.instagramProfile || 'https://www.instagram.com/',
				facebookProfile:
					tennantSettingsData?.facebookProfile || 'https://www.facebook.com/',
				pinterestProfile:
					tennantSettingsData?.pinterestProfile || 'https://in.pinterest.com/',
				linkedInProfile: tennantSettingsData?.linkedInProfile || 'https://in.linkedin.com/',
				tiktokProfile: tennantSettingsData?.tiktokProfile || 'https://www.tiktok.com/',
				spotifyProfile: tennantSettingsData?.spotifyProfile || 'https://www.spotify.com/',
				behanceProfile: tennantSettingsData?.behanceProfile || '',
				telegramProfile: tennantSettingsData?.telegramProfile || 'https://telegram.org/',
				steamProfile: tennantSettingsData?.steamProfile || '',
				youtubeProfile: tennantSettingsData?.youtubeProfile || 'https://www.youtube.com/',
			}));
		}
		if (tenantPreferenceData) {
			setbrandState((prev) => ({
				...prev,
				isEnabled: tenantPreferenceData?.showFooter,
				brandColor: tenantPreferenceData?.brandAccentColor || '#6055EC',
			}));
		}
	}, [tennantSettingsData, tenantPreferenceData]);
	const checkUploadLogo = (acceptedFiles) => {
		// Your upload logic here
		const file = acceptedFiles[0];
		const reader = new FileReader();
		reader.onloadend = () => {
			setLogoUrl(reader.result);
			uploadTenantLogo(file[0]);
		};
		reader.readAsDataURL(file);
	};

	const handleDrop = (acceptedFiles) => {
		setFile(acceptedFiles[0]);
	};
	const handleSelectedColor = (selectedColor) => {
		setbrandState((prev) => ({
			...prev,
			brandColor: selectedColor,
		}));
	};

	const handleToggleChange = (e) => {
		setbrandState((prev) => ({
			...prev,
			isEnabled: !prev.isEnabled,
		}));
		let json = {
			showFooter: e,
		};
		updatePrefernces(json);
	};
	const handleChange = async (e) => {
		const { name, value } = e.target;

		setbrandState((prevState) => ({
			...prevState,
			[name]: value,
		}));
		const isWebsiteValid = validator.isURL(value, { require_protocol: true });
		if (!isWebsiteValid) {
			return [false, 'Invalid Website! Example Format: https://example.com'];
		}
		return [true];
	};
	return (
		<div className="brandingMainContainer">
			{/* logo */}
			<div className="logoMainContainer">
				<div className="logoTextContainer">
					<h1>Logo</h1>
					<p>
						Your logo will automatically display in your emails and pages. We recommend
						a .PNG file with transparency to ensure it looks great on all backgrounds.
					</p>
				</div>

				{isAdmin && logoUrl ? (
					<Dropzone
						onDrop={checkUploadLogo}
						accept={'image/png'}
						multiple={false}
						disabled={!isAdmin}
					>
						{({ getRootProps, getInputProps }) => (
							<div
								className="upload-brand-embeded-btn"
								{...getRootProps()}
								style={{ cursor: !isAdmin ? 'not-allowed' : '' }}
							>
								<input {...getInputProps()} />
								<div className="upload-brand-container-new">
									<div className="upload-brand-logo">
										<img src={logoUrl} alt="Logo" />
									</div>
								</div>
							</div>
						)}
					</Dropzone>
				) : (
					<Dropzone
						onDrop={checkUploadLogo}
						accept={'image/png'}
						multiple={false}
						disabled={!isAdmin}
					>
						{({ getRootProps, getInputProps }) => (
							<div
								className="upload-brand-embeded-btn"
								{...getRootProps()}
								style={{ cursor: !isAdmin ? 'not-allowed' : '' }}
							>
								<input {...getInputProps()} />
								<div className="upload-brand-placeholder">
									<input
										type="file"
										style={{
											opacity: 0,
											position: 'absolute',
											top: 0,
											left: 0,
											width: '100%',
											height: '100%',
											cursor: 'pointer',
										}}
									/>
									<span>📎 Click or Drag to upload</span>
								</div>
							</div>
						)}
					</Dropzone>
				)}
			</div>
			{/* Branding */}
			<div className="brandingContainer">
				<div className="brandingTextContainer">
					<h1>Branding</h1>
					<p>These colours will be available as your accent colour</p>
				</div>
				<div className="brandColorContainer">
					<div className="chooseBrandColor">
						<div
							className="circleColor"
							style={{ background: `${brandState?.brandColor}` }}
						></div>
						<p className="hashColor">{brandState?.brandColor}</p>
					</div>
					<ReusableButtonSettings
						className="reuseableButton"
						text={'Change'}
						func={() => setbrandState((prev) => ({ ...prev, brandingPopup: true }))}
					/>
				</div>
			</div>
			{/* Brand Fonts */}
			<div className="brandFontContainer">
				<div className="brandTextContainer">
					<h1>Brand Fonts</h1>
					<p>
						These fonts will be available in your font picker. You can access them while
						editing your email layout blocks, forms, and checkouts.
					</p>
				</div>
				<ReusableButtonSettings
					text={'Add New Font'}
					func={() => setbrandState((prev) => ({ ...prev, fontPopup: true }))}
				/>
			</div>
			{/* Social Links */}
			<div className="socialLinkContainer">
				<div className="socialLinkTextContainer">
					<h1>Social Links</h1>
					<p>Icons in your emails will automatically link to these URLs</p>
				</div>
				{/* <div className="logosWrapper">
					{logos &&
						logos.map((logo, index) => (
							<div
								className="logoContainer"
								key={index}
								onClick={() => {
									setbrandState((prev) => ({
										...prev,
										brandingMediaPopup: true,
										socialMediaType: logo.name,
									}));
								}}
							>
								<img src={logo.component} alt="logo" />
							</div>
						))}
				</div> */}
				<div className="logosWrapper">
					{logos.map((logo, index) => {
						const isActive =
							tennantSettingsData?.[`${logo.name}Profile`] &&
							tennantSettingsData[`${logo.name}Profile`].length > 0
								? true
								: false;

						const activeLogoComponent = activeLogo.find(
							(activeLogoItem) => activeLogoItem.name === `${logo.name}Profile`,
						)?.component;

						const logoToDisplay = isActive ? activeLogoComponent : logo.component;

						return (
							<div
								className="logoContainer"
								key={index}
								onClick={() => {
									setbrandState((prev) => ({
										...prev,
										brandingMediaPopup: true,
										socialMediaType: logo.name,
									}));
								}}
							>
								<img src={logoToDisplay} alt="logo" />
							</div>
						);
					})}
				</div>
			</div>
			{/* Made with love in VE footer */}
			<div className="footerContainer">
				<div className="footerTextContainer">
					<h1>Made with love in VE footer</h1>
					<p>
						This footer automatically links to your unique referral sign-up link so you
						get paid for anyone who signs up through your emails, full page forms, and
						checkouts. You can hide this footer with any paid plan
					</p>
				</div>
				<div className="footerToggle ">
					<ToggleSlider onChange={handleToggleChange} value={brandState?.isEnabled} />
					<p>Enabled</p>
				</div>
			</div>
			{brandState.brandingMediaPopup && (
				<SocialMediaPopup
					handleClose={() =>
						setbrandState((prev) => ({
							...prev,
							brandingMediaPopup: false,
						}))
					}
					show={brandState.brandingMediaPopup}
					logo={brandState.socialMediaType}
					name={brandState.socialMediaType + 'Profile'}
					onChangeFunc={handleChange}
					value={brandState?.[brandState.socialMediaType + 'Profile']}
				/>
			)}
			{brandState.brandingPopup && (
				<BrandingColorPopUp
					handleClose={() => setbrandState((prev) => ({ ...prev, brandingPopup: false }))}
					show={brandState.brandingPopup}
					value={brandState.brandColor}
					selectedColor={handleSelectedColor}
				/>
			)}
			{brandState.fontPopup && (
				<ChangeFontPopup
					handleClose={() => setbrandState((prev) => ({ ...prev, fontPopup: false }))}
					show={brandState.fontPopup}
				/>
			)}
		</div>
	);
};

export default CompanyBranding;
