import React, { memo, useState } from 'react';
import '../../../assets/scss/globalComponents/filterPopup.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ReactComponent as Tick } from '../../../assets/svg/tasks/checkmark.svg';

const FilterPopUp = ({
	filter,
	width = '220px',
	height = '200px',
	background = '#202123',
	borderRadius = '14px',
	className,
	options,
	hasMoreOptions,
	onOptionClick,
	fetchMoreOptions,
	searchInput = false,
	searchInputPlaceholder = 'Filter By',
	searchValue,
	setSearchValue,
}) => {
	const filteredOptions = options?.filter((option) => {
		const searchField = option?.name ?? option?.title;
		return searchField?.toLowerCase().includes(searchValue?.toLowerCase());
	});
	const [selectedOption, setSelectedOption] = useState(null);

	return (
		<div
			style={{ width, height, background, borderRadius }}
			className={`filterPopUpContainer ${className}`}
		>
			{searchInput && (
				<div className="filterPopUpHeader">
					<input
						className="filterPopUpSearchInput"
						type="text"
						placeholder={searchInputPlaceholder}
						onChange={(e) => setSearchValue(filter, e?.target?.value)}
						autoFocus
					/>
				</div>
			)}
			<div className="filterPopUpOptionsContainer">
				<InfiniteScroll
					dataLength={filteredOptions?.length ?? 0}
					next={fetchMoreOptions}
					hasMore={hasMoreOptions ?? true}
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
						width: '100%',
					}}
					height={height}
				>
					{filteredOptions?.map((option) => (
						<div
							key={option?.id}
							className="filterPopUpOption"
							onClick={() => {
								setSelectedOption(option?._id);
								onOptionClick(option);
							}}
						>
							<span>{option?.name ?? option?.title}</span>
							{selectedOption === option?._id && <Tick />}
						</div>
					))}
				</InfiniteScroll>
			</div>
		</div>
	);
};

export default memo(FilterPopUp);
