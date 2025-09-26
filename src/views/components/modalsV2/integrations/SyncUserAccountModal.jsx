// import React, { useEffect, useRef, useContext, useState } from 'react';
// import { DatePicker } from 'antd';
// import Context from '../../../../context/context';
// import moment from 'moment';

// const SyncUserAccountModal = ({ isOpen, closeModal, connectedIntegration }) => {
// 	const {
// 		templates: { syncUserAccount },
// 	} = useContext(Context);
// 	const modalRef = useRef(null);
// 	useEffect(() => {}, []);
// 	const [info, setInfo] = useState({
// 		startDate: null,
// 		endDate: null,
// 		isDateSelected: false,
// 	});

// 	const toISTIso = (d) => {
// 		return moment(d).format('YYYY-MM-DD');
// 	};
// 	const handleSync = async () => {
// 		let datePayload = {
// 			startDate: info.startDate,
// 			endDate: info.endDate,
// 		};
// 		if (!info.isDateSelected) {
// 			datePayload = null;
// 		}
// 		let response = await syncUserAccount(
// 			datePayload,
// 			connectedIntegration?.connectType,
// 			connectedIntegration?._id,
// 		);
// 		console.log('response==>', response);
// 	};
// 	console.log('info==>', info.startDate, info.endDate, connectedIntegration?._id);
// 	return (
// 		<div className="sync-user-account-modal" ref={modalRef}>
// 			<div className="sync-user-account-modal-content">
// 				<div className="sync-user-account-modal-title-container">
// 					<span className="sync-user-account-modal-title">select start date </span>
// 					<span
// 						onClick={() => closeModal(false)}
// 						className="sync-user-account-modal-title-close"
// 					>
// 						x
// 					</span>
// 				</div>
// 				<DatePicker
// 					value={info.startDate}
// 					onChange={(date) =>
// 						setInfo((prev) => ({
// 							...prev,
// 							startDate: toISTIso(date),
// 							isDateSelected: true,
// 						}))
// 					}
// 				/>{' '}
// 				<span className="sync-user-account-modal-title">select end date </span>
// 				<DatePicker
// 					value={info.endDate}
// 					onChange={(date) =>
// 						setInfo((prev) => ({
// 							...prev,
// 							endDate: toISTIso(date),
// 							isDateSelected: true,
// 						}))
// 					}
// 				/>
// 				<div onClick={() => handleSync()} className="sync-user-account-modal-button">
// 					Sync
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default SyncUserAccountModal;
