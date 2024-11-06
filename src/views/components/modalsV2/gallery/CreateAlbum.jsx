import React, { useState, memo, useContext, useEffect } from 'react';
import '../../../../assets/scss/gallery/modals/createAlbum.scss';
import ReactModal from '../index';
import { DatePicker } from 'antd';
import Context from '../../../../context/context';
import { useLocation } from 'react-router-dom';
import { ReactComponent as CrossWhite } from '../../../../assets/svg/workspaceSettings/cross.svg';

const CreateAlbum = ({ open, closeModal, galleryId }) => {
	const {
		galleryInfo: { createNewAlbum, checkSlugIsAvalible },
	} = useContext(Context);
	const location = useLocation();
	const [info, setInfo] = useState({
		albumName: '',
		eventDate: '',
		albumNameError: false,
		eventDateError: false,
	});

	const handleAlbumNameChange = (e, name) => {
		if (name === 'album') {
			const albumName = e.target.value;
			setInfo((prevInfo) => ({
				...prevInfo,
				albumName,
				albumNameError: !albumName.trim(),
			}));
		} else {
			setInfo((prevInfo) => ({
				...prevInfo,
				eventDate: e,
				eventDateError: !e,
			}));
		}
	};
	const handleCreateAlbum = () => {
		const albumNameError = !info.albumName.trim();
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
			slug: info.albumName,
			title: info.albumName,
			eventDateEpoch: new Date(info.eventDate).getTime() / 1000,
		};
		createNewAlbum(payload, galleryId);
		closeModal();
		setInfo({
			albumName: '',
			eventDate: '',
		});
	};

	return (
		<ReactModal isOpen={open} closeModal={closeModal}>
			<div className="createAlbumMainContainer">
				<div className="createAlbumHeading">
					<p className="heading">Create New Album</p>
					<p className="close" onClick={closeModal}>
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
					</div>
					<div className="inputs">
						<label>Event date</label>
						<DatePicker
							className="datePicker"
							format="YYYY-MM-DD"
							selected={info.eventDate}
							onChange={(date, dateString) =>
								handleAlbumNameChange(dateString, 'date')
							}
						/>
						{info?.eventDateError && <p className="error">Album Date is Required</p>}
					</div>
				</div>
				<div className="createButton" onClick={() => handleCreateAlbum()}>
					Create & more
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(CreateAlbum);
