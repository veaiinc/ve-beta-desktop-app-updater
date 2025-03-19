import React, { useState, memo } from 'react';
import InstagramLogoColorless from '../../../../assets/svg/workspaceSettings/InstagramLogoColorless.svg';
import FacebookLogoColorless from '../../../../assets/svg/workspaceSettings/FacebookLogoColorless.svg';
import PinterestLogoColorless from '../../../../assets/svg/workspaceSettings/PinterestLogoColorless.svg';
import YouTubeLogoColorless from '../../../../assets/svg/workspaceSettings/YouTubeLogoColorless.svg';
import LinkedinLogoColorless from '../../../../assets/svg/workspaceSettings/LinkedinLogoColorless.svg';
import TiktokLogoColorless from '../../../../assets/svg/workspaceSettings/TiktokLogoColorless.svg';
import SpotifyLogoColorless from '../../../../assets/svg/workspaceSettings/SpotifyLogoColorless.svg';
import BehanceLogoColorless from '../../../../assets/svg/workspaceSettings/BehanceLogoColorless.svg';
import TelegramLogoColorless from '../../../../assets/svg/workspaceSettings/TelegramLogoColorless.svg';
import DribbbleLogoColorless from '../../../../assets/svg/workspaceSettings/DribbbleLogoColorless.svg';
import ActiveYoutube from '../../../../assets/images/companySettings/activeYoutube.png';
import BehanceActive from '../../../../assets/images/companySettings/behanceActive.png';
import DribbbleLogoactive from '../../../../assets/images/companySettings/dribbbleLogoactive.png';
import FacebookActive from '../../../../assets/images/companySettings/facebookActive.png';
import InstagramActive from '../../../../assets/images/companySettings/instagramActive.png';
import LinkedInActive from '../../../../assets/images/companySettings/linkedInActive.png';
import PinterestActive from '../../../../assets/images/companySettings/pinterestActive.png';
import TelegramActive from '../../../../assets/images/companySettings/telegramActive.png';
import TiktokActive from '../../../../assets/svg/workspaceSettings/activeTiktok.svg';
import ActiveSpotify from '../../../../assets/svg/workspaceSettings/activeSpotify.svg';
import SocialMediaPopup from './SocialMediaPopup';

const logoComponents = {
	instagram: { inactive: InstagramLogoColorless, active: InstagramActive },
	youtube: { inactive: YouTubeLogoColorless, active: ActiveYoutube },
	facebook: { inactive: FacebookLogoColorless, active: FacebookActive },
	pinterest: { inactive: PinterestLogoColorless, active: PinterestActive },
	linkedIn: { inactive: LinkedinLogoColorless, active: LinkedInActive },
	tiktok: { inactive: TiktokLogoColorless, active: TiktokActive },
	spotify: { inactive: SpotifyLogoColorless, active: ActiveSpotify },
	behance: { inactive: BehanceLogoColorless, active: BehanceActive },
	telegram: { inactive: TelegramLogoColorless, active: TelegramActive },
	steam: { inactive: DribbbleLogoColorless, active: DribbbleLogoactive },
};

// social component
const SocialMediaLinksComponent = ({
	tennantSettingsData,
	brandState,
	setbrandState,
	handleChange,
}) => {
	// useStates
	const [isActive, setisActive] = useState(false);

	// functions
	const openPopupFunction = (logoName, isActive) => {
		if (isActive) setisActive(true);
		setbrandState((prev) => ({
			...prev,
			brandingMediaPopup: true,
			socialMediaType: logoName,
		}));
	};

	const handleActivateLogo = (value) => {
		if (brandState.socialMediaType) {
			setbrandState((prev) => ({
				...prev,
				[`${brandState.socialMediaType}Profile`]: value,
			}));
		}
	};

	return (
		<div className="socialLinkContainer">
			<h1 className="socialLinkTitle">Brand setup</h1>
			<div className="socialLinkTextContainer">
				<h1>Social Media Links</h1>
				<p>Add your social media links</p>
			</div>

			<div className="logosWrapper">
				{Object.entries(logoComponents).map(([logoName, logoData], index) => {
					const isActive =
						(tennantSettingsData?.[`${logoName}Profile`] &&
							tennantSettingsData[`${logoName}Profile`].length > 0) ||
						brandState?.[`${logoName}Profile`] === 'active' ||
						false;

					const logoToDisplay = isActive ? logoData.active : logoData.inactive;

					return (
						<div
							className={`logoContainer ${isActive ? 'active' : ''}`}
							key={index}
							onClick={() => openPopupFunction(logoName, isActive)}
						>
							<img src={logoToDisplay} alt={`${logoName} logo`} />
						</div>
					);
				})}
			</div>

			{brandState.brandingMediaPopup && (
				<SocialMediaPopup
					handleClose={() =>
						setbrandState((prev) => ({
							...prev,
							brandingMediaPopup: false,
						}))
					}
					show={brandState?.brandingMediaPopup}
					logo={brandState?.socialMediaType}
					name={brandState?.socialMediaType + 'Profile'}
					onChangeFunc={handleChange}
					value={brandState?.[brandState?.socialMediaType + 'Profile']}
					handleActivate={handleActivateLogo}
					isActive={isActive}
				/>
			)}
		</div>
	);
};

export default memo(SocialMediaLinksComponent);
