import { Progress } from 'antd';
import React, { useCallback } from 'react';
import ListViewRow from './ListViewRow';
import Skeleton from 'react-loading-skeleton';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
import '../../../../assets/scss/tasks/childTaskComponent.scss';

const ChildTaskComponent = ({
	percentage,
	completedCount,
	totalCount,
	onAddButtonClick,
	loading,
	error,
	info,
	rowTypes,
	responseMetadata,
	onUpdate,
	onSubTaskClick,
	colors,
	properties,
	subTasks,
}) => {
	const generateSkeleton = useCallback(() => {
		return [...Array(3)]?.map((_, index) => (
			<div className="" key={index} style={{ marginBottom: '2px' }}>
				<Skeleton width="100%" height="32px" borderRadius="12px" count={1} />
			</div>
		));
	}, []);
	return (
		<div className="sidebar-subtask-container">
			<div className="sidebar-subtask-header">
				<span className="sidebar-subtask-header-title">Sub Tasks</span>
				<span className="sidebar-subtask-header-count">
					<Progress
						type="circle"
						percent={percentage}
						size={16}
						strokeColor={'#6055EC'}
						trailColor={'#2F2F2F'}
						strokeWidth={14}
					/>
					<span className="task-count">
						{completedCount || 0}/{totalCount || 0}
					</span>
				</span>
				<div className="subtask-actions-wrapper">
					<button className="subtask-action-button" onClick={onAddButtonClick}>
						<PlusSvg style={{ width: '20px', height: '20px' }} />
					</button>
				</div>
			</div>
			<div className="subtask-list-container">
				{loading ? (
					generateSkeleton()
				) : error ? (
					<span className="no-subtasks">{error}</span>
				) : subTasks?.length !== 0 ? (
					subTasks?.map((subTask) => (
						<ListViewRow
							task={subTask}
							key={subTask?._id}
							rowTypes={rowTypes}
							responseMetadata={responseMetadata}
							updatePropertyValue={onUpdate}
							isSubTask={true}
							handleRowClick={onSubTaskClick || (() => {})}
							properties={properties}
							colors={colors}
						/>
					))
				) : (
					<span className="no-subtasks">No subTasks</span>
				)}
			</div>
		</div>
	);
};

export default ChildTaskComponent;
