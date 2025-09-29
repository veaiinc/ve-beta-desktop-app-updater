import { memo, useState } from 'react';
import styles from './UpdateReadyPopup.module.scss';
import { RotateCcw } from 'lucide-react';

const UpdateReadyPopup = ({ updateInfo, onRestart, onDismiss }) => {
	const [isRestarting, setIsRestarting] = useState(false);
	const [restartError, setRestartError] = useState(null);

	if (!updateInfo) {
		return null;
	}

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
		<div
			className={styles.updateReadyPopup}
			role="dialog"
			aria-live="polite"
			aria-labelledby="update-title"
			aria-describedby="update-description"
		>
			<div className={styles.content}>
				<h2 id="update-title" className={styles.title}>
					There's a new version available
				</h2>
				<p id="update-description" className={styles.subtitle}>
					'Refresh to get the latest features and improvements'
				</p>
			</div>

			{restartError && (
				<div className={styles.error} role="alert">
					{restartError}
				</div>
			)}

			<div className={styles.actions}>
				{onDismiss && (
					<button
						type="button"
						className={styles.dismissButton}
						onClick={onDismiss}
						aria-label="Dismiss update notification"
					>
						Dismiss
					</button>
				)}
				<button
					type="button"
					className={styles.refreshButton}
					onClick={() => {}}
					disabled={handleRestartClick}
					aria-describedby="update-description"
				>
					<span className={styles.refreshIcon}>
						<RotateCcw size={12} />
					</span>
					{isRestarting ? 'Refreshing...' : 'Refresh now'}
				</button>
			</div>
		</div>
	);
};
export default memo(UpdateReadyPopup);
