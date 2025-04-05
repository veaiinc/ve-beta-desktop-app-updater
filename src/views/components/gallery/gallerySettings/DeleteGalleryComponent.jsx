import React, { useState, useContext } from 'react';
import { ReactComponent as DeleteLogo } from '../../../../assets/svg/gallery/delete.svg';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/close.svg';
import { message } from '../../globalComponents/CustomToast';
import { useNavigate } from 'react-router-dom';
import Context from '../../../../context/context';

const DeleteGalleryComponent = ({ galleryName, galleryId }) => {
	const {
		galleryInfo: { getGalleries, deleteGallery },
	} = useContext(Context);
	const [deleteInfo, setdeleteInfo] = useState({
		showConfirmInput: false,
		inputValue: '',
		isLoading: false,
	});

	const navigate = useNavigate();

	const handleDeleteFunction = async () => {
		setdeleteInfo({ ...deleteInfo, isLoading: true });
		message.loading('Your gallery is being removed. Please wait...');
		const response = await deleteGallery(galleryId);

		if (response[0] === true) {
			message.success('Gallery deleted successfully');
			navigate('/galleries');
		} else {
			message.error(response[1].message);
		}
		setdeleteInfo({ ...deleteInfo, isLoading: false });
	};
	return (
		<div id="delete" className="settings-overview">
			<div className="delete-container">
				{/* <div style={{ padding: '4px' }}>
					<DeleteLogo />
				</div> */}
				<div className="delete-content">
					<p className="heading">Delete Gallery </p>
					<p className="subTitle">
						You cannot undo this. All your albums and information will be lost.
					</p>
					<div className="deletePermanently">
						{deleteInfo.showConfirmInput ? (
							<>
								<input
									type="text"
									placeholder={`Please Enter '${galleryName}'`}
									value={deleteInfo.inputValue}
									onChange={(e) =>
										setdeleteInfo({ ...deleteInfo, inputValue: e.target.value })
									}
								/>

								<button
									style={{
										opacity: deleteInfo.inputValue !== galleryName ? 0.5 : 1,
										cursor:
											deleteInfo.inputValue !== galleryName
												? 'not-allowed'
												: 'pointer',
									}}
									disabled={
										deleteInfo.inputValue !== galleryName ||
										deleteInfo.isLoading
									}
									onClick={handleDeleteFunction}
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
								onClick={() =>
									setdeleteInfo({ ...deleteInfo, showConfirmInput: true })
								}
							>
								Delete permanently
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default DeleteGalleryComponent;
