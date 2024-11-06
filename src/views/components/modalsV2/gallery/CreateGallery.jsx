import React, { memo, useState, useEffect, useContext } from 'react';
import ReactModal from '../index';
import { ReactComponent as CrossWhite } from '../../../../assets/svg/workspaceSettings/cross.svg';
import '../../../../assets/scss/gallery/modals/createGallery.scss';
import axios from 'axios';
import Context from '../../../../context/context';
import jwt_decode from 'jwt-decode';
import { DatePicker } from 'antd';

const CreateGallery = ({ open, closeModal, workspaceID }) => {
	const {
		galleryInfo: { createNewGallery },
	} = useContext(Context);
	const [galleryData, setGalleryData] = useState({
		title: '',
		shotDuring: '',
		workspaceID: '',
		userID: '',
		galleryNameError: false,
		eventDateError: false,
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
		} else {
			setGalleryData({
				...galleryData,
				shotDuring: e,
				eventDateError: !e,
			});
		}
	};

	const handleSubmit = async () => {
		const galleryNameError = !galleryData.title.trim();
		const eventDateError = !galleryData.shotDuring;

		if (galleryNameError || eventDateError) {
			setGalleryData((prevData) => ({
				...prevData,
				galleryNameError,
				eventDateError,
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
							});
							closeModal();
						}}
					>
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
					</div>
					<div className="gallery-date">
						<p className="subHeading">Gallery date</p>
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
