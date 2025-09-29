import { React, useState, useContext } from 'react';
import { ReactComponent as CloseIcon } from '../../../../assets/svg/close.svg';
import { DatePicker, message } from 'antd';
import Context from '../../../../context/context';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Spinner from '../../loaders/Spinner';

// Extend dayjs with UTC plugin only
dayjs.extend(utc);

const SyncAccountModal = ({ closeSyncModal, connectedIntegration, closeModal }) => {
	const {
		templates: { syncUserAccount },
	} = useContext(Context);
	const [info, setInfo] = useState({
		startDate: null,
		endDate: null,
		isError: false,
		isLoading: false,
	});

	const handleClose = () => {
		closeSyncModal();
	};

	// Function to generate timestamp in format: 2025-09-26T11:54:02.649Z
	const generateUTCTimestamp = (date, isEndDate = false) => {
		if (!date) return null;

		return dayjs(date)
			.set('hour', isEndDate ? 23 : 0)
			.set('minute', isEndDate ? 59 : 0)
			.set('second', isEndDate ? 59 : 0)
			.set('millisecond', isEndDate ? 999 : 0)
			.utc()
			.toISOString();
	};

	const handleDateChange = (date, field) => {
		const isEndDate = field === 'endDate';
		const timestamp = generateUTCTimestamp(date, isEndDate);

		setInfo((prev) => ({
			...prev,
			[field]: timestamp ? date : null,
			[`${field}Timestamp`]: timestamp,
			isError: false,
		}));
	};

	const handleSyncAccount = async () => {
		if ((!info.startDate && !info.endDate) || (info.startDate && info.endDate)) {
			setInfo((prev) => ({ ...prev, isError: false }));

			if (info.startDate && info.endDate) {
				if (dayjs(info.endDate).isBefore(info.startDate)) {
					message.error('End date cannot be before start date');
					setInfo((prev) => ({ ...prev, isError: true }));
					return;
				}

				const dateRange = {
					startDate: info.startDateTimestamp,
					endDate: info.endDateTimestamp,
				};

				setInfo((prev) => ({ ...prev, isLoading: true }));
				const response = await syncUserAccount(
					connectedIntegration?.connectType,
					connectedIntegration?._id,
					dateRange,
				);

				if (response?.[0]) {
					message.success('Synced successfully');
					setInfo((prev) => ({ ...prev, isLoading: false }));
					closeModal();
				} else {
					message.error('Sync failed');
					setInfo((prev) => ({ ...prev, isLoading: false }));
				}
			} else {
				const response = await syncUserAccount(
					connectedIntegration?.connectType,
					connectedIntegration?._id,
				);

				if (response?.[0]) {
					message.success('Synced successfully');
					setInfo((prev) => ({ ...prev, isLoading: false }));
				} else {
					message.error('Sync failed');
					setInfo((prev) => ({ ...prev, isLoading: false }));
				}
			}
		} else {
			setInfo((prev) => ({ ...prev, isError: true }));
		}
	};

	return (
		<div className="sync-account-modal">
			<div className="modal-content-wrapper">
				<div className="sync-modal-header">
					<CloseIcon onClick={handleClose} className="close-button" />
				</div>

				<div className="sync-modal-body">
					<span>Select start date</span>
					<DatePicker
						value={info.startDate}
						onChange={(date) => handleDateChange(date, 'startDate')}
						className="date-picker"
						format="DD/MM/YYYY"
						placeholder="Select start date"
					/>
				</div>

				<div className="sync-modal-body">
					<span>Select end date</span>
					<DatePicker
						value={info.endDate}
						onChange={(date) => handleDateChange(date, 'endDate')}
						className="date-picker"
						format="DD/MM/YYYY"
						placeholder="Select end date"
					/>
				</div>

				{info.isError && (
					<div className="sync-modal-body-error">
						Please select both start and end date or correct date range
					</div>
				)}

				<div className="sync-modal-footer">
					{info.isLoading ? (
						<Spinner width="24px" height="24px" />
					) : (
						<div onClick={handleSyncAccount} className="sync-modal-footer-button">
							Sync
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SyncAccountModal;
