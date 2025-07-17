import React, { memo, useCallback, useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../../../assets/scss/design-builder/widgets.scss';
import { ReactComponent as DustbinIcon } from '../../../assets/svg/designBuilder/dustbin.svg';
import { ReactComponent as Drag } from '../../../assets/svg/designBuilder/drag.svg';
import { ReactComponent as Regenerate } from '../../../assets/svg/designBuilder/regenerate.svg';
import { ReactComponent as Plus } from '../../../assets/svg/designBuilder/plus.svg';
import { ReactComponent as Check } from '../../../assets/svg/designBuilder/Check.svg';
import { TypingEffect } from '../../../helper/markdownHelper';
import { ReactComponent as Files } from '../../../assets/svg/designBuilder/file.svg';
import { Handle, Position } from '@xyflow/react';
const WidgetForFiles = ({ data }) => {
	const { widgetFilesData, handleDone, handleRegenerate, handleAddNewPage } = data;
	const [info, setInfo] = useState({
		text: '',
		data: null,
		fileName: '',
	});

	useEffect(() => {
		if (widgetFilesData) {
			setInfo((prev) => ({
				...prev,
				data: widgetFilesData?.sections || [],
				text: widgetFilesData?.text_to_display || '',
				fileName: widgetFilesData?.title || '',
			}));
		}
	}, [widgetFilesData]);

	const removeWidgetFromJson = useCallback(
		(index) => {
			const newData = info?.data?.filter((item, idx) => idx !== index);
			setInfo({ ...info, data: newData });
		},
		[info],
	);

	const handleDragEnd = (result) => {
		if (!result.destination) return;

		const items = Array.from(info.data);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		setInfo((prev) => ({ ...prev, data: items }));
	};
	return (
		<div className="widgetParentContainer">
			<span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
				<Files />
				{info?.fileName || ''}
			</span>
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
												</div>
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
				<div className="widgetsActionbtn" onClick={() => handleRegenerate(widgetFilesData)}>
					<Regenerate />
					Regenerate
				</div>
				<div
					className="widgetsActionbtn"
					onClick={() =>
						handleAddNewPage('addNewCard', `Add one more card  at ${info?.fileName}`)
					}
				>
					<Plus />
					Add Card
				</div>
				{/* <div className="widgetsActionbtn" onClick={() => handleDone()}>
					<Check />
					Done
				</div> */}
			</div>
			{/* <Handle type="source" position={Position.Bottom} /> */}
			<Handle type="target" position={Position.Top} />
		</div>
	);
};

export default memo(WidgetForFiles);
