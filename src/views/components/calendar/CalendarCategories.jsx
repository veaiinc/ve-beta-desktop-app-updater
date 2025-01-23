import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import '../../../assets/scss/calendar/calendarCategories.scss';
import { ReactComponent as PlusSvg } from '../../../assets/svg/calendar/plus.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/calendar/down.svg';
import { ReactComponent as UpSvg } from '../../../assets/svg/calendar/up.svg';
import { ReactComponent as PencilSvg } from '../../../assets/svg/calendar/pencil.svg';
import UpdateCategoryModal from '../modalsV2/calendar/UpdateCategoryModal';

const CalendarCategories = ({
	categoryList,
	selectedCategory,
	categoryFilter,
	updateCalendarInfo,
}) => {
	const [info, setInfo] = useState({
		expanded: false,
		height: '62px',
		isCategoryModalOpen: false,
		isCategoryEditable: false,
		selectedCalendarCategory: [selectedCategory] || [],
	});
	const expandRef = useRef(null);

	useEffect(() => {
		if (info?.expanded) {
			// Calculate the height of the expanded content
			const fullHeight = expandRef.current.scrollHeight;
			setInfo((prevInfo) => ({
				...prevInfo,
				height: `${fullHeight + 16}px`,
			}));
		} else {
			// Set height back to the collapsed size
			setInfo((prevInfo) => ({
				...prevInfo,
				height: `62px`,
			}));
		}
	}, [info?.expanded]);

	useEffect(() => {
		if (window.innerHeight >= 950) {
			handleCategoryExpand();
		}
	}, [categoryList]);

	const handleCategoryExpand = useCallback(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			expanded: !prevInfo.expanded,
		}));
	}, []);

	const categoryModalOpen = () => {
		setInfo((prev) => ({ ...prev, isCategoryModalOpen: true }));
	};

	const handleAddCategoryClick = useCallback(() => {
		setInfo((prevInfo) => ({ ...prevInfo, isCategoryEditable: false }));
		categoryModalOpen();
	}, []);

	const handleEditCategory = useCallback((selectedCategory) => {
		setInfo((prevInfo) => ({ ...prevInfo, isCategoryEditable: true }));
		updateCalendarInfo('selectedCategory', selectedCategory);

		categoryModalOpen();
	}, []);

	// Handler for checkbox changes
	const handleCheckboxChange = (categoryId) => {
		const defaultCategory = categoryList?.find(
			(cat) =>
				cat?.name?.toLowerCase() === 'default' || cat?.type?.toLowerCase() === 'default',
		)?._id;

		// If selecting Default category
		if (categoryId === defaultCategory) {
			// If Default is already selected, keep it selected, otherwise select only Default
			const updatedFilter = categoryFilter?.includes(defaultCategory)
				? [defaultCategory]
				: [defaultCategory];
			updateCalendarInfo('categoryFilter', updatedFilter);
			return;
		}

		// If selecting a non-Default category
		let updatedFilter;
		if (categoryFilter?.includes(categoryId)) {
			// Unselect the category if it's already selected
			updatedFilter = categoryFilter?.filter((id) => id !== categoryId);
			// If this would result in an empty filter, select the default category
			if (updatedFilter.length === 0) {
				updatedFilter = [defaultCategory];
			}
		} else {
			// Add the category and remove Default if it was selected
			updatedFilter = [...categoryFilter?.filter((id) => id !== defaultCategory), categoryId];
		}

		updateCalendarInfo('categoryFilter', updatedFilter);
	};

	return (
		<div
			className={`categoriesParentContainer `}
			style={{
				height: info?.height,
			}}
			ref={expandRef}
		>
			<div className="categoriesHeadWrapper">
				<div className="headerContainer">
					<span className="headLabel">Categories</span>
					<span className="headicon" onClick={handleAddCategoryClick}>
						<PlusSvg />
					</span>
				</div>

				<div className="expandIcon" onClick={handleCategoryExpand}>
					{info?.expanded ? <UpSvg /> : <DownSvg />}
				</div>
			</div>

			{info?.expanded && (
				<div className="categoriesContainer">
					{categoryList?.map((category) => {
						const isChecked = categoryFilter?.includes(category?._id);
						return (
							<div className="categoryTypeContainer" key={category?._id}>
								<div className="typeWrapper">
									<input
										type="checkbox"
										className="checkBox"
										id={`${category?.name}-checkbox`}
										checked={isChecked}
										onChange={() => handleCheckboxChange(category?._id)}
										aria-checked={isChecked}
										aria-label={`${category?.name} category`}
									/>
									<label
										htmlFor={`${category?.name}-checkbox`}
										className="typeLabel"
									>
										{category?.name}
									</label>
									<button
										className="editButton"
										onClick={() => handleEditCategory(category)}
									>
										<PencilSvg />
									</button>
								</div>
								<div className="statusWrapper">
									<span
										className="statusIndicator"
										style={{ borderColor: category?.color }}
									></span>
								</div>
							</div>
						);
					})}
				</div>
			)}

			<UpdateCategoryModal
				show={info?.isCategoryModalOpen}
				handleClose={() => setInfo((prev) => ({ ...prev, isCategoryModalOpen: false }))}
				isCategoryEditable={info?.isCategoryEditable}
				selectedCategory={selectedCategory}
			/>
		</div>
	);
};

export default memo(CalendarCategories);
