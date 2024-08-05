import React, { memo } from 'react';
import { ReactComponent as BackArrowSvg } from '../../../assets/svg/workflow/backarrow.svg';
import { useNavigate } from 'react-router-dom';

const SmartFileHeader = ({ activeTab, chnageActiveTab }) => {
	const navigate = useNavigate();
	return (
		<div className="smarFileHeader">
			<div className="HeaderContentContainer">
				<div className="BackBtnContainer" onClick={() => navigate(-1)}>
					{' '}
					<span className="svgWrapper">
						<BackArrowSvg />
					</span>
					Martin Dolkidis
				</div>
				<div className="tabBtnContainer">
					<span
						className="tabBtns"
						style={{ color: activeTab === 'form' ? '#e4e5e6' : '' }}
						onClick={() => chnageActiveTab('form')}
					>
						Form Response
					</span>
					<span
						className="tabBtns "
						style={{ color: activeTab === 'file' ? '#e4e5e6' : '' }}
						onClick={() => chnageActiveTab('file')}
					>
						Smart File
					</span>
				</div>
			</div>
			<div className="flexEndButtonContainer">
				<div className="sendSmartFileBtn">Send Smart File</div>
			</div>
		</div>
	);
};

export default memo(SmartFileHeader);
