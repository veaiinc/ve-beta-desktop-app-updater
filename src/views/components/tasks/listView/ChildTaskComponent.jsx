import { Progress } from 'antd';
import React, { useCallback, useContext, useEffect, useState, memo, useRef } from 'react';
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
	colors,
	properties,
	childTasks = [],
	completedStatus = [],
	parentTaskId,
	handleRowClick,
}) => {
	const containerRef = useRef(null);
	const {
		tasks: { subTasks, getSubTasks, resetSubTasks },
	} = useContext(Context);
	const [info, setInfo] = useState({
		loading: true,
		error: null,
		subTasks: [],
		totalCount: 0,
		completedCount: 0,
		tasks: [],
		subtaskOpen: false,
	});

	useEffect(() => {
		const completedStatusIds = completedStatus?.map((item) => item._id);
		const completedCount = info?.tasks?.filter((item) =>
			completedStatusIds?.includes(item.status),
		)?.length;
		const totalCount = info?.tasks?.length;
		setInfo((prevInfo) => ({
			...prevInfo,
			loading: false,
			error: null,
			totalCount: totalCount,
			completedCount: completedCount,
		}));
	}, [info?.tasks, completedStatus]);

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

	const subTaskList = subTasks?.data;

	return (
		<div className="sidebar-subtask-container">
			<div className="sidebar-subtask-header">
				<span className="sidebar-subtask-header-title">Sub Tasks</span>
				<span className="sidebar-subtask-header-count">
					<Progress
						type="circle"
						percent={(info?.completedCount / info?.totalCount) * 100}
						size={16}
						strokeColor={'var(--primary-button)'}
						trailColor={'#2F2F2F'}
						strokeWidth={14}
					/>
					<span className="task-count">
						{info?.completedCount || 0}/{info?.totalCount || 0}
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
						<div className="subtask-wrapper" onClick={() => handleRowClick(task)}>
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
