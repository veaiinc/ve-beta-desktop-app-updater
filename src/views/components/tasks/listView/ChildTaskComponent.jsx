import { Progress } from 'antd';
import React, { useCallback, useContext, useEffect, useState, memo, useRef, useMemo } from 'react';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
import '../../../../assets/scss/tasks/childTaskComponent.scss';
import Context from '../../../../context/context';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import Spinner from '../../loaders/Spinner';

const ChildTaskComponent = ({
	handleUpdate,
	onAddButtonClick,
	rowTypes,
	responseMetadata,
	completedStatus = [],
}) => {
	const containerRef = useRef(null);
	const {
		tasks: { subTasks, getSubTasks, resetSubTasks, sideBarData, updateSideBarData },
	} = useContext(Context);
	const [info, setInfo] = useState({
		loading: true,
		subtaskOpen: false,
	});

	const parentTaskId = sideBarData?.stack?.at(-1)?._id;

	useEffect(() => {
		resetSubTasks();
		fetchChildTasks();
	}, [parentTaskId]);

	const fetchChildTasks = useCallback(async () => {
		setInfo((prevInfo) => ({
			...prevInfo,
			loading: true,
		}));
		await getSubTasks({ taskId: parentTaskId });
		setInfo((prevInfo) => ({
			...prevInfo,
			loading: false,
		}));
	}, [parentTaskId]);

	const handleSubtaskOpen = () => {
		if (info?.subtaskOpen && containerRef.current) {
			containerRef.current.scrollTop = 0;
		}
		setInfo((prevInfo) => ({
			...prevInfo,
			subtaskOpen: !prevInfo.subtaskOpen,
		}));
	};
	const renderComponent = (task, key, value) => {
		if (key === 'createdWithAi') {
			const Component = rowTypes?.['createdWithAi'];
			return <Component />;
		}
		const { type, name, Icon, props } = responseMetadata?.[key] || {};
		const RowComponent = rowTypes?.[type] || null;
		if (RowComponent) {
			return (
				<RowComponent
					key={key}
					value={value}
					title={name}
					Icon={Icon}
					{...props}
					showIcon={true}
					onOptionClick={(value) => handleUpdate(task?._id, key, value)}
				/>
			);
		}
		return null;
	};

	const subTaskList = subTasks?.data || [];

	const totalCount = subTaskList?.length || 0;

	const completedCount = useMemo(() => {
		const completedStatusIds = completedStatus?.map((item) => item._id);
		return subTaskList?.reduce((acc, task) => {
			if (task?.status && completedStatusIds?.includes(task?.status)) {
				return acc + 1;
			}
			return acc;
		}, 0);
	}, [subTaskList, completedStatus]);

	return (
		<div className="sidebar-subtask-container">
			<div className="sidebar-subtask-header">
				<span className="sidebar-subtask-header-title">Sub Tasks</span>
				<span className="sidebar-subtask-header-count">
					<Progress
						type="circle"
						percent={(completedCount / totalCount) * 100}
						size={16}
						strokeColor={'var(--primary-button)'}
						trailColor={'#2F2F2F'}
						strokeWidth={14}
					/>
					<span className="task-count">
						{completedCount || 0}/{totalCount || 0}
					</span>
				</span>
				<div className="subtask-actions-wrapper">
					<button className="subtask-action-button" onClick={onAddButtonClick}>
						<PlusSvg />
					</button>
					{subTaskList?.length > 1 && (
						<button className="subtask-action-button" onClick={handleSubtaskOpen}>
							<ChevronRightThinSvg
								className={`chevron-icon ${info?.subtaskOpen ? 'open' : ''}`}
							/>
						</button>
					)}
				</div>
			</div>

			<div
				className={`subtask-list-container ${info?.subtaskOpen ? 'open' : ''}`}
				ref={containerRef}
			>
				{info?.loading ? (
					<div className="spinner-container">
						<Spinner />
					</div>
				) : subTaskList?.length > 0 ? (
					subTaskList?.map((task) => (
						<div
							className="subtask-wrapper"
							onClick={() => updateSideBarData({ data: task })}
							key={task?._id}
						>
							<div className="sub-task-text-wrapper">
								<div className="title">{task?.title}</div>
								<div className="description">{task?.description}</div>
							</div>
							<div className="other-properties">
								<div className="property-tags">
									{task?.status && renderComponent(task, 'status', task?.status)}
									{task?.priority &&
										renderComponent(task, 'priority', task?.priority)}
								</div>
								{task?.assignedTo &&
									renderComponent(task, 'assignedTo', task?.assignedTo)}
							</div>
						</div>
					))
				) : (
					<div className="no-subtasks">No subtasks found</div>
				)}
			</div>
		</div>
	);
};

export default memo(ChildTaskComponent);
