import React, { memo, useState } from 'react';
import ReactModal from '../../modalsV2';
import '../../../../assets/scss/gallery/modals/moveToAlbumPopup.scss';
import { ReactComponent as CrossWhite } from '../../../../assets/svg/workspaceSettings/cross.svg';
import { ReactComponent as BackArrow } from '../../../../assets/svg/gallery/backArrow.svg';
import { ReactComponent as Circle } from '../../../../assets/svg/gallery/add-circle.svg';

const MoveToAlbumPopup = ({ open, closeModal, albums, albumName, moveImageToAlbum }) => {
	const [info, setInfo] = useState({
		selectedAlbumId: null,
	});
	const handleAlbumClick = (id) => {
		setInfo({
			...info,
			selectedAlbumId: id,
			showError: false,
		});
	};
	const handleCloseModal = () => {
		setInfo({
			...info,
			selectedAlbumId: null,
		});
		closeModal();
	};
	const handleMoveToAlbum = () => {
		moveImageToAlbum(info?.selectedAlbumId);
		if (!info?.selectedAlbumId) {
			setInfo((prev) => ({
				...prev,
				showError: true,
			}));
			return;
		}
		closeModal();
		setInfo({
			...info,
			selectedAlbumId: null,
		});
	};
	return (
		<ReactModal isOpen={open} closeModal={handleCloseModal} modalType={'center'}>
			<div className="moveToAlbumPopupMainContainer">
				<div className="headingContainer">
					<p className="heading">Move to Other Albums</p>
					<CrossWhite onClick={handleCloseModal} />
				</div>
				<div className="albumContainer">
					<div className="listAlbums">
						<div className="currentAlbum">
							<BackArrow />
							<p className="activeAlbum">{albumName}</p>
						</div>
						<div className="listAlbumsContainer">
							{albums?.map((album) => (
								<div
									className={`albumCard ${
										info.selectedAlbumId === album?._id ? 'active' : ''
									}`}
									onClick={() => handleAlbumClick(album?._id)}
								>
									<p className="albumName">{album?.title}</p>
									<p className="albumCount">{album?.imagesCount} items</p>
								</div>
							))}
						</div>
					</div>
					<div className="createNewAlbumContainer">
						<Circle />
						<p>Create new album</p>
					</div>
					{info?.showError && <p className="errorText">Please select an album</p>}
					<div className="buttonContainer">
						<p className="cancelButton" onClick={handleCloseModal}>
							Cancel
						</p>
						<p className="moveToAlbumButton" onClick={handleMoveToAlbum}>
							Move
						</p>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(MoveToAlbumPopup);
