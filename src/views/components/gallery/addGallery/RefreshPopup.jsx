import React, { useEffect } from 'react';
import ReactModal from '../../modalsV2';

const RefreshPopup = ({ info, setinfo }) => {
	useEffect(() => {
		window.addEventListener('beforeunload', (event) => {
			event.preventDefault();
			setinfo((prev) => ({
				...prev,
				isRefreshPopupOpen: true,
			}));
		});
	}, []);

	const cancelRefresh = () => {
		setinfo((prev) => ({
			...prev,
			isRefreshPopupOpen: false,
		}));
	};

	const refreshFunction = () => {
		window.location.reload();
	};

	return (
		<ReactModal isOpen={info.isRefreshPopupOpen} closeModal={cancelRefresh}>
			<div className="upload-completed-popup">
				<h1>Are you sure you want to refresh?</h1>

				<div className="options_div">
					<button className="back-to-gallery-button" onClick={cancelRefresh}>
						Cancel
					</button>
					<button className="re-upload-button" onClick={refreshFunction}>
						Yes, Continue
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default RefreshPopup;
