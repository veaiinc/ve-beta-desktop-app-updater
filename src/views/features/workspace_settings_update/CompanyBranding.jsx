import React, { useContext, useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import ToggleSlider from '../../components/input/slider';
import '../../../assets/scss/CompanySettings/branding.scss';
import ReusableButtonSettings from '../workspace_settings/ReusableButtonSettings';
import { ReactComponent as InstagramLogoColorless } from '../../../assets/svg/workspaceSettings/InstagramLogoColorless.svg';
import { ReactComponent as FacebookLogoColorless } from '../../../assets/svg/workspaceSettings/FacebookLogoColorless.svg';
import { ReactComponent as PinterestLogoColorless } from '../../../assets/svg/workspaceSettings/PinterestLogoColorless.svg';
import { ReactComponent as YouTubeLogoColorless } from '../../../assets/svg/workspaceSettings/YouTubeLogoColorless.svg';
import { ReactComponent as LinkedinLogoColorless } from '../../../assets/svg/workspaceSettings/LinkedinLogoColorless.svg';
import { ReactComponent as TiktokLogoColorless } from '../../../assets/svg/workspaceSettings/TiktokLogoColorless.svg';
import { ReactComponent as SpotifyLogoColorless } from '../../../assets/svg/workspaceSettings/SpotifyLogoColorless.svg';
import { ReactComponent as BehanceLogoColorless } from '../../../assets/svg/workspaceSettings/BehanceLogoColorless.svg';
import { ReactComponent as TelegramLogoColorless } from '../../../assets/svg/workspaceSettings/TelegramLogoColorless.svg';
import { ReactComponent as DribbbleLogoColorless } from '../../../assets/svg/workspaceSettings/DribbbleLogoColorless.svg';
import CompanySocialMediaPopup from '../workspace_settings/CompanySocialMediaPopup';
import CompanyBrandingPopup from '../workspace_settings/CompanyBrandingPopup';
import CompanyFontPopup from '../workspace_settings/CompanyFontPopup';
import validator from 'validator';
import Context from '../../../context/context';

const CompanyBranding = () => {
	const {
		profileInfo: { getTenantSettings, tennantSettingsData },
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
		isEnabled: false,
		brandingPopup: false,
		fontPopup: false,
	});

	const logos = [
		{ name: 'instagram', component: <InstagramLogoColorless /> },
		{ name: 'facebook', component: <FacebookLogoColorless /> },
		{ name: 'pinterest', component: <PinterestLogoColorless /> },
		{ name: 'youtube', component: <YouTubeLogoColorless /> },
		{ name: 'linkedin', component: <LinkedinLogoColorless /> },
		{ name: 'tikton', component: <TiktokLogoColorless /> },
		{ name: 'spotify', component: <SpotifyLogoColorless /> },
		{ name: 'behance', component: <BehanceLogoColorless /> },
		{ name: 'telegram', component: <TelegramLogoColorless /> },
		{ name: 'steam', component: <DribbbleLogoColorless /> },
	];
	useEffect(() => {
		getTenantSettings();
	}, []);
	useEffect(() => {
		if (tennantSettingsData) {
			setbrandState((prev) => ({
				...prev,
				instagramProfile: tennantSettingsData?.instagramProfile || '',
				facebookProfile: tennantSettingsData?.facebookProfile || '',
				pinterestProfile: tennantSettingsData?.pinterestProfile || '',
				linkedinProfile: tennantSettingsData?.linkedinProfile || '',
				tiktonProfile: tennantSettingsData?.tiktonProfile || '',
				spotifyProfile: tennantSettingsData?.spotifyProfile || '',
				behanceProfile: tennantSettingsData?.behanceProfile || '',
				telegramProfile: tennantSettingsData?.telegramProfile || '',
				steamProfile: tennantSettingsData?.steamProfile || '',
			}));
		}
	}, [tennantSettingsData]);
	const checkUploadLogo = (acceptedFiles) => {
		// Your upload logic here
		const file = acceptedFiles[0];
		const reader = new FileReader();
		reader.onloadend = () => {
			setLogoUrl(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const handleDrop = (acceptedFiles) => {
		setFile(acceptedFiles[0]);
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
						<div className="circleColor"></div>
						<p className="hashColor">#111111</p>
					</div>
					<ReusableButtonSettings
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
				<div className="logosWrapper">
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
								{logo.component}
							</div>
						))}
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
					<ToggleSlider
						onChange={() =>
							setbrandState((prev) => ({
								...prev,
								isEnabled: !prev.isEnabled,
							}))
						}
					/>
					<p>Enabled</p>
				</div>
			</div>
			{brandState.brandingMediaPopup && (
				<CompanySocialMediaPopup
					handleClose={() =>
						setbrandState((prev) => ({
							...prev,
							brandingMediaPopup: false,
						}))
					}
					show={brandState.brandingMediaPopup}
					modalType={'center'}
					logo={brandState.socialMediaType}
					name={brandState.socialMediaType + 'Profile'}
					onChangeFunc={handleChange}
					value={brandState[brandState.socialMediaType + 'Profile']}
				/>
			)}
			{brandState.brandingPopup && (
				<CompanyBrandingPopup
					handleClose={() => setbrandState((prev) => ({ ...prev, brandingPopup: false }))}
					show={brandState.brandingPopup}
					modalType={'center'}
				/>
			)}
			{brandState.fontPopup && (
				<CompanyFontPopup
					handleClose={() => setbrandState((prev) => ({ ...prev, fontPopup: false }))}
					show={brandState.fontPopup}
					modalType={'center'}
				/>
			)}
		</div>
	);
};

export default CompanyBranding;
