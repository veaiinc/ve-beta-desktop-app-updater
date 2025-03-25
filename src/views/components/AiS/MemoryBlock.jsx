import React, { memo } from 'react';
import '../../../assets/scss/AiSetup/memoryBlock.scss';
import { ReactComponent as Dustbin } from '../../../assets/svg/worflow_builder/dustbin.svg';
const MemoryBlock = ({ data, onDeleteClick }) => {
	return (
		<div className="memoryBlockContainer">
			{data?.map((item) => (
				<div key={item._id} className={`memoryBlockItem`}>
					<h3 className="memoryBlockItemTitle">{item?.description}</h3>
					<button
						className="deleteButton"
						onClick={() => onDeleteClick('memory', item?._id)}
					>
						<Dustbin />
					</button>
				</div>
			))}
		</div>
	);
};

export default memo(MemoryBlock);
