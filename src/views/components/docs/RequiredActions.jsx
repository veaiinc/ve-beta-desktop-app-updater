import React, { memo } from 'react';

const RequiredActions = ({ data }) => {
	console.log('RequiredActions', data);
	return (
		<div className="requiredActionsWrapper">
			<div className="requiredAction">
				{data?.requiredAction?.action || 'No Action Required'}
			</div>
			<div className="requiredActionBtn">Sign Contract</div>
		</div>
	);
};

export default memo(RequiredActions);
