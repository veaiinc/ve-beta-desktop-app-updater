import React, { memo, useState, useEffect } from 'react';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as UpArrow } from '../../../../assets/svg/workflow/downArrow.svg';
import '../../../../assets/scss/gallery/modals/createGallery.scss';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const CreateGallery = ({ open, closeModal, workspaceID }) => {
	const [galleryData, setGalleryData] = useState({
		title: '',
		shotDuring: '',
		workspaceID: '',
		userID: '',
	});

	useEffect(() => {
		const storedWorkspaceID = localStorage.getItem('workspaceId');
		const userToken = localStorage.getItem('usertoken');

		if (storedWorkspaceID) {
			setGalleryData((prevData) => ({ ...prevData, workspaceID: storedWorkspaceID }));
		} else {
			console.error('WorkspaceID not found in local storage');
		}

		if (userToken) {
			try {
				const decodedToken = jwt_decode(userToken);
				const userID = decodedToken.user_id;
				setGalleryData((prevData) => ({ ...prevData, userID }));
			} catch (error) {
				console.error('Error decoding user token:', error);
			}
		} else {
			console.error('User token not found in local storage');
		}
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setGalleryData({ ...galleryData, [name]: value });
	};

	const handleSubmit = async () => {
		const userToken = localStorage.getItem('usertoken');
		const decodedToken = jwt_decode(userToken);
		const userID = decodedToken.user_id;
		console.log(userID, 'userIDWhile crateing the gallery');
		try {
			const response = await axios.post(
				`https://ap.api.ve.ai/galleries/1.0/${galleryData.workspaceID}/galleries`,
				{
					title: galleryData.title,
					slug: galleryData.title,
					category: 'wedding',
					shotDuring: galleryData.shotDuring.replace(/-/g, ''),
					dueDateEpoch: new Date(galleryData.shotDuring).getTime() / 1000,
					tenantUsers: [
						{
							_id: userID,
							role: ['admin'],
						},
					],
					canClientReview: false,
					canClientSuggestEdits: true,
					theme: 'dark',
					visitorFormAccess: {
						accessibleTo: ['master', 'guest', 'face'],
						isEnabled: true,
					},
					canClientDownloadOriginals: true,
					canClientDownloadOptimized: false,
					ctaPreferences: {
						isEnabled: true,
						link: 'https://www.youtube.com/watch?v=dOKQeqGNJwY',
					},
					maxAICreditsAllowed: 25000,
					isAICreditRestrictionApplied: true,
				},
				{
					headers: {
						'x-access-token': userToken,
					},
				},
			);
			setGalleryData({
				title: '',
				shotDuring: '',
			});
			closeModal();
		} catch (error) {
			console.error('Error creating gallery:', error);
		}
	};

	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="createModalMainContainer">
				<div className="headingContainer">
					<p className="heading">Create New Gallery</p>
					<p className="closeIcon heading" onClick={closeModal}>
						X
					</p>
				</div>
				<div className="inputContainer">
					<div className="gallery-name">
						<p className="subHeading">Gallery Name</p>
						<input
							name="title"
							value={galleryData.title}
							onChange={handleInputChange}
							placeholder="e.g. Swarthika & Gandhi"
						/>
					</div>
					<div className="gallery-date">
						<p className="subHeading">Gallery date</p>
						<input
							name="shotDuring"
							value={galleryData.shotDuring}
							onChange={handleInputChange}
							placeholder="pick a date"
							type="date"
						/>
					</div>
				</div>
				<div className="create-gallery-button" onClick={handleSubmit}>
					<p>Create Gallery</p>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(CreateGallery);
