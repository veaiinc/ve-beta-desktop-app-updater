import React from 'react';
import ReactModal from '../index';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as RefreshSvg } from '../../../../assets/svg/sidebar/Refresh.svg';

const ShareAlbum = (props) => {
	const customStyles = {
		content: { zIndex: 99999 },
		overlay: { zIndex: 99998 },
	};
	const { open, onClose, onCopyLink, link, pin } = props;
	return (
		<ReactModal isOpen={open} onClose={onClose} customStyles={customStyles}>
			<div className="shareAlbumPopupContainer">
				<div className="shareAlbumPopupContent">
					<div className="shareAlbumPopupCloseButton">
						<div className="shareAlbumPopupHeading">Album Link</div>
						<CrossSvg onClick={onClose} style={{ cursor: 'pointer' }} />
					</div>
					<div className="shareAlbumPopupInputContainer">
						<p className="shareAlbumPopupInputText">{link}</p>
					</div>
				</div>
				<div className="shareAlbumPopupFooter">
					<div className="shareAlbumPopupFooterPin">Pin</div>
					<div className="shareAlbumPopupPinInputContainer">
						<input
							type="text"
							value={pin}
							placeholder="5555"
							className="shareAlbumPopupPinInput"
							style={{ color: '#939393' }}
						/>
						<RefreshSvg style={{ cursor: 'pointer', alignSelf: 'center' }} />
					</div>
				</div>
				<div style={{ alignSelf: 'flex-end' }}>
					<button
						style={{ cursor: 'pointer' }}
						className="shareAlbumPopupCopyLinkButton"
						onClick={onCopyLink}
					>
						Copy Link
					</button>
				</div>
			</div>
			);
		</ReactModal>
	);
};

export default ShareAlbum;
