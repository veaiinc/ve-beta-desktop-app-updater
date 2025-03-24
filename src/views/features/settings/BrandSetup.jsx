import React, { useContext, useEffect, useState, memo } from 'react';
import '../../../assets/scss/settings/branding.scss';
import validator from 'validator';
import Context from '../../../context/context';
import SocialMediaLinksComponent from '../../components/settings/brandsetup/SocialMediaLinks';
import BrandColorComponent from '../../components/settings/brandsetup/BrandColor';
import ClientPortalComponent from '../../components/settings/brandsetup/ClientPortal';
import BrandFontsComponent from '../../components/settings/brandsetup/BrandFonts';
import { message } from 'antd';

const BrandingSetup = () => {
	// Contexts
	const {
		profileInfo: { tennantSettingsData },
		companyInfo: {
			updatePrefernces,
			getTenantPreferences,
			tenantPreferenceData,
			clientPortalPreferences,
			getClientPortalPreference,
			updateClientPortalPreference,
		},
	} = useContext(Context);

	const [messageApi, contextHolder] = message.useMessage();

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
		brandLogo: '',
		brandingThemes: [],
		themeButtonLoading: false,
		isThemeChange: false,
		clientPortalPreferences: {},
	});

	// useEffects

	useEffect(() => {
		if (!tenantPreferenceData) {
			getTenantPreferences();
		}
		if (!clientPortalPreferences) {
			getClientPortalPreference();
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
				brandLogo: tennantSettingsData?.logo_s3_500w_key || '',
			}));
		}
	}, [tennantSettingsData]);

	useEffect(() => {
		if (clientPortalPreferences) {
			setbrandState((prev) => ({
				...prev,
				clientPortalPreferences: clientPortalPreferences || {},
			}));
		}
	}, [clientPortalPreferences]);

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

	const messageFunction = (type, message) => {
		messageApi.open({
			type,
			content: message,
		});
	};

	// Functions
	const handleSelectedColor = async (selectedColor) => {
		const isAlreadyExist = brandState.brandingThemes.find(
			(item) => item.value === selectedColor,
		);

		if (isAlreadyExist) return;

		const json = {
			brandingThemes: [
				...brandState.brandingThemes,
				{ label: selectedColor, value: selectedColor },
			],
		};

		const response = await updatePrefernces(json);
		if (response[0]) {
			messageFunction('success', 'Brand color is uploaded successfully');
			setbrandState((prev) => ({
				...prev,
				brandingThemes: json?.brandingThemes,
			}));
		} else {
			messageFunction('error', 'Brand color is removed successfully');
		}
	};

	const handleRemoveColorFunc = async (selectedColor) => {
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

		const response = await updatePrefernces(json);
		if (response[0]) {
			messageFunction('success', 'successfully brand color is removed');
		} else {
			messageFunction('error', 'Failed to remove brand color');
		}
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

	const updateSubmitThemeHandler = async (activeId, properties) => {
		if (brandState?.themeButtonLoading) return;

		setbrandState((prev) => ({ ...prev, themeButtonLoading: true }));
		const json = {
			clientPortalPreferences: {
				activeId,
				properties,
			},
		};
		const response = await updateClientPortalPreference(json);
		if (response[0]) {
			messageFunction('success', 'successfully client portal theme is updated');
			setbrandState((prev) => ({ ...prev, isThemeChange: false }));
		} else {
			messageFunction('error', 'Failed to apply the theme');
		}
		setbrandState((prev) => ({ ...prev, themeButtonLoading: false }));
	};

	return (
		<>
			{contextHolder}

			<div className="brandsetupContainer">
				{/* Social Links */}
				<div className="settingsBoxContainer socialLinkContainer">
					<SocialMediaLinksComponent
						tennantSettingsData={tennantSettingsData}
						brandState={brandState}
						setbrandState={setbrandState}
						handleChange={handleChange}
					/>
				</div>

				{/* client portal */}
				{/* <div className="settingsBoxContainer clientPortalContainer">
					<ClientPortalComponent
						brandState={brandState}
						updateSubmitThemeHandler={updateSubmitThemeHandler}
						setbrandState={setbrandState}
					/>
				</div> */}

				{/* Branding color */}
				{/* <div className="settingsBoxContainer brandingContainer">
					<BrandColorComponent
						brandState={brandState}
						setbrandState={setbrandState}
						handleSelectedColor={handleSelectedColor}
						handleRemoveColorFunc={handleRemoveColorFunc}
					/>
				</div> */}

				{/* Brand Fonts */}
				{/* <div className="settingsBoxContainer brandFontContainer">
					<BrandFontsComponent setbrandState={setbrandState} brandState={brandState} />
				</div> */}
			</div>
		</>
	);
};

export default memo(BrandingSetup);
