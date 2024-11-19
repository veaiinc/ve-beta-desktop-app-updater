import React, { memo, useCallback, useEffect, useState } from 'react';
import { ReactComponent as BackArrowSvg } from '../../../assets/svg/workflow/backarrow.svg';
import { ReactComponent as ThreeDots } from '../../../assets/svg/workflow/threeDots.svg';
import { useNavigate } from 'react-router-dom';
import HeadersDropDownComp from '../dropDown/HeadersDropDownComp';
import Spinner from '../loaders/Spinner';

const options = [
	{ label: 'Edit' },
	{ label: 'Resend File' },
	{ label: 'Send Email' },
	{ label: 'Move Stage' },
	// { label: 'Delete File' },
	{ label: 'Delete Lead' },
];

const SmartFileHeader = ({
	activeTab,
	chnageActiveTab,
	openSendSmartFileModal,
	clientDetails,
	workflowStatus,
	acceptProposalFunc,
	openSignatureModal,
	editable,
	changeEditStatus,
	openMoveToStageModal,
	openDeleteModal,
	onPreviewClick,
	noContractTemplate,
	counterAccpetOnClick,
}) => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		loading: false,
		threeDotOptions: options,
		previewLoader: false,
		counterAccpetLoading: false,
	});

	const modifiedAccetFunc = useCallback(async () => {
		if (info?.loading) {
			return;
		}
		setInfo((prev) => ({ ...prev, loading: true }));
		const response = await acceptProposalFunc();
		if (response?.[0]) {
			setInfo((prev) => ({ ...prev, loading: false }));
		}
	}, []);

	const onOptionChangeFunc = useCallback(
		async (data) => {
			if (data?.label === 'Edit') {
				if (editable) {
					return;
				} else {
					changeEditStatus(true);
				}
			}
			if (data?.label === 'Move Stage') {
				openMoveToStageModal();
			}
			if (data?.label === 'Send Email') {
				openSendSmartFileModal();
			}
			if (data?.label === 'Resend File') {
				openSendSmartFileModal();
			}
			if (data?.label === 'Delete Lead') {
				openDeleteModal();
			}
		},
		[editable],
	);

	useEffect(() => {
		if (workflowStatus) {
			let modifiedOptions = [...options];
			if (workflowStatus === 'filesSent' || workflowStatus === 'filesViewed') {
				modifiedOptions = [
					{ label: 'Edit' },
					{ label: 'Resend File' },
					{ label: 'Send Email' },
					// { label: 'Delete File' },
					{ label: 'Delete Lead' },
				];
			} else {
				modifiedOptions = [
					{ label: 'Resend File' },
					{ label: 'Send Email' },
					{ label: 'Move Stage' },
					// { label: 'Delete File' },
					{ label: 'Delete Lead' },
				];
			}

			setInfo((prev) => ({ ...prev, threeDotOptions: modifiedOptions }));
		}
	}, [workflowStatus]);

	const modifiedPreviewClick = useCallback(() => {
		setInfo((prev) => ({ ...prev, previewLoader: true }));
		onPreviewClick();
	}, []);

	const onCounterAcceptClickFunc = useCallback(async () => {
		if (info?.counterAccpetLoading) {
			return;
		}
		setInfo((prev) => ({ ...prev, counterAccpetLoading: true }));
		const respose = await counterAccpetOnClick();
		if (respose?.[0]) {
			setInfo((prev) => ({ ...prev, counterAccpetLoading: false }));
		}
	}, [info?.counterAccpetLoading]);

	return (
		<div className="smarFileHeader">
			<div className="HeaderContentContainer">
				<div className="BackBtnContainer" onClick={() => navigate(-1)}>
					{' '}
					<span className="svgWrapper">
						<BackArrowSvg />
					</span>
					{clientDetails?.name}
				</div>
				<div className="tabBtnContainer">
					<span
						className="tabBtns"
						style={{ color: activeTab === 'form' ? '#e4e5e6' : '' }}
						onClick={() => chnageActiveTab('form')}
					>
						Form Response
					</span>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						{workflowStatus !== 'filesSent' &&
						workflowStatus !== 'enquiry' &&
						workflowStatus !== 'filesViewed' ? (
							<span
								style={{
									display: 'flex',
									height: '11px',
									padding: '5px var(--Spacing-space-3, 4px)',
									justifyContent: 'flex-end',
									alignItems: 'center',
									gap: 'var(--Spacing-space-3, 4px)',
									color: '#3D7E4B',
									fontFamily: 'Inter',
									fontSize: '8px',
									fontStyle: 'normal',
									fontWeight: '600',
									lineHeight: '14px' /* 175% */,
									letterSpacing: '0.16px',
									textTransform: 'uppercase',
									marginBottom: '2px',
								}}
							>
								Accepted
							</span>
						) : (
							''
						)}
						<span
							className="tabBtns "
							style={{ color: activeTab === 'file' ? '#e4e5e6' : '' }}
							onClick={() => chnageActiveTab('file')}
						>
							Smart File
						</span>
					</div>
					<span
						className="tabBtns"
						style={{ color: activeTab === 'activity' ? '#e4e5e6' : '' }}
						onClick={() => chnageActiveTab('activity')}
					>
						Activity
					</span>
				</div>
			</div>

			<div className="flexEndButtonContainer">
				<div className="previewBtn" onClick={modifiedPreviewClick}>
					{info?.previewLoader ? <Spinner /> : ''}Preview
				</div>
				{/* //send smart button */}
				{workflowStatus === 'enquiry' ? (
					<div className="sendSmartFileBtn" onClick={openSendSmartFileModal}>
						Send Smart File
					</div>
				) : (
					''
				)}
				{/* //Accept button */}
				{(workflowStatus === 'filesSent' || workflowStatus === 'filesViewed') &&
				!editable ? (
					<div className="sendSmartFileBtn" onClick={modifiedAccetFunc}>
						{info?.loading ? 'Accepting ....' : 'Accept'}
					</div>
				) : (
					''
				)}
				{/* //Counter Sign button */}
				{workflowStatus === 'contractSigned' && !editable ? (
					<div className="sendSmartFileBtn" onClick={openSignatureModal}>
						Counter Sign
					</div>
				) : (
					''
				)}

				{/* //Counter Accept button for proposal+thankyou */}
				{noContractTemplate && workflowStatus === 'proposalAccepted' ? (
					<div className="sendSmartFileBtn" onClick={onCounterAcceptClickFunc}>
						{info?.counterAccpetLoading ? 'Accepting ....' : 'Counter Accept'}
					</div>
				) : (
					''
				)}

				{/* //Update button */}
				{workflowStatus !== 'enquiry' ? (
					<>
						{editable ? (
							<div
								className="sendSmartFileBtn"
								onClick={() => changeEditStatus(false)}
							>
								Update
							</div>
						) : (
							''
						)}
						<HeadersDropDownComp
							showIcon={false}
							options={info?.threeDotOptions}
							containerStyle={{
								padding: '4px 8px',
								borderRadius: '100px',
								border: '1px solid rgba(36, 36, 36, 0.64)',
								background: 'rgba(42, 42, 42, 0.32)',
								width: '8px',
							}}
							dropDownStyle={{
								right: 0,
								left: 'unset',
								top: '55px',
								maxHeight: '300px',
								width: '200px',
							}}
							showArrow={false}
							selectedValue={<ThreeDots />}
							onChangeFunc={(e) => onOptionChangeFunc(e)}
							dropDownTextStyling={{
								overflow: 'hidden',
								color: '#E4E5E6',
								textOverflow: 'ellipsis',
								fontFamily: 'Inter',
								fontSize: '14px',
								fontStyle: 'normal',
								fontWeight: '400',
								lineHeight: '16px' /* 114.286% */,
								letterSpacing: '-0.3px',
							}}
						/>
					</>
				) : (
					''
				)}
			</div>
		</div>
	);
};

export default memo(SmartFileHeader);
