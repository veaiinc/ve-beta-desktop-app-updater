import { Tooltip } from 'antd';
import { memo } from 'react';
import '../../../assets/scss/notesPage/sortAndFilter.scss';

// Icons
import { ReactComponent as TickIcon } from '../../../assets/svg/notesPage/tick-icon.svg';

// Constants

const tooltipOverlayInnerStyle = {
	borderRadius: '10px',
	fontSize: '14px',
	backgroundColor: 'var(--card)',
	color: 'var(--primary-font)',
	textAlign: 'center',
	marginLeft: '8px',
	minWidth: 'fit-content',
	minHeight: 'fit-content',
	padding: '0px',
};

export const filterOptions = [
	{ label: 'All', value: 'all' },
	{ label: 'Private', value: 'private' },
	{ label: 'Shared', value: 'shared' },
	{ label: 'Favorite', value: 'favorite' },
	{ label: 'Published', value: 'published' },
	{ label: 'Trashed', value: 'trashed' },
];

export const sortOptions = [
	{ label: 'Recently Updated', value: 'updatedAt', sortType: -1 },
	{ label: 'Recently Created', value: 'createdAt', sortType: -1 },
	{ label: 'A-Z', value: 'title', sortType: 1 },
];

const SortAndFilterTooltip = ({
	type,
	handleOptionClick,
	children,
	selectedOption,
	tooltipOpen,
	toggleTooltipOpen,
}) => (
	<Tooltip
		open={tooltipOpen}
		onOpenChange={() => toggleTooltipOpen()}
		title={
			type === 'filter' ? (
				<div className="notesPageFilterTooltip">
					{filterOptions.map((option) => (
						<div
							key={option.value}
							onClick={() => handleOptionClick({ type: 'filter', value: option })}
							className={`filterOption ${
								selectedOption.value === option.value
									? 'selected-filter-option'
									: ''
							}`}
						>
							{option.label}
							{selectedOption.value === option.value && <TickIcon />}
						</div>
					))}
				</div>
			) : 'sort' ? (
				<div className="notesPageSortTooltip">
					{sortOptions.map((option) => (
						<div
							key={option.value}
							onClick={() => handleOptionClick({ type: 'sort', value: option })}
							className={`sortOption ${
								selectedOption.value === option.value
									? 'selected-filter-option'
									: ''
							}`}
						>
							{option.label}
							{selectedOption.value === option.value && <TickIcon />}
						</div>
					))}
				</div>
			) : null
		}
		placement="bottom"
		arrow={false}
		overlayInnerStyle={tooltipOverlayInnerStyle}
	>
		{children}
	</Tooltip>
);

export default memo(SortAndFilterTooltip);
