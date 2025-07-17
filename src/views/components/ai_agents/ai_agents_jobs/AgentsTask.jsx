import React, { memo, useState } from 'react';
import '../../../../assets/scss/ai_agents/agentsTask.scss';
const AgentsTask = () => {
	const [info, setInfo] = useState({
		taskData: [
			{ title: 'Generate a Smart File' },
			{ title: 'Create an onboarding newsletter for new website clients' },
			{ title: 'Generate a Smart File' },
		],
	});
	return (
		<div className="agentsTaskParentContainer">
			{info?.taskData?.map((ele, index) => (
				<div className="agentsTaskCards" key={index}>
					<div className="agentsTaskCardContent">
						<span className="agentsTaskCardTitle">{ele?.title}</span>
					</div>
					<span className="agentsTaskCardFooterStyling">Tasks</span>

					<div className="agentsTaskStausIndicatorContainer">
						<div className="agentsTaskStausIndicator"></div>Completed
					</div>
				</div>
			))}
		</div>
	);
};

export default memo(AgentsTask);
