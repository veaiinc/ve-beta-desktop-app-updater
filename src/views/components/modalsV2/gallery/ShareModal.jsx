import React, { memo, useEffect, useContext, useState, useCallback } from 'react';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/gallery/modals/shareModal.scss';
import { ReactComponent as Copy } from '../../../../assets/svg/gallery/copy.svg';
import { ReactComponent as Mail } from '../../../../assets/svg/gallery/mail.svg';
import ToggleSlider from '../../input/slider';
import Context from '../../../../context/context';
import { message, Drawer } from 'antd';

const workspaceId = localStorage.getItem('workspaceId');

const ShareModal = ({ open, closeModal, galleryId, activeGallery }) => {
	const {
		galleryInfo: {
			visitorFormAccess,
			getVisitorFormAccess,
			editVisitorFormAccess,
			editPreferences,
			getEditPreferences,
			tenantPreferences,
			getGalleryGuestAccess,
			editGalleryGuestAccess,
			galleryGuestAccess,
			shareGalleryViaEmail,
		},
	} = useContext(Context);
	const [info, setInfo] = useState({
		visitorFormAccess: visitorFormAccess,
		canClientDownloadOriginals: tenantPreferences?.canClientDownloadOriginals,
		galleryGuestAccess: galleryGuestAccess,
		shareEmail: '',
	});
	useEffect(() => {
		if (!visitorFormAccess) {
			getVisitorFormAccess(galleryId);
		}
		if (visitorFormAccess) {
			setInfo((prevInfo) => ({
				...prevInfo,
				visitorFormAccess: visitorFormAccess,
			}));
		}
	}, [visitorFormAccess]);
	useEffect(() => {
		if (!galleryGuestAccess) {
			getGalleryGuestAccess(galleryId);
		}
		if (galleryGuestAccess) {
			setInfo((prevInfo) => ({
				...prevInfo,
				galleryGuestAccess: galleryGuestAccess,
			}));
		}
	}, [galleryGuestAccess]);
	useEffect(() => {
		if (!tenantPreferences) {
			getEditPreferences(galleryId);
		}
		if (tenantPreferences) {
			setInfo((prevInfo) => ({
				...prevInfo,
				canClientDownloadOriginals: tenantPreferences?.canClientDownloadOriginals,
			}));
		}
	}, [tenantPreferences]);

	const handleVisitorFormAccess = useCallback(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			visitorFormAccess: {
				...visitorFormAccess,
				isEnabled: !prevInfo?.visitorFormAccess?.isEnabled,
			},
		}));
		const payload = {
			isEnabled: !info?.visitorFormAccess?.isEnabled,
		};
		editVisitorFormAccess(payload, galleryId);
	}, [info?.visitorFormAccess?.isEnabled]);

	const handleGalleryProtection = useCallback(() => {
		const payload = {
			canClientDownloadOriginals: !info?.canClientDownloadOriginals,
			canClientDownloadOptimized: !info?.canClientDownloadOriginals,
		};
		editPreferences(galleryId, payload);
	}, [info?.canClientDownloadOriginals]);

	const handleGalleryGuestAccess = useCallback(() => {
		const payload = {
			isEnabled: !info?.galleryGuestAccess?.isEnabled,
		};
		editGalleryGuestAccess(payload, galleryId);
	}, [info?.galleryGuestAccess?.isEnabled]);

	const handleShareViaEmail = useCallback(async () => {
		const payload = {
			email: info?.shareEmail,
		};
		const response = await shareGalleryViaEmail(payload, galleryId);
		console.log('response==>handleShareViaEmail', response);
		if (response[0]) {
			message.success('Email sent successfully');
			setInfo((prevInfo) => ({
				...prevInfo,
				shareEmail: '',
			}));
		} else {
			message.error('Failed to send email');
		}
	}, [info?.shareEmail]);
	const handleCopyGalleryLink = useCallback(() => {
		const galleryLink = `https://${workspaceId}.ve.ai/galleries/${activeGallery?.slug}`;
		navigator.clipboard
			.writeText(galleryLink)
			.then(() => {
				message.success('Gallery link copied to clipboard');
			})
			.catch(() => {
				message.error('Failed to copy gallery link');
			});
	}, [activeGallery?.slug]);

	return (
		<Drawer
			open={open}
			width={677}
			onClose={closeModal}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
		>
			<div className="shareMainContainer">
				<div className="shareHeadingContainer">
					<b className="shareHeading">Share</b>
					<p className="subheading">
						You can share your gallery and manage Gallery Protection
					</p>
				</div>
				<p className="line"></p>
				<div className="galleryLinkContainer">
					<p>Gallery link</p>
					<div className="galleryLinkInputContainer">
						<div className="galleryLinkInput">
							<input
								placeholder="tussgabscgausgcharxyz//ail.com"
								disabled
								value={`https://${workspaceId}.ve.ai/galleries/${activeGallery?.slug}`}
							/>
							<div>
								<Copy
									onClick={handleCopyGalleryLink}
									style={{ cursor: 'pointer' }}
								/>
							</div>
						</div>
						<div className="shareViaMail">
							<input
								placeholder="Share via mail"
								value={info?.shareEmail}
								onChange={(e) =>
									setInfo((prev) => ({ ...prev, shareEmail: e.target.value }))
								}
							/>
							<div onClick={handleShareViaEmail} style={{ cursor: 'pointer' }}>
								<Mail />
							</div>
						</div>
					</div>
				</div>
				<p className="line"></p>
				<div className="optionsContainer">
					<div className="optionsToggleContainer">
						<ToggleSlider
							value={info?.galleryGuestAccess?.isEnabled}
							onChange={handleGalleryGuestAccess}
						/>
						<p>Gallery protection</p>
					</div>
					<p>Protect your gallery with Client & Guest PIN</p>
				</div>
				<div className="optionsContainer">
					<div className="optionsToggleContainer">
						<ToggleSlider
							value={info?.canClientDownloadOriginals}
							onChange={handleGalleryProtection}
						/>
						<p>Download</p>
					</div>
					<p>Who all can download the photos</p>
				</div>
				<div className="optionsContainer">
					<p>Visitors Details Form</p>
					<div className="toggleContainer">
						<div style={{ width: '32px' }}>
							<ToggleSlider
								value={info?.visitorFormAccess?.isEnabled}
								onChange={handleVisitorFormAccess}
							/>
						</div>
						<p>
							If enabled, guests will be required to input their name, email ID, and
							mobile number after entering a Pin or completing a face scan.
						</p>
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(ShareModal);
