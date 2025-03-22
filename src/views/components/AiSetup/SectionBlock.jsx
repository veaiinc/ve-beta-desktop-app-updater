import React from 'react';
import ToggleBlock from './ToggleBlock';
import '../../../assets/scss/AiSetup/sectionBlock.scss';
import MemoryBlock from './MemoryBlock';
const SectionBlock = ({
	title,
	onAddClick,
	onEditClick,
	onResetClick,
	data = [{ _id: 1, title: 'Test', description: 'Test', content: 'Test' }],
	type,
}) => {
	return (
		<div className="SectionBlockContainer">
			<div className="sectionBlockHeader">
				<h1 className="sectionBlockTitle">{title}</h1>
				<div className="sectionBlockHeaderButtons">
					<button onClick={onResetClick} className="sectionBlockHeaderButton">
						Reset
					</button>
					<button
						onClick={onAddClick}
						className="sectionBlockHeaderButton sectionBlockHeaderButtonAdd"
					>
						Add new
					</button>
				</div>
			</div>
			{type === 'memory' ? (
				<MemoryBlock />
			) : (
				<div className="sectionBlockContent">
					{data?.map((item) => (
						<ToggleBlock
							key={item._id}
							title={item.title}
							description={item?.description}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default SectionBlock;
