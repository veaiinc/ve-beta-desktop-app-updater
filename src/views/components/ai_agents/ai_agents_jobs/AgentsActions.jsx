import React, { memo, useState } from 'react';
import '../../../../assets/scss/ai_agents/agentsActions.scss';
const AgentsActions = () => {
	const [info, setInfo] = useState({
		actionData: [
			{ title: 'Generate a Smart File' },
			{ title: 'Create an onboarding newsletter for new website clients' },
			{ title: 'Generate a Smart File' },
		],
	});
	return (
		<div className="agentsActionsParentContainer">
			{info?.actionData?.map((ele, index) => (
				<div className="agentsTaskCards" key={index}>
					<div className="agentsTaskCardContent">
						<span className="agentsTaskCardTitle">{ele?.title}</span>
					</div>
					<span className="agentsTaskCardFooterStyling">Actions</span>

					<div className="agentsTaskStausIndicatorContainer">
						<div className="agentsTaskStausIndicator"></div>Completed
					</div>
				</div>
			))}
		</div>
	);
};

export default memo(AgentsActions);
