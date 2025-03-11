import { Tooltip } from 'antd';
import { memo } from 'react';
import AutomationMenuItems from './AutomationMenuItems';
import '../../../../assets/scss/automations/index.scss';

const AutomationMenu = ({
	automationId,
	showAutomationMenu,
	toggleAutomationMenu,
	enableAutomationTitleEditMode,
	children,
}) => {
	return (
		<Tooltip
			trigger={'click'}
			open={showAutomationMenu}
			onOpenChange={toggleAutomationMenu}
			className="automationMenu"
			placement={'bottomRight'}
			arrow={false}
			color="transparent"
			title={
				<AutomationMenuItems
					automationId={automationId}
					toggleAutomationMenu={toggleAutomationMenu}
					enableAutomationTitleEditMode={enableAutomationTitleEditMode}
				/>
			}
		>
			{children}
		</Tooltip>
	);
};

export default memo(AutomationMenu);
