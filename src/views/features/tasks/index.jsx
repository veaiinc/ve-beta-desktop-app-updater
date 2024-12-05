import React, { memo } from 'react';
import ListView from '../../components/tasks/listView/ListView';

const Tasks = () => {
	return (
		<div>
			<ListView />
		</div>
	);
};

export default memo(Tasks);
