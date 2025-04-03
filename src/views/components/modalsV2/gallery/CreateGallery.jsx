import React, { memo, useState, useEffect, useContext, useCallback } from 'react';
import ReactModal from '../index';
import { ReactComponent as CrossWhite } from '../../../../assets/svg/workspaceSettings/cross.svg';
import '../../../../assets/scss/gallery/modals/createGallery.scss';
import Context from '../../../../context/context';
import jwt_decode from 'jwt-decode';
import { DatePicker } from 'antd';
import slugify from 'slugify';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
const CreateGallery = ({
	open,
	closeModal,
	workspaceID,
	fetchGalleries,
	message,
	isLightGallery,
}) => {
	const navigate = useNavigate();
	const {
		galleryInfo: { createNewGallery, checkGallerySlugAvailable },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);
	const [galleryData, setGalleryData] = useState({
		title: 'Untitled Gallery',
		slug: 'untitledgallery',
		shotDuring: new Date().toISOString().split('T')[0],
		workspaceID: '',
		userID: '',
		galleryNameError: false,
		eventDateError: false,
		gallerySlugError: false,
		timeout: null,
		isSubmitting: false,
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

	const handleInputChange = (e, name, test) => {
		if (name === 'title') {
			if (e.target.value.trim().length > 50) {
				return;
			}
			const slugConverted = slugify(e.target.value, {
				lower: true,
				strict: true,
			});
			setGalleryData({
				...galleryData,
				title: e.target.value || 'Untitled',
				slug: slugConverted,
				galleryNameError: !e.target.value,
			});
			handleDebounceSearch(slugConverted);
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

	const closeModalFunc = () => {
		setGalleryData({
			title: 'Untitled',
			slug: 'untitled',
			shotDuring: new Date().toISOString().split('T')[0],
			workspaceID: '',
			userID: '',
			galleryNameError: false,
			eventDateError: false,
			gallerySlugError: false,
		});
		closeModal();
	};

	const handleSubmit = async () => {
		if (
			validateExpiryData &&
			validateExpiryData?.restrictGalleries &&
			validateExpiryData?.isExpired
		) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		}
		if (galleryData?.isSubmitting) return;
		const galleryNameError = !galleryData.title;
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
				slug: galleryData.slug,
				category: 'wedding',
				shotDuring: galleryData.shotDuring.replace(/-/g, ''),
				dueDateEpoch: new Date(
					new Date().setMonth(new Date().getMonth() + 12), // Add 12 months to today
				).getTime(),
				tenantUsers: [
					{
						_id: userID,
						role: ['admin'],
					},
				],
				storeOriginals: isLightGallery ? false : true,
			};

			setGalleryData((prev) => ({ ...prev, isSubmitting: true }));
			let response = await createNewGallery(payload);

			if (response?.[0] === true) {
				closeModalFunc();
				navigate(`/galleries/${response?.[1]?._id}`);
				fetchGalleries(1, null, true);
				message.success('Gallery created successfully');
			} else {
				message.error(response?.[1]?.message || 'Failed to create gallery');
			}
		} catch (error) {
			console.error('Error creating gallery:', error);
		} finally {
			setGalleryData((prev) => ({ ...prev, isSubmitting: false }));
		}
	};

	return (
		<ReactModal isOpen={open} closeModal={closeModalFunc} modalType={'center'}>
			<div className="createModalMainContainer">
				<div className="headingContainer">
					<p className="heading">Create New Gallery</p>
					<p className="closeIcon heading" onClick={closeModalFunc}>
						<CrossWhite />
					</p>
				</div>
				<div className="inputContainer">
					<div className="gallery-name">
						<p className="subHeading">Gallery Name</p>
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
						<p className="subHeading">Gallery date</p>
						<DatePicker
							className="datePicker"
							format="YYYY-MM-DD"
							defaultValue={dayjs()} // Set default value to current date
							value={dayjs(galleryData.shotDuring)}
							onChange={(date, dateString) => handleInputChange(dateString, 'date')}
							inputReadOnly
							allowClear={false}
						/>
						{galleryData?.eventDateError && (
							<p className="error">Gallery Date is Required</p>
						)}
					</div>
				</div>
				<button
					className="create-gallery-button"
					onClick={handleSubmit}
					disabled={
						galleryData?.galleryNameError ||
						galleryData?.eventDateError ||
						galleryData?.gallerySlugError ||
						galleryData?.title === '' ||
						galleryData?.shotDuring === ''
					}
					style={{
						opacity:
							!galleryData?.galleryNameError &&
							!galleryData?.eventDateError &&
							!galleryData?.gallerySlugError &&
							galleryData?.title !== '' &&
							galleryData?.shotDuring !== ''
								? 1
								: 0.2,
						cursor:
							!galleryData?.galleryNameError &&
							!galleryData?.eventDateError &&
							!galleryData?.gallerySlugError &&
							galleryData?.title !== '' &&
							galleryData?.shotDuring !== ''
								? 'pointer'
								: 'not-allowed',
					}}
				>
					<p>Create Gallery</p>
				</button>
			</div>
		</ReactModal>
	);
};

export default memo(CreateGallery);
