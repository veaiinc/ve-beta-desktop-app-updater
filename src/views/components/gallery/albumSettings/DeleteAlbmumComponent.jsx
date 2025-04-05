import React, { useState, useContext } from 'react';
import { ReactComponent as DeleteLogo } from '../../../../assets/svg/gallery/delete.svg';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/close.svg';
import { message } from '../../globalComponents/CustomToast';
import { useNavigate } from 'react-router-dom';
import Context from '../../../../context/context';

const DeleteAlbmumComponent = ({ albumName, galleryId, albumId }) => {
	const {
		galleryInfo: { getAlbums, deleteAlbum },
	} = useContext(Context);
	const [deleteInfo, setdeleteInfo] = useState({
		showConfirmInput: false,
		inputValue: '',
		isLoading: false,
	});

	const navigate = useNavigate();

	const handleDeleteFunction = async () => {
		setdeleteInfo({ ...deleteInfo, isLoading: true });
		message.loading('Your album is being removed. Please wait...');
		const response = await deleteAlbum(galleryId, albumId);

		if (response[0] === true) {
			message.success('Album deleted successfully');
			getAlbums(galleryId);
			navigate(`/galleries/${galleryId}`);
		} else {
			message.error(response[1].message);
		}
		setdeleteInfo({ ...deleteInfo, isLoading: false });
	};
	return (
		<div className="delete-container">
			<div style={{ padding: '4px' }}>
				<DeleteLogo />
			</div>
			<div className="delete-content">
				<p className="title">Delete Album</p>
				<p className="subtitle">
					You cannot undo this. All your albums and information will be lost.
				</p>
				<div className="delete">
					{deleteInfo.showConfirmInput ? (
						<>
							<input
								type="text"
								placeholder={`Please Enter '${albumName}'`}
								value={deleteInfo.inputValue}
								onChange={(e) =>
									setdeleteInfo({ ...deleteInfo, inputValue: e.target.value })
								}
							/>

							<button
								onClick={handleDeleteFunction}
								style={{
									opacity: deleteInfo.inputValue !== albumName ? 0.5 : 1,
									cursor:
										deleteInfo.inputValue !== albumName
											? 'not-allowed'
											: 'pointer',
								}}
								disabled={
									deleteInfo.inputValue !== albumName || deleteInfo.isLoading
								}
							>
								Delete
							</button>

							<CloseSvg
								onClick={() =>
									setdeleteInfo({ ...deleteInfo, showConfirmInput: false })
								}
							/>
						</>
					) : (
						<button
							onClick={() => setdeleteInfo({ ...deleteInfo, showConfirmInput: true })}
						>
							Delete permanently
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default DeleteAlbmumComponent;
