import { memo } from 'react';
import '../../../../assets/scss/automations/automationsMenuItems.scss';
import { useNavigate } from 'react-router-dom';

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
];

const AutomationMenuItems = ({
	automationId,
	enableAutomationTitleEditMode,
	toggleAutomationMenu,
}) => {
	const navigate = useNavigate();

	const navigateToAutomationBuilder = () => {
		navigate(`/automation-builder/${automationId}`);
	};

	const handleAutomationMenu = (action) => {
		if (action === 'renameAutomation') {
			enableAutomationTitleEditMode();
			toggleAutomationMenu();
		} else if (action === 'openAutomationBuilder') {
			navigateToAutomationBuilder();
		}
	};

	return (
		<ul className="menuItemsContainer">
			{menuItems?.map((item) => (
				<li
					key={item?.id}
					className="menuItem"
					onClick={() => handleAutomationMenu(item?.value)}
				>
					<span className="title">{item?.title}</span>
				</li>
			))}
		</ul>
	);
};

export default memo(AutomationMenuItems);
