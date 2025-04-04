import React, { useState, memo, useContext, useEffect, useCallback } from 'react';
import '../../../../assets/scss/gallery/modals/createAlbum.scss';
import ReactModal from '../index';
import { DatePicker, message } from 'antd';
import Context from '../../../../context/context';
import { useLocation } from 'react-router-dom';
import { ReactComponent as CrossWhite } from '../../../../assets/svg/workspaceSettings/cross.svg';
import slugify from 'slugify';
import dayjs from 'dayjs';

const CreateAlbum = ({ open, closeModal, galleryId }) => {
	const {
		galleryInfo: { createNewAlbum, checkAlbumSlugIsAvalible },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);
	const location = useLocation();
	const [info, setInfo] = useState({
		albumName: 'Untitled Album',
		slug: 'untitledalbum',
		eventDate: new Date().toISOString().split('T')[0],
		albumNameError: false,
		eventDateError: false,
		albumSlugError: false,
		timeout: null,
		isSubmitting: false,
	});

	const handleAlbumNameChange = (e, name) => {
		if (name === 'album') {
			const albumName = e.target.value;
			if (albumName.length > 50) {
				return;
			}

			const slugConverted = slugify(albumName, {
				lower: true,
				strict: true,
			});
			setInfo((prevInfo) => ({
				...prevInfo,
				albumName: albumName,
				slug: slugConverted,
				albumNameError: !albumName,
			}));
			handleDebounceSearch(slugConverted);
		} else {
			setInfo((prevInfo) => ({
				...prevInfo,
				eventDate: e,
				eventDateError: !e,
			}));
		}
	};

	const handleCreateAlbum = async () => {
		if (
			validateExpiryData &&
			validateExpiryData?.restrictGalleries &&
			validateExpiryData?.isExpired
		) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		}
		if (info?.isSubmitting) return;
		const albumNameError = !info.albumName;
		const eventDateError = !info.eventDate;

		if (albumNameError || eventDateError) {
			setInfo((prevInfo) => ({
				...prevInfo,
				albumNameError,
				eventDateError,
			}));
			return;
		}

		const payload = {
			slug: info.slug,
			title: info.albumName,
			eventDateEpoch: new Date(info.eventDate).getTime() / 1000,
		};
		setInfo((prev) => ({ ...prev, isSubmitting: true }));
		const response = await createNewAlbum(payload, galleryId);
		if (response?.[0] === 200) {
			closeModelFunction();
			message.success('Gallery Created Successfully');
		} else {
			message.error(response?.[1]?.message);
		}

		setInfo((prev) => ({ ...prev, isSubmitting: false }));
	};

	const checkAlbumSlugAvailableFunc = async (slug) => {
		if (slug === '') {
			setInfo((prev) => ({ ...prev, albumSlugError: false }));
			return;
		}
		const respone = await checkAlbumSlugIsAvalible(galleryId, slug);
		if (respone?.[1]?.isAvailable) {
			setInfo((prev) => ({ ...prev, albumSlugError: false }));
		} else {
			setInfo((prev) => ({ ...prev, albumSlugError: true }));
		}
	};

	const handleDebounceSearch = useCallback(
		(slug) => {
			clearInterval(info?.timeout);
			const timeout = setTimeout(() => {
				checkAlbumSlugAvailableFunc(slug);
			}, 800);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info?.timeout],
	);

	const closeModelFunction = () => {
		setInfo({
			albumName: 'Untitled',
			slug: 'untitled',
			eventDate: new Date().toISOString().split('T')[0],
			albumNameError: false,
			eventDateError: false,
			albumSlugError: false,
			timeout: null,
		});
		closeModal();
	};

	return (
		<ReactModal
			isOpen={open}
			closeModal={closeModelFunction}
			customStyles={{
				content: { position: 'absolute', overflow: 'hidden' },
				className: 'createAlbumModal',
			}}
		>
			<div className="createAlbumMainContainer">
				<div className="createAlbumHeading">
					<p className="heading">Create New Album</p>
					<p className="close" onClick={closeModelFunction}>
						<CrossWhite />
					</p>
				</div>
				<div className="inputContainer">
					<div className="inputs">
						<label>Album Name</label>
						<input
							placeholder="e.g. Swarthika & Gandhi"
							className="albumName"
							value={info?.albumName}
							onChange={(e) => handleAlbumNameChange(e, 'album')}
						/>
						{info?.albumNameError && <p className="error">Album Name is Required</p>}
						{info?.albumSlugError && (
							<p className="error">Album Slug is already taken</p>
						)}
					</div>
					<div className="inputs">
						<label>Event date</label>
						<DatePicker
							className="datePicker"
							format="YYYY-MM-DD"
							defaultValue={dayjs()} // Set default value to current date
							value={dayjs(info.eventDate)}
							onChange={(date, dateString) =>
								handleAlbumNameChange(dateString, 'date')
							}
							inputReadOnly
							allowClear={false}
						/>
						{info?.eventDateError && <p className="error">Album Date is Required</p>}
					</div>
				</div>
				<button
					className="createButton"
					onClick={handleCreateAlbum}
					disabled={
						!info?.albumNameError &&
						!info?.eventDateError &&
						!info?.albumSlugError &&
						info?.albumName !== '' &&
						info?.eventDate !== ''
							? false
							: true
					}
					style={{
						opacity:
							!info?.albumNameError &&
							!info?.eventDateError &&
							!info?.albumSlugError &&
							info?.albumName !== '' &&
							info?.eventDate !== ''
								? 1
								: 0.2,
						cursor:
							!info?.albumNameError &&
							!info?.eventDateError &&
							!info?.albumSlugError &&
							info?.albumName !== '' &&
							info?.eventDate !== ''
								? 'pointer'
								: 'not-allowed',
					}}
				>
					Create
				</button>
			</div>
		</ReactModal>
	);
};

export default memo(CreateAlbum);
