import { memo, useState } from 'react';
import '../../../../assets/scss/automations/automationsMenuItems.scss';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../loaders/Spinner';

const menuItems = [
	{
		id: 1,
		title: 'Rename',
		value: 'renameAutomation',
	},
	{
		id: 2,
		title: 'Edit',
		value: 'openAutomationBuilder',
	},
	{
		id: 3,
		title: 'Delete',
		value: 'deleteAutomation',
	},
];

const deleteAutomationStyle = { display: 'flex', alignItems: 'center', gap: '4px' };

const AutomationMenuItems = ({
	automationId,
	enableAutomationTitleEditMode,
	toggleAutomationMenu,
	handleDeleteAutomation,
}) => {
	const navigate = useNavigate();

	const navigateToAutomationBuilder = () => {
		navigate(`/automation-builder/${automationId}`);
	};

	const handleAutomationMenu = async (action) => {
		if (action === 'renameAutomation') {
			enableAutomationTitleEditMode();
			toggleAutomationMenu();
		} else if (action === 'openAutomationBuilder') {
			navigateToAutomationBuilder();
		} else if (action === 'deleteAutomation') {
			handleDeleteAutomation(automationId);
			toggleAutomationMenu();
		}
	};

	return (
		<ul className="menuItemsContainer">
			{menuItems?.map((item) => {
				const { id, title, value } = item;
				return (
					<li
						key={id}
						style={value === 'deleteAutomation' ? deleteAutomationStyle : {}}
						className="menuItem"
						onClick={() => handleAutomationMenu(value)}
					>
						<span className="title">{title}</span>
					</li>
				);
			})}
		</ul>
	);
};

export default memo(AutomationMenuItems);
