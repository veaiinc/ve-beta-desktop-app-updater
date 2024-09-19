import React, { useContext, useEffect, useState } from 'react';
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
import ReusableButtonSettings from '../../features/settings/ReusableButtonSettings';
import { BrandingColorPopUp, ChangeFontPopup, SocialMediaPopup } from './popups/BrandingPopups';
import { BrandColorList, FontList } from '../../features/settings/indexConstant';
import { ReactComponent as PlusSvg } from '../../../assets/svg/workspaceSettings/plus-button.svg';
// social component
export const SocialMediaLinksComponent = ({
	tennantSettingsData,
	brandState,
	setbrandState,
	handleChange,
	handleActivateLogo,
}) => {
	const logoComponents = {
		instagram: { inactive: InstagramLogoColorless, active: InstagramActive },
		facebook: { inactive: FacebookLogoColorless, active: FacebookActive },
		pinterest: { inactive: PinterestLogoColorless, active: PinterestActive },
		youtube: { inactive: YouTubeLogoColorless, active: ActiveYoutube },
		linkedIn: { inactive: LinkedinLogoColorless, active: LinkedInActive },
		tiktok: { inactive: TiktokLogoColorless, active: TiktokActive },
		spotify: { inactive: SpotifyLogoColorless, active: ActiveSpotify },
		behance: { inactive: BehanceLogoColorless, active: BehanceActive },
		telegram: { inactive: TelegramLogoColorless, active: TelegramActive },
		steam: { inactive: DribbbleLogoColorless, active: DribbbleLogoactive },
	};
	return (
		<>
			<div className="socialLinkTextContainer">
				<h1>Social Media Links</h1>
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
							className="logoContainer"
							key={index}
							onClick={() => {
								setbrandState((prev) => ({
									...prev,
									brandingMediaPopup: true,
									socialMediaType: logoName,
								}));
							}}
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
					show={brandState.brandingMediaPopup}
					logo={brandState.socialMediaType}
					name={brandState.socialMediaType + 'Profile'}
					onChangeFunc={handleChange}
					value={brandState?.[brandState.socialMediaType + 'Profile']}
					handleActivate={handleActivateLogo}
				/>
			)}
		</>
	);
};

//  brand color component
export const BrandColorComponent = ({ setbrandState, brandState, handleSelectedColor }) => {
	return (
		<>
			<div className="brandingTextContainer">
				<h1>Branding</h1>
			</div>
			<div className="brandColorContainer">
				{BrandColorList.map((singleColor) => (
					<div className="chooseBrandColor" key={singleColor.label}>
						<div
							className="circleColor"
							style={{ background: `${singleColor.value}` }}
						></div>
						<p className="hashColor">{singleColor.value}</p>
					</div>
				))}
				<div className="chooseBrandColor">
					<div
						className="circleColor"
						style={{ background: `${brandState?.brandColor}` }}
					></div>
					<p className="hashColor">{brandState?.brandColor}</p>
				</div>
			</div>

			<div>
				<ReusableButtonSettings
					icon={<PlusSvg />}
					className="reuseableButton"
					text={'Add'}
					func={() => setbrandState((prev) => ({ ...prev, brandingPopup: true }))}
				/>
			</div>

			{brandState.brandingPopup && (
				<BrandingColorPopUp
					handleClose={() => setbrandState((prev) => ({ ...prev, brandingPopup: false }))}
					show={brandState.brandingPopup}
					value={brandState.brandColor}
					selectedColor={handleSelectedColor}
				/>
			)}
		</>
	);
};

//  brand fonts component
export const BrandFontsComponent = ({ setbrandState, brandState }) => {
	return (
		<>
			<div className="brandTextContainer">
				<h1>Brand Fonts</h1>
			</div>

			<div className="fontslistcontainer">
				{FontList.map((font, index, arr) => (
					<div key={index}>
						<div className="singleListDiv">
							<div
								style={{
									fontFamily: `${font.name}`,
								}}
								className="fontName"
							>
								{font.name}
							</div>
							<div className="fontType">{font.type}</div>
						</div>

						<div
							style={{
								height: '1px',
								backgroundColor: '#2827287A',
								margin: '16px 0',
							}}
						/>
					</div>
				))}
			</div>

			<div className="button">
				<ReusableButtonSettings
					text={'Mangage Font'}
					func={() => setbrandState((prev) => ({ ...prev, fontPopup: true }))}
				/>
			</div>

			{brandState.fontPopup && (
				<ChangeFontPopup
					handleClose={() => setbrandState((prev) => ({ ...prev, fontPopup: false }))}
					show={brandState.fontPopup}
				/>
			)}
		</>
	);
};
