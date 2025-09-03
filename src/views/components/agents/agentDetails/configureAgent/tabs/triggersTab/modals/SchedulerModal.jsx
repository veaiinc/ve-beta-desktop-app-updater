import { memo, useState } from 'react';
import { message } from '../../../../../../../components/globalComponents/CustomToast';
import s from './schedulerModal.module.scss';

const recurrenceOptions = [
	{ value: 'Select Recurrence', label: 'Select Recurrence' },
	{ value: 'hourly', label: 'Hourly' },
	{ value: 'daily', label: 'Daily' },
	{ value: 'weekly', label: 'Weekly' },
	{ value: 'monthly', label: 'Monthly' },
	{ value: 'yearly', label: 'Yearly' },
];
const SchedulerModal = ({
	isOpen,
	onClose,
	handleConnectToSchedulerTrigger,
	isLoading = false,
}) => {
	const [info, setInfo] = useState({
		selectedDateTime: '',
		recurrence: 'Select Recurrence',
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
			if (info.recurrence === 'Select Recurrence') {
				await handleConnectToSchedulerTrigger(selectedTimestamp);
			} else {
				await handleConnectToSchedulerTrigger(selectedTimestamp, info.recurrence);
			}
			onClose();
		} catch (error) {
			console.error('Error connecting scheduler trigger:', error);
		}
	};

	const handleClose = () => {
		setInfo({ selectedDateTime: '', recurrence: 'Select Recurrence' });
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className={s.modalOverlay} onClick={handleClose}>
			<div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
				<div className={s.modalHeader}>
					<h2 className={s.modalTitle}>Schedule Trigger</h2>
					<button className={s.closeButton} onClick={handleClose} disabled={isLoading}>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className={s.modalBody}>
					<div className={s.formGroup}>
						<label htmlFor="datetime" className={s.formLabel}>
							Select Date and Time:
						</label>
						<input
							type="datetime-local"
							id="datetime"
							className={s.dateTimeInput}
							value={info.selectedDateTime}
							onChange={(e) =>
								setInfo((prev) => ({ ...prev, selectedDateTime: e.target.value }))
							}
							min={new Date().toISOString().slice(0, 16)}
							required
							disabled={isLoading}
						/>
					</div>

					<div className={s.formGroup}>
						<label htmlFor="recurrence" className={s.formLabel}>
							Recurrence:
						</label>
						<select
							id="recurrence"
							className={s.recurrenceSelect}
							value={info.recurrence}
							onChange={(e) =>
								setInfo((prev) => ({ ...prev, recurrence: e.target.value }))
							}
							disabled={isLoading}
						>
							{recurrenceOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
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
