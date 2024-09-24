import React, { useContext, useEffect, useState, memo } from 'react';
import '../../../assets/scss/AccountSettings/branding.scss';
import validator from 'validator';
import Context from '../../../context/context';
import SocialMediaLinksComponent from '../../components/settings/brandsetup/SocialMediaLinks';
import BrandColorComponent from '../../components/settings/brandsetup/BrandColor';
import ClientPortalComponent from '../../components/settings/brandsetup/ClientPortal';
import BrandFontsComponent from '../../components/settings/brandsetup/BrandFonts';

const BrandingSetup = () => {
	// Contexts
	const {
		profileInfo: { tennantSettingsData },
		companyInfo: { updatePrefernces, getTenantPreferences, tenantPreferenceData },
	} = useContext(Context);

	// useStates
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

	// useEffects

	useEffect(() => {
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

	// Functions
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

		setbrandState((prev) => ({
			...prev,
			brandingThemes: json?.brandingThemes,
		}));

		updatePrefernces(json);
	};

	const handleRemoveColorFunc = (selectedColor) => {
		const newBrandColorList = brandState?.brandingThemes.filter(
			(color) => color?.value !== selectedColor,
		);

		const json = {
			brandingThemes: [...newBrandColorList],
		};

		setbrandState((prev) => ({
			...prev,
			brandingThemes: newBrandColorList,
		}));

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
		<div className="brandsetupContainer">
			{/* Social Links */}
			<div className="socialLinkContainer">
				<SocialMediaLinksComponent
					tennantSettingsData={tennantSettingsData}
					brandState={brandState}
					setbrandState={setbrandState}
					handleChange={handleChange}
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
					handleRemoveColorFunc={handleRemoveColorFunc}
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
