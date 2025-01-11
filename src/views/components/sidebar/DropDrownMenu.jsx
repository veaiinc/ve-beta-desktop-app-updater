import React from 'react';
import { newBtnActions } from './sidebarindex';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/sidebar.scss';

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

		setInfo((prev) => ({ ...prev, isNewFeaturePlusOpen: false }));
	};

	return (
		<div
			className="closedDropDownMenu"
			style={{
				width: '228px',
			}}
		>
			{newBtnActions?.map((option, index) => (
				<div key={option?.label} onClick={() => handleOptionClick(option)}>
					{option?.label}
				</div>
			))}
		</div>
	);
};

export default DropDrownMenu;
