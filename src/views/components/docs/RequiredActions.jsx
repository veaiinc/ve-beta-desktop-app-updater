import React, { memo } from 'react';

const RequiredActions = ({ data }) => {
	return (
		<div className="requiredActionsWrapper">
			<div className="requiredAction">
				{data?.requiredAction?.action || 'No Action Required'}
			</div>
			{data?.requiredAction?.action && <div className="requiredActionBtn">Sign Contract</div>}
		</div>
	);
};

export default memo(RequiredActions);
