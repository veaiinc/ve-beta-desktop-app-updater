import React, { memo, useCallback, useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../../../assets/scss/design-builder/widgets.scss';
import { ReactComponent as DustbinIcon } from '../../../assets/svg/designBuilder/dustbin.svg';
import { ReactComponent as Drag } from '../../../assets/svg/designBuilder/drag.svg';
import { ReactComponent as Regenerate } from '../../../assets/svg/designBuilder/regenerate.svg';
import { ReactComponent as Plus } from '../../../assets/svg/designBuilder/plus.svg';
import { ReactComponent as Check } from '../../../assets/svg/designBuilder/Check.svg';
import { TypingEffect } from '../../../helper/markdownHelper';
import { Handle, Position } from '@xyflow/react';

const WidgetContainer = ({ data }) => {
	const { widgetData, handleDone, handleRegenerate, handleAddNewPage } = data;

	const [info, setInfo] = useState({
		text: '',
		data: null,
		change: false,
	});

	useEffect(() => {
		if (widgetData) {
			setInfo((prev) => ({
				...prev,
				data: widgetData?.modules,
				text: widgetData?.text_to_display,
			}));
		}
	}, [widgetData]);

	const removeWidgetFromJson = useCallback(
		(index) => {
			const newData = info?.data?.filter((item, idx) => idx !== index);
			setInfo({ ...info, data: newData, change: true });
		},
		[info],
	);

	const handleDragEnd = (result) => {
		if (!result.destination) return;

		const items = Array.from(info.data);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		setInfo((prev) => ({ ...prev, data: items, change: true }));
	};

	const modifiedHandleDone = useCallback(() => {
		let payload = {
			done: true,
		};
		if (info?.change) {
			payload = {
				...payload,
				updated_outline: {
					...widgetData,
					modules: [...(info?.data || [])],
				},
			};
		}

		handleDone(payload);
	}, [info, handleDone, widgetData]);

	return (
		<div className="widgetParentContainer">
			<TypingEffect text={info?.text} useNoMarkdown={true} />

			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId="widgets">
					{(provided) => (
						<div
							className="widgetsContainer"
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							{info?.data?.map((item, index) => (
								<Draggable
									key={index}
									draggableId={`draggable-${index}`}
									index={index}
								>
									{(provided, snapshot) => (
										<div
											className="widgetParentRowContainer"
											ref={provided.innerRef}
											{...provided.draggableProps}
										>
											<span style={{ width: 'auto' }}>
												<div
													// className="iconContainer"
													{...provided.dragHandleProps}
												>
													<Drag />
												</div>{' '}
											</span>
											<div className="widgetsInnerContentContainer">
												<TypingEffect
													text={`${index + 1}. ${item?.title}: ${
														item?.purpose
													}`}
													useNoMarkdown={true}
												/>
											</div>
											<div
											// className="iconContainer"
											>
												<span
													// className="iconContainer"
													onClick={() => removeWidgetFromJson(index)}
												>
													<DustbinIcon />
												</span>
											</div>
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
			<div className="widgetsActionContainer">
				<div className="widgetsActionbtn" onClick={() => handleRegenerate(widgetData)}>
					<Regenerate />
					Regenerate
				</div>
				<div className="widgetsActionbtn" onClick={handleAddNewPage}>
					<Plus />
					Add Card
				</div>
				{/* <div className="widgetsActionbtn" onClick={modifiedHandleDone}>
					<Check />
					Done
				</div> */}
			</div>
			<Handle type="source" position={Position.Bottom} />
		</div>
	);
};

export default memo(WidgetContainer);
