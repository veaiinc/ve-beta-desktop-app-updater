import React, { useContext, useEffect, useState, memo } from 'react';
import '../../../assets/scss/AccountSettings/branding.scss';
import validator from 'validator';
import Context from '../../../context/context';
import SocialMediaLinksComponent from '../../components/settings/brandsetup/SocialMediaLinks';
import BrandColorComponent from '../../components/settings/brandsetup/BrandColor';
import ClientPortalComponent from '../../components/settings/brandsetup/ClientPortal';
import BrandFontsComponent from '../../components/settings/brandsetup/BrandFonts';

const BrandingSetup = () => {
	const {
		profileInfo: { getTenantSettings, tennantSettingsData, changelogo },
		companyInfo: {
			updatePrefernces,
			getTenantPreferences,
			tenantPreferenceData,
			uploadTenantLogo,
		},
	} = useContext(Context);

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
		brandingThemes: [],
	});

	useEffect(() => {
		// if (!tennantSettingsData) {
		// 	getTenantSettings();
		// }
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
			setLogoUrl(tennantSettingsData?.logo_s3_500w_key || '');
		}
	}, [tennantSettingsData]);

	useEffect(() => {
		if (tenantPreferenceData) {
			setbrandState((prev) => ({
				...prev,
				isEnabled: tenantPreferenceData?.showFooter,
				brandColor: tenantPreferenceData?.brandAccentColor || '#6055EC',
				brandingThemes: tenantPreferenceData?.brandingThemes || [],
			}));
		}
	}, [tenantPreferenceData]);
	const checkUploadLogo = (acceptedFiles) => {
		const file = acceptedFiles[0];
		const reader = new FileReader();

		reader.onloadend = () => {
			setLogoUrl(reader.result);
			changelogo(reader?.result);
		};

		reader.readAsDataURL(file);
		uploadTenantLogo(file);
	};

	const handleSelectedColor = (selectedColor) => {
		const isAlreadyExist = brandState.brandingThemes.find(
			(item) => item.value === selectedColor,
		);

		console.log(brandState.brandingThemes);

		if (isAlreadyExist) return;

		const json = {
			brandingThemes: [
				...brandState.brandingThemes,
				{ label: selectedColor, value: selectedColor },
			],
		};

		console.log(json);

		setbrandState((prev) => ({
			...prev,
			brandingThemes: json?.brandingThemes,
		}));

		updatePrefernces(json);
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
	const handleActivateLogo = () => {
		if (brandState.socialMediaType) {
			setbrandState((prev) => ({
				...prev,
				[`${brandState.socialMediaType}Profile`]: 'active',
			}));
		}
	};

	return (
		<div className="brandsetupContainer">
			{/* Social Links */}
			<div className="socialLinkContainer">
				<SocialMediaLinksComponent
					tennantSettingsData={tennantSettingsData}
					brandState={brandState}
					setbrandState={setbrandState}
					handleChange={handleChange}
					handleActivateLogo={handleActivateLogo}
				/>
			</div>

			{/* client portal */}
			<div className="clientPortalContainer">
				<ClientPortalComponent />
			</div>

			{/* Branding color */}
			<div className="brandingContainer">
				<BrandColorComponent
					brandState={brandState}
					setbrandState={setbrandState}
					handleSelectedColor={handleSelectedColor}
				/>
			</div>

			{/* Brand Fonts */}
			<div className="brandFontContainer">
				<BrandFontsComponent setbrandState={setbrandState} brandState={brandState} />
			</div>
		</div>
	);
};

export default memo(BrandingSetup);
