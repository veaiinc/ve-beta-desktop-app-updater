import React, { memo, useCallback, useEffect, useState } from 'react';
import '../../../../assets/scss/sales/moveToStageModal.scss';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';

const options = [
	{ label: 'File Sent', value: 'filesSent' },
	{ label: 'Contract Signed', value: 'contractSigned' },
	// { label: 'Booking Confirmed', value: 'confirmed' },
	// { label: 'Expired', value: 'expired' },
];

const MoveStageModal = ({
	open,
	closeModal,
	moveStageFunc,
	changelocalWorflowStatus,
	noContractTemplate,
}) => {
	const [info, setInfo] = useState({
		selectedStage: options?.[0],
		loading: false,
		moveStageOptions: options,
	});

	useEffect(() => {
		if (noContractTemplate) {
			const updatedOptions = [...options];
			let i;
			for (i = 0; i < updatedOptions.length; i++) {
				if (updatedOptions?.[i]?.value === 'contractSigned') {
					break;
				}
			}

			updatedOptions?.splice(i, 1);
			setInfo((prev) => ({ ...prev, moveStageOptions: updatedOptions }));
		}
	}, [noContractTemplate]);

	const onChangeFunc = useCallback(
		async (data) => {
			if (info?.selectedStage?.value === data?.value || data?.value === 'expired') {
				return;
			}
			setInfo((prev) => ({ ...prev, selectedStage: data }));
		},
		[info?.selectedStage],
	);

	const moveFunc = useCallback(async () => {
		if (info?.loading) {
			return;
		}
		setInfo((prev) => ({ ...prev, loading: true }));
		const data = info?.selectedStage?.value;
		const resposne = await moveStageFunc(data);
		setInfo((prev) => ({ ...prev, loading: false }));
		if (resposne?.[0]) {
			if (data === 'filesSent') {
				changelocalWorflowStatus('filesSent');
			}
			if (data === 'contractSigned') {
				changelocalWorflowStatus('contractSigned');
			}
			closeModal();
			// if (data === 'confirmed') {
			// 	changelocalWorflowStatus('confirmed');
			// } else {
			// 	changelocalWorflowStatus('expired');
			// }
		}
	}, [info?.selectedStage, info?.loading]);

	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="movetoStageModalParentContainer">
				<div className="movetoStageHeaderContainer">
					<span className="headerTitle">Move *Client Name* down the pipeline</span>
					<span className="closeBtnWrapper" onClick={closeModal}>
						<Close />
					</span>
				</div>

				{/* //dropDown */}
				<div className="dropDownContainer">
					<span className="dropDownLabel">Select Workflow Stage</span>
					<HeadersDropDownComp
						selectedValue={info?.selectedStage?.label || ''}
						options={info?.moveStageOptions}
						containerStyle={{
							display: 'flex',
							padding: '11px 14px',
							justifyContent: 'center',
							alignItems: 'center',
							gap: '10px',
							alignSelf: 'stretch',
							borderRadius: '10px',
							border: '1px solid rgba(36, 36, 36, 0.64)',
							width: '532px',
						}}
						dropDownStyle={{
							top: '50px',
							left: 'unset',
							width: 'auto',
							height: 'auto',
							width: '100%',
						}}
						outerContainerStyle={{ width: 'auto' }}
						onChangeFunc={(e) => onChangeFunc(e)}
					/>
				</div>

				<div className="btnContainer">
					<div className="moveToStageBTn" onClick={moveFunc}>
						{info?.loading ? 'Moving ...' : 'Move'}
					</div>
					<div className="cancelBtn" onClick={closeModal}>
						Cancel
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(MoveStageModal);
