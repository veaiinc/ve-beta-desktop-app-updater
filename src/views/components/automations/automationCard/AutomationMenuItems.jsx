import { memo } from 'react';
import '../../../../assets/scss/automations/automationsMenuItems.scss';
import { useNavigate } from 'react-router-dom';

const menuItems = [
	{
		id: 1,
		title: 'Rename Automation',
		value: 'renameAutomation',
	},
	{
		id: 2,
		title: 'Open Automation Builder',
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
		navigate(`/automation_builder/${automationId}`);
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
		// <div className={`workflow-prompt-popup`}>
		// 	{isAutomation ? (
		// 		<span
		// 			onClick={editMode ? handleRename : handleEnableEditMode}
		// 			className="workflow-prompt-option"
		// 		>
		// 			{editMode ? 'Save Changes' : 'Rename'}
		// 		</span>
		// 	) : (
		// 		<span onClick={() => openCopyLinkModal(data)} className="workflow-prompt-option">
		// 			Copy link
		// 		</span>
		// 	)}

		// 	<span
		// 		onClick={() => {
		// 			navigateToWorkflowBuilder(data);
		// 		}}
		// 		className={'workflow-prompt-option'}
		// 	>
		// 		Edit Workflow
		// 	</span>

		// 	<span
		// 		onClick={() => {
		// 			window.location.href = `${origin}/${data?._id} `;
		// 		}}
		// 		className={'workflow-prompt-option'}
		// 	>
		// 		Edit Design
		// 	</span>
		// </div>
	);
};

export default memo(AutomationMenuItems);
