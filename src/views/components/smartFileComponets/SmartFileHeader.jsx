import React, { memo, useCallback, useEffect, useState } from 'react';
import { ReactComponent as BackArrowSvg } from '../../../assets/svg/workflow/backarrow.svg';
import { useNavigate } from 'react-router-dom';

const SmartFileHeader = ({
	activeTab,
	chnageActiveTab,
	openSendSmartFileModal,
	clientDetails,
	workflowStatus,
	acceptProposalFunc,
	openSignatureModal,
}) => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		loading: false,
	});

	const modifiedAccetFunc = useCallback(async () => {
		if (info?.loading) {
			return;
		}
		setInfo((prev) => ({ ...prev, loading: true }));
		const response = acceptProposalFunc();
		if (response?.[0]) {
			setInfo((prev) => ({ ...prev, loading: false }));
		}
	}, []);

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
						{workflowStatus !== 'fileSent' && workflowStatus !== 'enquiry' ? (
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
				</div>
			</div>
			<div className="flexEndButtonContainer">
				{workflowStatus === 'enquiry' ? (
					<div className="sendSmartFileBtn" onClick={openSendSmartFileModal}>
						Send Smart File
					</div>
				) : (
					''
				)}

				{workflowStatus === 'fileSent' ? (
					<div className="sendSmartFileBtn" onClick={modifiedAccetFunc}>
						{info?.loading ? 'Accepting ....' : 'Accept'}
					</div>
				) : (
					''
				)}

				{workflowStatus === 'contractSigned' ? (
					<div className="sendSmartFileBtn" onClick={openSignatureModal}>
						Counter Sign
					</div>
				) : (
					''
				)}
			</div>
		</div>
	);
};

export default memo(SmartFileHeader);
