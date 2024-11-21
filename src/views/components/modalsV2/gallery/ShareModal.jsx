import React, { memo, useEffect, useContext, useState, useCallback } from 'react';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/gallery/modals/shareModal.scss';
import { ReactComponent as Copy } from '../../../../assets/svg/gallery/copy.svg';
import { ReactComponent as Mail } from '../../../../assets/svg/gallery/mail.svg';
import { ReactComponent as UpArrow } from '../../../../assets/svg/workflow/downArrow.svg';
import ToggleSlider from '../../input/slider';
import Context from '../../../../context/context';
import { message, Drawer, Select } from 'antd';
import _ from 'lodash';

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
			getGalleryShareDetails,
			galleryShareDetails,
			changeMasterAccessPin,
		},
	} = useContext(Context);
	const [info, setInfo] = useState({
		visitorFormAccess: visitorFormAccess,
		canClientDownloadOriginals: tenantPreferences?.canClientDownloadOriginals,
		canClientDownloadOptimized: tenantPreferences?.canClientDownloadOptimized,
		isDownloadEnabled:
			tenantPreferences?.canClientDownloadOriginals ||
			tenantPreferences?.canClientDownloadOptimized ||
			tenantPreferences?.canGuestDownloadOptimized ||
			tenantPreferences?.canGuestDownloadOriginals ||
			false,
		guestCannotDownload:
			tenantPreferences?.canGuestDownloadOriginals &&
			tenantPreferences?.canGuestDownloadOptimized
				? false
				: true,
		galleryGuestAccess: galleryGuestAccess,
		shareEmail: '',
		showClientDownloadOptions: false,
		showGuestDownloadOptions: false,
		galleryShareDetails: galleryShareDetails,
		canGuestDownloadOptimized: tenantPreferences?.canGuestDownloadOptimized || false,
		canGuestDownloadOriginals: tenantPreferences?.canGuestDownloadOriginals || false,
	});
	useEffect(() => {
		if (!galleryShareDetails) {
			getGalleryShareDetails(galleryId);
		}
		if (galleryShareDetails) {
			setInfo((prevInfo) => ({
				...prevInfo,
				galleryShareDetails: galleryShareDetails,
			}));
		}
	}, [galleryShareDetails]);
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
				canClientDownloadOptimized: tenantPreferences?.canClientDownloadOptimized,
				canGuestDownloadOptimized: tenantPreferences?.canGuestDownloadOptimized,
				canGuestDownloadOriginals: tenantPreferences?.canGuestDownloadOriginals,
				isDownloadEnabled:
					tenantPreferences?.canClientDownloadOriginals ||
					tenantPreferences?.canClientDownloadOptimized ||
					tenantPreferences?.canGuestDownloadOptimized ||
					tenantPreferences?.canGuestDownloadOriginals ||
					false,
				guestCannotDownload:
					tenantPreferences?.canGuestDownloadOriginals &&
					tenantPreferences?.canGuestDownloadOptimized
						? false
						: true,
			}));
		}
	}, [tenantPreferences]);
	useEffect(() => {
		handleDownloadOptions();
	}, [
		info?.canClientDownloadOriginals,
		info?.canClientDownloadOptimized,
		info?.canGuestDownloadOptimized,
		info?.canGuestDownloadOriginals,
	]);

	const handleDownloadOptions = () => {
		setInfo((prevInfo) => ({
			...prevInfo,
			isDownloadEnabled:
				prevInfo?.canClientDownloadOriginals ||
				prevInfo?.canClientDownloadOptimized ||
				prevInfo?.canGuestDownloadOptimized ||
				prevInfo?.canGuestDownloadOriginals,
		}));
	};

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

	const handleGalleryProtection = (name) => {
		let payload = {};
		if (name === 'download') {
			setInfo((prevInfo) => ({
				...prevInfo,
				isDownloadEnabled: !prevInfo?.isDownloadEnabled,
				canClientDownloadOriginals: false,
				canClientDownloadOptimized: false,
				canGuestDownloadOptimized: false,
				canGuestDownloadOriginals: false,
			}));
			if (!info?.isDownloadEnabled) {
				setInfo((prevInfo) => ({
					...prevInfo,
					canClientDownloadOptimized: true,
				}));
				payload = {
					canClientDownloadOptimized: true,
				};
			} else {
				payload = {
					canClientDownloadOriginals: false,
					canClientDownloadOptimized: false,
					canGuestDownloadOptimized: false,
					canGuestDownloadOriginals: false,
				};
			}
		} else if (name === 'guestCannotDownload') {
			setInfo((prevInfo) => ({
				...prevInfo,
				guestCannotDownload: !prevInfo?.guestCannotDownload,
			}));

			if (info?.guestCannotDownload) {
				payload = {
					canGuestDownloadOriginals: false,
					canGuestDownloadOptimized: false,
				};
			} else {
				payload = {
					canGuestDownloadOptimized: true,
				};
			}
		} else {
			setInfo((prevInfo) => ({
				...prevInfo,
				[name]: !prevInfo[name],
				// isDownloadEnabled:
			}));
			payload = {
				[name]: !info[name],
			};
		}

		editPreferences(galleryId, payload);
	};

	const handleGalleryGuestAccess = () => {
		setInfo((prevInfo) => ({
			...prevInfo,
			galleryGuestAccess: {
				...prevInfo?.galleryGuestAccess,
				isEnabled: !prevInfo?.galleryGuestAccess?.isEnabled,
			},
		}));
		const payload = {
			isEnabled: !info?.galleryGuestAccess?.isEnabled,
		};
		editGalleryGuestAccess(payload, galleryId);
	};

	const handleShareViaEmail = useCallback(async () => {
		const payload = {
			email: info?.shareEmail,
		};
		const response = await shareGalleryViaEmail(payload, galleryId);
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
		const galleryLink = `https://${workspaceId}.ve.ai/gallery/${activeGallery?.slug}`;
		navigator.clipboard
			.writeText(galleryLink)
			.then(() => {
				message.success('Gallery link copied to clipboard');
			})
			.catch(() => {
				message.error('Failed to copy gallery link');
			});
	}, [activeGallery?.slug]);

	const handleEditPin = (e, type) => {
		if (type === 'masterAccessPin') {
			setInfo((prevInfo) => ({
				...prevInfo,
				galleryShareDetails: { ...prevInfo?.galleryShareDetails, [type]: e.target.value },
			}));
			if (
				e.target.value.length === 4 &&
				e.target.value !== galleryShareDetails?.masterAccessPin
			) {
				let payload = {
					accessPin: e.target.value,
				};
				changeMasterAccessPin(payload, galleryId);
				message.success('Client PIN updated successfully');
			}
		} else if (type === 'guestAccessPin') {
			setInfo((prevInfo) => ({
				...prevInfo,
				galleryGuestAccess: {
					...prevInfo?.galleryGuestAccess,
					pin: e.target.value,
				},
			}));
			if (e.target.value.length === 3 && e.target.value !== galleryGuestAccess?.pin) {
				let payload = {
					accessPin: e.target.value,
				};
				editGalleryGuestAccess(payload, galleryId);
				message.success('Guest PIN updated successfully');
			}
		}
	};

	const handleCopyPin = (type) => {
		if (type === 'masterAccessPin') {
			navigator.clipboard.writeText(info?.galleryShareDetails?.masterAccessPin).then(() => {
				message.success('PIN copied to clipboard');
			});
		} else if (type === 'guestAccessPin') {
			navigator.clipboard.writeText(info?.galleryShareDetails?.guestAccess?.pin).then(() => {
				message.success('PIN copied to clipboard');
			});
		}
	};

	const handleOpenDownloadOptions = (type) => {
		setInfo((prev) => ({
			...prev,
			[`show${type}DownloadOptions`]: !prev[`show${type}DownloadOptions`],
		}));
	};

	const handleVisitorForm = (apiKey) => {
		const currentAccessibleTo = [...(info?.visitorFormAccess?.accessibleTo || [])];
		const index = currentAccessibleTo.indexOf(apiKey);

		let newAccessibleTo;
		if (index > -1) {
			newAccessibleTo = currentAccessibleTo.filter((key) => key !== apiKey);
		} else {
			newAccessibleTo = [...currentAccessibleTo, apiKey];
		}

		setInfo((prevInfo) => ({
			...prevInfo,
			visitorFormAccess: {
				...prevInfo.visitorFormAccess,
				accessibleTo: newAccessibleTo,
			},
		}));

		const payload = {
			accessibleTo: newAccessibleTo,
		};

		editVisitorFormAccess(payload, galleryId);
	};

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
								value={`https://${workspaceId}.ve.ai/gallery/${activeGallery?.slug}`}
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
					{/* <div className="optionsToggleContainer">
						<ToggleSlider
							value={info?.galleryGuestAccess?.isEnabled}
							onChange={handleGalleryGuestAccess}
						/>
						<p>Gallery protection</p>
					</div> */}
					{/* <p>Protect your gallery with Client & Guest PIN</p> */}

					<div className="pinContainer">
						<div className="pinContainerItem">
							<p>Client PIN</p>
							<div className="editPinContainer">
								<input
									placeholder="Enter 4-digit PIN"
									maxLength={4}
									onKeyPress={(e) => {
										if (!/[0-9]/.test(e.key)) {
											e.preventDefault();
										}
									}}
									onChange={(e) => {
										handleEditPin(e, 'masterAccessPin');
									}}
									value={info?.galleryShareDetails?.masterAccessPin}
								/>
								<div>
									<Copy
										onClick={() => handleCopyPin('masterAccessPin')}
										style={{ cursor: 'pointer' }}
									/>
								</div>
							</div>
						</div>
						<div className="pinContainerItem">
							<div className="optionsToggleContainer">
								<ToggleSlider
									value={info?.galleryGuestAccess?.isEnabled}
									onChange={handleGalleryGuestAccess}
								/>
								<p>Guest PIN</p>
							</div>
							<p>If enabled gallery will be protected by PIN for guests</p>
							{info?.galleryGuestAccess?.isEnabled && (
								<div className="editPinContainer">
									<input
										placeholder="Enter 3-digit PIN"
										maxLength={3}
										onKeyPress={(e) => {
											if (!/[0-9]/.test(e.key)) {
												e.preventDefault();
											}
										}}
										onChange={(e) => {
											handleEditPin(e, 'guestAccessPin');
										}}
										value={info?.galleryGuestAccess?.pin}
									/>
									<div>
										<Copy
											onClick={() => handleCopyPin('guestAccessPin')}
											style={{ cursor: 'pointer' }}
										/>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="optionsContainer">
					<div className="optionsToggleContainer">
						<ToggleSlider
							value={info?.isDownloadEnabled}
							onChange={() => handleGalleryProtection('download')}
						/>
						<p>Download</p>
					</div>
					<p>Who all can download the photos</p>
					{info?.isDownloadEnabled && (
						<div className="downloadOptionsContainer">
							<div className="downloadOptionItem">
								<div className="downloadOptionItemText">
									<p>Client </p>
									<div className="dropdownContainer">
										<div
											className="dropdown"
											onClick={() => handleOpenDownloadOptions('Client')}
										>
											<p></p>
											<UpArrow className="rotate" />
										</div>

										<div
											className={`downloadOptionContainer ${
												info?.showClientDownloadOptions ? 'expanded' : ''
											}`}
										>
											<div className="downloadOptions">
												<p>Can Download Originals Images</p>
												<input
													type="checkbox"
													checked={info?.canClientDownloadOriginals}
													onChange={() =>
														handleGalleryProtection(
															'canClientDownloadOriginals',
														)
													}
												/>
											</div>
											<div className="downloadOptions">
												<p>Can Download Optimised Images</p>
												<input
													type="checkbox"
													checked={info?.canClientDownloadOptimized}
													onChange={() =>
														handleGalleryProtection(
															'canClientDownloadOptimized',
														)
													}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="downloadOptionItem">
								<div className="downloadOptionItemText">
									<p>Guest</p>
									<div className="dropdownContainer">
										<div
											className="dropdown"
											onClick={() => handleOpenDownloadOptions('Guest')}
										>
											<p></p>
											<UpArrow className="rotate" />
										</div>

										<div
											className={`downloadOptionContainer ${
												info?.showGuestDownloadOptions
													? 'expandedGuest'
													: ''
											}`}
										>
											{/* <div className="downloadOptions">
												<p>Cannot Download </p>
												<input
													type="checkbox"
													checked={!info?.guestCannotDownload}
													onChange={() =>
														handleGalleryProtection(
															'guestCannotDownload',
														)
													}
												/>
											</div> */}
											<div className="downloadOptions">
												<p>Can Download Originals Images</p>
												<input
													type="checkbox"
													checked={info?.canGuestDownloadOriginals}
													onChange={() =>
														handleGalleryProtection(
															'canGuestDownloadOriginals',
														)
													}
												/>
											</div>
											<div className="downloadOptions">
												<p>Can Download Optimised Images</p>
												<input
													type="checkbox"
													checked={info?.canGuestDownloadOptimized}
													onChange={() =>
														handleGalleryProtection(
															'canGuestDownloadOptimized',
														)
													}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
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
					{info?.visitorFormAccess?.isEnabled && (
						<div className="visitorFormAccessContainer visitorAnimation">
							{[
								{ label: 'Client', apiKey: 'master' },
								{ label: 'Guest', apiKey: 'guest' },
								{ label: 'AI Face Recognition', apiKey: 'face' },
							].map((item) => (
								<div key={item.label} className="visitorFormAccessItem">
									<input
										type="checkbox"
										checked={info?.visitorFormAccess?.accessibleTo?.includes(
											item.apiKey,
										)}
										onChange={() => handleVisitorForm(item.apiKey)}
									/>
									<p>{item.label}</p>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</Drawer>
	);
};

export default memo(ShareModal);
