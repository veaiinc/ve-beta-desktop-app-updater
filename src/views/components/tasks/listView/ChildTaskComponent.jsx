import { Progress } from 'antd';
import React, { useCallback, useContext, useEffect, useState, memo } from 'react';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
import '../../../../assets/scss/tasks/childTaskComponent.scss';
import ListView from '../views/ListView';
import Context from '../../../../context/context';

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
		setInfo((prevInfo) => ({
			...prevInfo,
			loading: true,
		}));
	}, [parentTaskId]);

	useEffect(() => {
		if (subTasks?.data) {
			setInfo((prevInfo) => ({
				...prevInfo,
				tasks: [...subTasks?.data],
				loading: false,
			}));
		} else if (subTasks?.error) {
			setInfo((prevInfo) => ({
				...prevInfo,
				loading: false,
				error: subTasks?.error,
			}));
		}
	}, [subTasks]);

	const fetchChildTasks = useCallback(() => {
		getSubTasks({ taskId: parentTaskId });
	}, [parentTaskId]);

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
						<PlusSvg style={{ width: '20px', height: '20px' }} />
					</button>
				</div>
			</div>
			<div className="subtask-list-container">
				{childTasks?.map((task) => (
					<div className="subtask-wrapper">
						<div className="sub-task-text-wrapper">
							<div className="title">This is a title</div>
							<div className="description">This is a description</div>
						</div>
						<div className="other-properties">
							<div className="property">
								<div className="property-tags">
									{task?.status && renderComponent(task, 'status', task?.status)}
									{task?.priority &&
										renderComponent(task, 'priority', task?.priority)}
								</div>
								{task?.assignedTo &&
									renderComponent(task, 'assignedTo', task?.assignedTo)}
							</div>
						</div>
					</div>
				))}
				{/* {
					<ListView
						handleUpdate={handleUpdate}
						responseMetadata={responseMetadata}
						addButtonOnClick={() => {}}
						colors={colors}
						fetchMoreData={() => {}}
						data={info?.tasks}
						loading={info?.loading}
						properties={properties}
						rowTypes={rowTypes}
						handleRowClick={handleRowClick}
						hasMore={false}
						error={null}
						infiniteScrollHeight="200px"
					/>
				} */}
			</div>
		</div>
	);
};

export default memo(ChildTaskComponent);
