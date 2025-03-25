import React, { memo } from 'react';
import ToggleBlock from './ToggleBlock';
import '../../../assets/scss/AiSetup/sectionBlock.scss';
import MemoryBlock from './MemoryBlock';
import Skeleton from 'react-loading-skeleton';
const SectionBlock = ({
	title,
	openAddNewGoalModal,
	onResetClick,
	onDeleteClick,
	data = [],
	type,
	loading,
	onEditClick,
}) => {
	return (
		<div className="SectionBlockContainer">
			<div className="sectionBlockHeader">
				<h1 className="sectionBlockTitle">{title}</h1>
				<div className="sectionBlockHeaderButtons">
					<button onClick={() => onResetClick(type)} className="sectionBlockHeaderButton">
						Reset
					</button>
					<button
						onClick={() => openAddNewGoalModal(type)}
						className="sectionBlockHeaderButton sectionBlockHeaderButtonAdd"
					>
						Add new
					</button>
				</div>
			</div>
			{loading ? (
				[...Array(2)].map((_, index) => (
					<div key={index} style={{ width: '100%' }}>
						<Skeleton
							color="var(--primary-font)"
							width="100%"
							height="68px"
							borderRadius="12px"
						/>
					</div>
				))
			) : data?.length > 0 ? (
				type === 'memory' ? (
					<MemoryBlock
						data={data}
						onDeleteClick={onDeleteClick}
						onEditClick={onEditClick}
					/>
				) : (
					<div className="sectionBlockContent">
						{data?.map((item) => (
							<ToggleBlock
								key={item._id}
								data={item}
								type={type}
								onDeleteClick={onDeleteClick}
								onEditClick={onEditClick}
							/>
						))}
					</div>
				)
			) : (
				<span className="sectionBlockEmpty">No data</span>
			)}
		</div>
	);
};

export default memo(SectionBlock);
