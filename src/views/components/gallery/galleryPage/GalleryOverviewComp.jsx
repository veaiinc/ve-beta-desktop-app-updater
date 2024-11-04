import React from 'react';
import ToggleSlider from '../../../../views/components/input/slider';
import { DatePicker } from 'antd';
import { getInitials } from '../../../../helpers/index';

const GalleryOverview = ({
	info,
	handleGalleryChange,
	handleCallToAction,
	handleClientSubscription,
	handleManageCollaboratorPopup,
	convertEpochToDate,
	handleLinkChange,
}) => {
	return (
		<div id="gallery-overview" className="settings-overview">
			<p className="heading">Gallery overview</p>
			<p className="subHeading">
				Gallery URL
				<span className="subTitle">- ankitttt.ve-s.../-my gallery</span>
			</p>
			<div className="renameGallery">
				<p className="subHeading">Rename Gallery </p>
				<p className="subTitle">
					Renaming affects the URL. Share the new link with clients each time.
				</p>
				<input
					placeholder="Hannef x Mahi"
					value={info.activeGallery?.galleryData?.title}
					onChange={handleGalleryChange}
				/>
			</div>
			<div className="galleryDate">
				<p className="subHeading">Gallery Date </p>
				<p className="subTitle">
					Sort galleries by this date. Which is visible to the client
				</p>
				<div>
					<DatePicker
						className="datePicker"
						format="DD-MM-YYYY"
						selected={convertEpochToDate(info.activeGallery?.galleryData?.dueDateEpoch)}
						// onChange={(date, dateString) =>
						// 	handleAlbumNameChange(dateString, 'date')
						// }
					/>
				</div>
			</div>
			<div className="callToAction">
				<p className="subHeading">Call to Action (CTA)</p>
				<div className="callToActionToggle">
					<ToggleSlider
						value={info?.callToAction?.isEnabled}
						onChange={handleCallToAction}
					/>
					<p className="subTitle">Enable to display CTA for the gallery.</p>
				</div>
				<input
					placeholder="https://Instagtagram/sam/9tbevccxggvcxg"
					value={info?.callToAction?.link}
					onChange={handleLinkChange}
				/>
			</div>
			<div className="clientSubscription">
				<p className="subHeading">Client Subscription</p>
				<div className="clientSubscriptionToggle">
					<ToggleSlider
						value={info?.clientSubscription}
						onChange={handleClientSubscription}
					/>
					<p className="subTitle">
						Allow clients to subscribe and take ownership after expiry.
					</p>
				</div>
			</div>
			<div className="collaborators">
				<div className="collaboratorsContainer">
					<div>
						<p className="subHeading">3 Collaborators</p>
						<p className="subTitle">
							Collaborators are your team members that you want to add to or remove
							from this gallery.
						</p>
					</div>
					<p className="subHeading manageButton" onClick={handleManageCollaboratorPopup}>
						+ Manage Collaborators
					</p>
				</div>
				<div className="collaboratorsList">
					{info?.collaboratorsData?.map((ele, index) => (
						<div className="collaboratorsContainer">
							<div className="collaboratorsImage">
								<div className="tenantLogo">
									<p>{getInitials(ele?.firstName, ele?.lastName)}</p>
								</div>
							</div>
							<p>{ele?.firstName}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default GalleryOverview;
