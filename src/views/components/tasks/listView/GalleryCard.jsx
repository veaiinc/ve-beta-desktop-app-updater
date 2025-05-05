import { memo, useContext } from 'react';
import '../../../../assets/scss/tasks/galleryCard.scss';
import Context from '../../../../context/context';
import { rowTypes } from '../../../features/tasks/Tasks';

const GalleryCard = ({ task, responseMetadata, handleUpdate }) => {
	const {
		tasks: { updateSideBarData },
	} = useContext(Context);

	const renderComponent = (key, value) => {
		if (key === 'createdWithAi') {
			const Component = rowTypes['createdWithAi'];
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
		<div className="gallery-card" onClick={() => updateSideBarData(task)}>
			<div className="gallery-card-header">
				{task?.dueDate && renderComponent('dueDate', task?.dueDate)}
				<div className="" />
				{(task?.assignedTo && task?.assignedTo?.length > 0) || task?.createdWithAi ? (
					renderComponent('assignedTo', task?.assignedTo)
				) : (
					<div className="gallery-card-header-assigned-to"> </div>
				)}
			</div>
			<div className="gallery-card-body">
				<div className="gallery-card-body-title">{task?.title}</div>
				<div className="gallery-card-body-description">{task?.description}</div>
			</div>
			<div className="gallery-card-tags">
				{task?.status && renderComponent('status', task?.status)}
				{task?.priority && renderComponent('priority', task?.priority)}
			</div>
			<div className="gallery-card-footer">
				{task?.childTasks && renderComponent('childTasks', task?.childTasks)}
				<div className="gallery-card-footer-created-with-ai">
					{!task?.createdBy && renderComponent('createdWithAi')}
				</div>
			</div>
		</div>
	);
};

export default memo(GalleryCard);
