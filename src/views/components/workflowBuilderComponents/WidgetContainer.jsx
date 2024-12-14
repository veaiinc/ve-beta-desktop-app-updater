import React, { memo, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactComponent as ArrowSvg } from '../../../assets/svg/worflow_builder/smallArrow.svg';

const INITIAL_STAGES = [
	{ id: 'enquiry', title: 'Enquiry' },
	{ id: 'all-files', title: 'All files' },
	{ id: 'smart-file', title: 'Smart file viewed' },
	{ id: 'contract', title: 'Contract signed' },
	{ id: 'booking', title: 'Booking confirmed' },
	{ id: 'add-stage', title: 'Add Stage', isAddButton: true },
];

const WidgetContainer = () => {
	const [info, setInfo] = useState({
		stages: INITIAL_STAGES,
	});

	const handleDragEnd = (result) => {
		const { destination, source } = result;
		if (!destination || source.index === 0) return;
		if (destination.droppableId === source.droppableId && destination.index === source.index)
			return;

		const newStages = Array.from(info.stages);
		const [removed] = newStages.splice(source.index, 1);
		newStages.splice(destination.index, 0, removed);

		setInfo((prev) => ({
			...prev,
			stages: newStages,
		}));
	};

	const handleAddStage = () => {
		const newStage = {
			id: `stage-${Date.now()}`,
			title: `New Stage ${info.stages.length}`,
		};

		const stages = [...(info?.stages || [])];
		stages.splice(stages?.length - 2, 0, newStage);
		setInfo((prev) => ({
			...prev,
			stages,
		}));
	};

	return (
		<div className="workflowBuilderWidgetContainer">
			<span className="workflowBuilderNameContainer">
				Workflow Name 1{' '}
				<span style={{ color: 'rgba(147, 147, 147, 1)' }}>
					- {info.stages.length - 1} steps
				</span>
			</span>

			<div className="parentStagesContainer">
				<span className="stagesSubTextStyling">
					Add, rename, move, or delete stages to fit your clientflow processes.
				</span>

				<DragDropContext onDragEnd={handleDragEnd}>
					<Droppable droppableId="workflow-stages" direction="horizontal">
						{(provided) => (
							<div
								ref={provided.innerRef}
								{...provided.droppableProps}
								className="stagesCardHolderContainer"
								style={{
									display: 'flex',
									alignItems: 'center',
									overflowX: 'auto',
									padding: '20px 0',
								}}
							>
								{info.stages.map((stage, index) => (
									<Draggable
										key={stage.id}
										draggableId={stage.id}
										index={index}
										isDragDisabled={stage.isAddButton}
									>
										{(provided, snapshot) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												style={{
													...provided.draggableProps.style,
													display: 'flex',
													alignItems: 'center',
													// gap: '8px',
												}}
											>
												<div
													className={`workflowBuilderStages ${
														snapshot.isDragging
															? 'ring-2 ring-blue-500 shadow-lg'
															: ''
													}`}
													onClick={
														stage.isAddButton
															? handleAddStage
															: undefined
													}
													style={{
														cursor: stage.isAddButton ? 'pointer' : '',
													}}
												>
													{stage.isAddButton ? (
														<div className="flex flex-col items-center text-gray-400">
															<span className="text-2xl">+</span>
															<span>{stage.title}</span>
														</div>
													) : (
														<>{stage.title}</>
													)}
												</div>
												{index < info.stages.length - 1 && (
													<div
														style={{
															display: 'flex',
															alignItems: 'center',
															height: '100%',
														}}
													>
														<ArrowSvg />
													</div>
												)}
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</div>
		</div>
	);
};

export default memo(WidgetContainer);
