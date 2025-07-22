import React, { useEffect, useState } from 'react';
import ImageLibrary from '../../imageLibrary';
import Modal from '../../library/modals/index';
import { ReactComponent as Edit } from '../../../../assets/svg/edit.svg';
import { ReactComponent as Delete } from '../../../../assets/svg/delete.svg';

const MetaImage = ({ handleImageUploadGlobal, imageUrl }) => {
	const [info, setInfo] = useState({
		showLibrary: false,
		libaryUrl: imageUrl || null,
		showEdit: false,
	});
	const handleImageUpload = () => {
		setInfo((prev) => ({
			...prev,
			showLibrary: true,
		}));
	};
	const handleImageLibrary = (type, url) => {
		setInfo((prev) => ({
			...prev,
			libaryUrl: url,
		}));
		handleImageUploadGlobal(url);
	};
	const handleImageDelete = () => {
		setInfo((prev) => ({
			...prev,
			libaryUrl: null,
		}));
		handleImageUploadGlobal(null);
	};
	const handleCloseLibrary = () => {
		setInfo((prev) => ({
			...prev,
			showLibrary: false,
		}));
	};
	useEffect(() => {
		if (imageUrl && imageUrl !== info.libaryUrl) {
			setInfo((prev) => ({
				...prev,
				libaryUrl: imageUrl,
			}));
		}
	}, [imageUrl]);
	return (
		<div className="metaimage-container">
			<div className="metaImage-wrapper">
				{info?.libaryUrl ? (
					<div
						onMouseEnter={() => setInfo((prev) => ({ ...prev, showEdit: true }))}
						onMouseLeave={() => setInfo((prev) => ({ ...prev, showEdit: false }))}
						className="image-container"
					>
						<img
							style={{ objectFit: 'cover', borderRadius: '4px' }}
							src={info?.libaryUrl}
							height={'30px'}
							width={'30px'}
						/>
						{info?.showEdit && (
							<>
								<div onClick={handleImageUpload} className="edit-icon">
									<Edit />
								</div>
								<div onClick={handleImageDelete} className="delete-icon">
									<Delete />
								</div>
							</>
						)}
					</div>
				) : (
					<div onClick={(e) => handleImageUpload(e)} className="image-upload">
						<div className="upload-image-text">upload image</div>
					</div>
				)}
			</div>
			{info.showLibrary && (
				<Modal
					show={info.showLibrary}
					handleClose={(e) => {
						handleCloseLibrary(e);
					}}
					modalType={'center'}
				>
					<ImageLibrary
						close={(e) => {
							setInfo((prev) => ({
								...prev,
								showLibrary: false,
							}));
						}}
						setLibraryImage={(e) => {
							handleImageLibrary('library', e);
						}}
					/>
				</Modal>
			)}
		</div>
	);
};

export default MetaImage;
