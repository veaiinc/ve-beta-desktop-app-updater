import { useContext, useEffect, useRef, useState } from 'react';
import ReactModal from '../index';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as Copy } from '../../../../assets/svg/gallery/copy.svg';
import { message } from '../../globalComponents/CustomToast';
import Context from '../../../../context/context';

const customStyles = {
	content: { zIndex: 999 },
	overlay: { zIndex: 998 },
};
const ShareAlbum = (props) => {
	const inputRef = useRef(null);
	const { open, onClose, onCopyLink, link, shouldShowPin, galleryId, albumSlug, albumId } = props;
	const {
		galleryInfo: { editAlbumAccessPin, getAlbumCount, albumDetails },
	} = useContext(Context);

	const [info, setInfo] = useState({
		pin: albumDetails?.guestAccess?.pin,
	});
	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			pin: albumDetails?.guestAccess?.pin,
		}));
	}, [albumDetails]);

	const handlePinChange = async (e) => {
		const value = e.target.value;
		setInfo((prev) => ({
			...prev,
			pin: value,
		}));
		if (/^\d{0,3}$/.test(value)) {
			// check if the value is a number and has 0-3 digits
			if (value.length === 3) {
				const payload = { accessPin: value, pin: true };
				const response = await editAlbumAccessPin(payload, galleryId, albumSlug);
				if (response?.[0]) {
					onClose();
					getAlbumCount(galleryId, albumId);
				}
			}
		}
	};
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
				{shouldShowPin && (
					<div className="shareAlbumPopupFooter">
						<div className="shareAlbumPopupFooterPin">Pin</div>
						<div className="shareAlbumPopupPinInputContainer">
							<input
								ref={inputRef}
								type="text"
								value={info?.pin}
								placeholder={info?.pin}
								className="shareAlbumPopupPinInput"
								style={{ color: '#939393' }}
								onChange={(e) => handlePinChange(e)}
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
		</ReactModal>
	);
};

export default ShareAlbum;
