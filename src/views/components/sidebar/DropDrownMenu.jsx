import React from 'react';
import { newBtnActions } from './sidebarindex';
import { useNavigate } from 'react-router-dom';

const DropDrownMenu = ({ info, setInfo }) => {
	const navigate = useNavigate();
	const allFunctionsObject = {
		openLeadPopup: () => {
			setInfo((prev) => ({ ...prev, createLeadModal: true }));
		},
	};

	const handleOptionClick = (option) => {
		if (option?.action === 'functionCall') {
			allFunctionsObject[option?.funcName]();
		} else if (option?.action === 'redirect') {
			navigate(option?.redirect);
		}
	};

	return (
		<div
			style={{
				position: 'absolute',
				top: info?.isNewFeaturePlusOpen ? '5px' : '0px',
				left: info?.isNewFeaturePlusOpen ? '50px' : '0px',
				width: info?.isNewFeaturePlusOpen ? '180px' : '0px',
				transition: 'all 0.3s ease-in-out',
				opacity: info?.isNewFeaturePlusOpen ? '1' : '0',
			}}
		>
			<div className="closedDropDownMenu">
				{newBtnActions?.map((option, index) => (
					<div key={option?.label} onClick={() => handleOptionClick(option)}>
						{option?.label}
					</div>
				))}
			</div>
		</div>
	);
};

export default DropDrownMenu;
