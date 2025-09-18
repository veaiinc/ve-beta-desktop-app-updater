import React, { memo } from 'react';
import ToggleBlock from './ToggleBlock';
import '../../../assets/scss/AiSetup/sectionBlock.scss';
import MemoryBlock from './MemoryBlock';
import Skeleton from 'react-loading-skeleton';
import { message } from '../globalComponents/CustomToast';
const SectionBlock = ({
	title,
	openAddNewGoalModal,
	onResetClick,
	onDeleteClick,
	data = [],
	type,
	loading,
	onEditClick,
	showSectionCTA = true,
}) => {
	const addNewButtonClick = (type) => {
		if (type === 'goal' && data?.length >= 5) {
			message.error('You can only add 5 goals');
			return;
		}
		openAddNewGoalModal(type);
	};
	return (
		<div className="SectionBlockContainer">
			<div className="sectionBlockHeader">
				<h1 className="sectionBlockTitle">
					{title}{' '}
					{type === 'goal' && (
						<span className="sectionBlockTitleCount">{data.length}/5</span>
					)}
				</h1>
				{showSectionCTA && (
					<div className="sectionBlockHeaderButtons">
						<button
							onClick={() => onResetClick(type)}
							className="sectionBlockHeaderButton"
						>
							Reset
						</button>
						<button
							onClick={() => addNewButtonClick(type)}
							className="sectionBlockHeaderButton sectionBlockHeaderButtonAdd"
						>
							Add new
						</button>
					</div>
				)}
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
					<MemoryBlock />
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
