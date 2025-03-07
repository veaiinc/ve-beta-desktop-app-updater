import React, { memo } from 'react';
import '../../../../assets/scss/automations/automationSteps.scss';

const AutomationSteps = ({ automationSteps }) => {
	const emptyAutomationSteps = automationSteps?.length === 0;

	return (
		<div className="automationStepsContainer">
			{emptyAutomationSteps ? (
				<h1 className="emptyAutomationSteps">No steps found!</h1>
			) : (
				<div className="automationSteps">
					{automationSteps?.map((step) => (
						<h1 className="automationStep">{step?.title}</h1>
					))}
				</div>
			)}
		</div>
	);
};

export default memo(AutomationSteps);
