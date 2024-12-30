import { Progress } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';

const ChildTaskProgress = ({ value }) => {
	const [info, setInfo] = useState({ completedCount: 0, totalCount: 0 });

	useEffect(() => {
		if (Array.isArray(value)) {
			const completedCount = value.filter((item) => item?.status === 'completed').length;
			const totalCount = value.length;
			setInfo({ completedCount, totalCount });
		} else {
			setInfo({ completedCount: 0, totalCount: 0 });
		}
	}, [value]);

	return (
		<span className="child-task-progress">
			<Progress
				type="circle"
				percent={info?.totalCount ? (info?.completedCount / info?.totalCount) * 100 : 0}
				size={16}
				strokeColor={'#6055EC'}
				trailColor={'#2F2F2F'}
				strokeWidth={14}
			/>
			<span className="child-task-progress-count">
				{info?.completedCount || 0}/{info?.totalCount || 0}
			</span>
		</span>
	);
};

export default memo(ChildTaskProgress);
