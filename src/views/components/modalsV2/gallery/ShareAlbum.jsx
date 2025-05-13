import React, { useRef } from 'react';
import ReactModal from '../index';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as Copy } from '../../../../assets/svg/gallery/copy.svg';
import { message } from '../../globalComponents/CustomToast';

const ShareAlbum = (props) => {
	const customStyles = {
		content: { zIndex: 999 },
		overlay: { zIndex: 998 },
	};
	const { open, onClose, onCopyLink, link, shouldShow } = props;

	const inputRef = useRef(null);

	const handleCopy = () => {
		if (inputRef.current) {
			navigator.clipboard
				.writeText(inputRef.current.value)
				.then(() => {
					message.success('PIN copied to clipboard!');
				})
				.catch((err) => {
					message.error('Failed to copy!');
				});
		}
	};
	return (
		<ReactModal isOpen={open} closeModal={onClose} customStyles={customStyles}>
			<div className="shareAlbumPopupContainer">
				<div className="shareAlbumPopupContent">
					<div className="shareAlbumPopupCloseButton">
						<div className="shareAlbumPopupHeading">Album Link</div>
						<CrossSvg onClick={onClose} style={{ cursor: 'pointer' }} />
					</div>
					<div className="shareAlbumPopupInputContainer">
						<p className="shareAlbumPopupInputText">{link?.url}</p>
					</div>
				</div>
				{shouldShow && (
					<div className="shareAlbumPopupFooter">
						<div className="shareAlbumPopupFooterPin">Pin</div>
						<div className="shareAlbumPopupPinInputContainer">
							<input
								ref={inputRef}
								type="text"
								value={link?.pin}
								placeholder={link?.pin}
								className="shareAlbumPopupPinInput"
								style={{ color: '#939393' }}
							/>
							<Copy
								style={{ cursor: 'pointer', alignSelf: 'center' }}
								onClick={handleCopy}
							/>
						</div>
					</div>
				)}
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
