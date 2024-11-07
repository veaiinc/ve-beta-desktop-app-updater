import React, { memo, useState, useEffect, useContext, useCallback } from 'react';
import ReactModal from '../index';
import { ReactComponent as CrossWhite } from '../../../../assets/svg/workspaceSettings/cross.svg';
import '../../../../assets/scss/gallery/modals/createGallery.scss';
import axios from 'axios';
import Context from '../../../../context/context';
import jwt_decode from 'jwt-decode';
import { DatePicker } from 'antd';

const CreateGallery = ({ open, closeModal, workspaceID }) => {
	const {
		galleryInfo: { createNewGallery, checkGallerySlugAvailable },
	} = useContext(Context);
	const [galleryData, setGalleryData] = useState({
		title: '',
		shotDuring: '',
		workspaceID: '',
		userID: '',
		galleryNameError: false,
		eventDateError: false,
		gallerySlugError: false,
		timeout: null,
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

	const handleInputChange = (e, name) => {
		if (name === 'title') {
			setGalleryData({
				...galleryData,
				title: e.target.value,
				galleryNameError: !e.target.value.trim(),
			});
			handleDebounceSearch(e.target.value);
		} else {
			setGalleryData({
				...galleryData,
				shotDuring: e,
				eventDateError: !e,
			});
		}
	};

	const checkGallerySlugAvailableFunc = async (slug) => {
		if (slug === '') {
			setGalleryData((prev) => ({ ...prev, gallerySlugError: false }));
			return;
		}
		const respone = await checkGallerySlugAvailable(slug);
		if (respone?.[1]?.isAvailable) {
			setGalleryData((prev) => ({ ...prev, gallerySlugError: false }));
		} else {
			setGalleryData((prev) => ({ ...prev, gallerySlugError: true }));
		}
	};

	const handleDebounceSearch = useCallback(
		(slug) => {
			clearInterval(galleryData?.timeout);
			const timeout = setTimeout(() => {
				checkGallerySlugAvailableFunc(slug);
			}, 800);
			setGalleryData((prev) => ({ ...prev, timeout }));
		},
		[galleryData?.timeout],
	);

	const handleSubmit = async () => {
		const galleryNameError = !galleryData.title.trim();
		const eventDateError = !galleryData.shotDuring;
		const gallerySlugError = galleryData.gallerySlugError;

		if (galleryNameError || eventDateError || gallerySlugError) {
			setGalleryData((prevData) => ({
				...prevData,
				galleryNameError,
				eventDateError,
				gallerySlugError,
			}));
			return;
		}

		const userToken = localStorage.getItem('usertoken');
		const decodedToken = jwt_decode(userToken);
		const userID = decodedToken.user_id;
		try {
			const payload = {
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
			};
			await createNewGallery(payload);
			setGalleryData({
				title: '',
				shotDuring: '',
				workspaceID: '',
				userID: '',
				galleryNameError: false,
				eventDateError: false,
			});
			closeModal();
		} catch (error) {
			console.error('Error creating gallery:', error);
		}
	};

	return (
		<ReactModal
			isOpen={open}
			closeModal={() => {
				setGalleryData({
					title: '',
					shotDuring: '',
					workspaceID: '',
					userID: '',
					galleryNameError: false,
					eventDateError: false,
					gallerySlugError: false,
				});
				closeModal();
			}}
			modalType={'center'}
		>
			<div className="createModalMainContainer">
				<div className="headingContainer">
					<p className="heading">Create New Gallery</p>
					<p
						className="closeIcon heading"
						onClick={() => {
							setGalleryData({
								title: '',
								shotDuring: '',
								workspaceID: '',
								userID: '',
								galleryNameError: false,
								eventDateError: false,
								gallerySlugError: false,
							});
							closeModal();
						}}
					>
						<CrossWhite />
					</p>
				</div>
				<div className="inputContainer">
					<div className="gallery-name">
						<p className="subHeading">
							Gallery Name <span>*</span>
						</p>
						<input
							name="title"
							value={galleryData.title}
							onChange={(e) => handleInputChange(e, 'title')}
							placeholder="e.g. Swarthika & Gandhi"
						/>
						{galleryData?.galleryNameError && (
							<p className="error">Gallery Name is Required</p>
						)}
						{galleryData?.gallerySlugError && (
							<p className="error">Gallery Slug is already taken</p>
						)}
					</div>
					<div className="gallery-date">
						<p className="subHeading">
							Gallery date <span>*</span>
						</p>
						{/* <input
							name="shotDuring"
							value={galleryData.shotDuring}
							onChange={handleInputChange}
							placeholder="pick a date"
							type="date"
						/> */}
						<DatePicker
							className="datePicker"
							format="YYYY-MM-DD"
							selected={galleryData.shotDuring}
							onChange={(date, dateString) => handleInputChange(dateString, 'date')}
						/>
						{galleryData?.eventDateError && (
							<p className="error">Gallery Date is Required</p>
						)}
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
