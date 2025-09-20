import { useState } from 'react';
import PropTypes from 'prop-types';
import './UpdateReadyPopup.scss';

const UpdateReadyPopup = ({ updateInfo, onRestart, onDismiss }) => {
	const [isRestarting, setIsRestarting] = useState(false);
	const [restartError, setRestartError] = useState(null);

	if (!updateInfo) {
		return null;
	}

	const { version, message, releaseName } = updateInfo;

	const handleRestartClick = async () => {
		if (!onRestart) {
			return;
		}

		setRestartError(null);
		setIsRestarting(true);

		try {
			const result = await onRestart();
			if (result && result.success === false) {
				setRestartError(result.error || 'Unable to restart the app.');
				setIsRestarting(false);
			}
		} catch (error) {
			setRestartError(error?.message || 'Unable to restart the app.');
			setIsRestarting(false);
		}
	};

	return (
		<div className="update-ready-popup" role="status" aria-live="polite">
			<div className="update-ready-popup__header">
				<span className="update-ready-popup__title">Update ready to install</span>
				{onDismiss && (
					<button
						type="button"
						className="update-ready-popup__close"
						onClick={onDismiss}
						aria-label="Dismiss update notification"
					>
						Close
					</button>
				)}
			</div>

			<p className="update-ready-popup__message">
				{message ||
					`Version ${version || ''} downloaded. Restart to apply when you're ready.`}
			</p>

			{restartError && <p className="update-ready-popup__error">{restartError}</p>}

			<button
				type="button"
				className="update-ready-popup__restart"
				onClick={handleRestartClick}
				disabled={isRestarting}
			>
				{isRestarting ? 'Restarting...' : 'Restart now'}
			</button>
		</div>
	);
};

UpdateReadyPopup.propTypes = {
	updateInfo: PropTypes.shape({
		version: PropTypes.string,
		message: PropTypes.string,
		releaseName: PropTypes.string,
		status: PropTypes.string,
	}).isRequired,
	onRestart: PropTypes.func,
	onDismiss: PropTypes.func,
};

UpdateReadyPopup.defaultProps = {
	onRestart: undefined,
	onDismiss: undefined,
};

export default UpdateReadyPopup;
