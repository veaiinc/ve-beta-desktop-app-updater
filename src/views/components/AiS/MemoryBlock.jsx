import React, { memo } from 'react';
import '../../../assets/scss/AiSetup/memoryBlock.scss';
import { ReactComponent as Dustbin } from '../../../assets/svg/worflow_builder/dustbin.svg';
import { ReactComponent as Pencil } from '../../../assets/svg/calendar/pencil.svg';
const MemoryBlock = ({ data, onDeleteClick, onEditClick }) => {
	return (
		<div className="memoryBlockContainer">
			{data?.map((item) => (
				<div key={item._id} className={`memoryBlockItem`}>
					<h3 className="memoryBlockItemTitle">{item?.description}</h3>
					<div className="memoryBlockItemActions">
						<button
							className="deleteButton"
							onClick={() =>
								onEditClick('memory', item?._id, null, item?.description)
							}
						>
							<Pencil />
						</button>
						<button
							className="deleteButton"
							onClick={() => onDeleteClick('memory', item?._id)}
						>
							<Dustbin />
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default memo(MemoryBlock);
