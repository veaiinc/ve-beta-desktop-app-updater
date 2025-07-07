import { memo, useState } from 'react';
import { message } from '../../../../../../../components/globalComponents/CustomToast';
import s from './schedulerModal.module.scss';

const SchedulerModal = ({
	isOpen,
	onClose,
	handleConnectToSchedulerTrigger,
	isLoading = false,
}) => {
	const [info, setInfo] = useState({
		selectedDateTime: '',
	});

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!info.selectedDateTime) {
			message.error('Please select a date and time');
			return;
		}

		const selectedTimestamp = Math.floor(new Date(info.selectedDateTime).getTime() / 1000);
		const currentTimestamp = Math.floor(Date.now() / 1000);

		if (selectedTimestamp <= currentTimestamp) {
			message.error('Please select a future date and time');
			return;
		}

		try {
			await handleConnectToSchedulerTrigger(selectedTimestamp);
			onClose();
		} catch (error) {
			console.error('Error connecting scheduler trigger:', error);
		}
	};

	const handleClose = () => {
		setInfo({ selectedDateTime: '' });
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className={s.modalOverlay} onClick={handleClose}>
			<div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
				<div className={s.modalHeader}>
					<h2>Schedule Trigger</h2>
					<button className={s.closeButton} onClick={handleClose} disabled={isLoading}>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className={s.modalBody}>
					<div className={s.formGroup}>
						<label htmlFor="datetime">Select Date and Time:</label>
						<input
							type="datetime-local"
							id="datetime"
							value={info.selectedDateTime}
							onChange={(e) =>
								setInfo((prev) => ({ ...prev, selectedDateTime: e.target.value }))
							}
							min={new Date().toISOString().slice(0, 16)}
							required
							disabled={isLoading}
						/>
					</div>

					<div className={s.modalFooter}>
						<button
							type="button"
							className={s.cancelButton}
							onClick={handleClose}
							disabled={isLoading}
						>
							Cancel
						</button>
						<button
							type="submit"
							className={s.submitButton}
							disabled={isLoading || !info.selectedDateTime}
						>
							{isLoading ? 'Connecting...' : 'Connect Trigger'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default memo(SchedulerModal);
