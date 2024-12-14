import React, { memo, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactComponent as ArrowSvg } from '../../../assets/svg/worflow_builder/smallArrow.svg';
const INITIAL_STAGES = [
	{ id: 'add-stage', title: 'Add Stage', isAddButton: true },
	{ id: 'enquiry', title: 'Enquiry' },
	{ id: 'all-files', title: 'All files' },
	{ id: 'smart-file', title: 'Smart file viewed' },
	{ id: 'contract', title: 'Contract signed' },
	{ id: 'booking', title: 'Booking confirmed' },
];

const WidgetContainer = () => {
	const [info, setInfo] = useState({
		stages: INITIAL_STAGES,
	});
	return (
		<div className="workflowBuilderWidgetContainer">
			<span className="workflowBuilderNameContainer">
				Workflow Name 1 <span style={{ color: 'rgba(147, 147, 147, 1)' }}>- 12 steps</span>
			</span>
			<div className="parentStagesContainer">
				<span className="stagesSubTextStyling">
					Add, rename, move, or delete stages to fit your clientflow processes.
				</span>

				<div className="stagesCardHolderContainer">
					{info?.stages?.map((ele, index) => (
						<div style={{ display: 'flex', alignItems: 'center' }} key={index}>
							<div className="workflowBuilderStages">hello</div>
							<ArrowSvg />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default memo(WidgetContainer);
