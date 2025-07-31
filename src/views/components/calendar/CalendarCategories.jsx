import { memo, useCallback, useState, useRef, useEffect } from 'react';
import '../../../assets/scss/calendar/calendarCategories.scss';
import { ReactComponent as PencilSvg } from '../../../assets/svg/calendar/pencil.svg';
import UpdateCategoryModal from '../modalsV2/calendar/UpdateCategoryModal';
import PlusSvg from '../../../assets/svg/my_templates/PlusSvg';
import { ReactComponent as DownSvg } from '../../../assets/svg/calendar/down.svg';

const CalendarCategories = ({
	categoryList,
	selectedCategory,
	categoryFilter,
	updateCalendarInfo,
}) => {
	const [info, setInfo] = useState({
		expanded: false,
		isCategoryModalOpen: false,
		isCategoryEditable: false,
		selectedCalendarCategory: [selectedCategory] || [],
	});
	const expandRef = useRef(null);

	// Auto expand when there are items to display
	useEffect(() => {
		const hasItems = categoryList?.length > 0;
		if (hasItems && !info?.expanded) {
			setInfo((prev) => ({ ...prev, expanded: true }));
		}
	}, [categoryList]);

	const handleCategoryExpand = useCallback(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			expanded: !prevInfo?.expanded,
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
			(cat) => cat?.name?.toLowerCase() === 'null' || cat?.type?.toLowerCase() === 'null',
		)?._id;
		const allCategory = categoryList?.find(
			(cat) => cat?.name?.toLowerCase() === 'all' || cat?.type?.toLowerCase() === 'all',
		)?._id;

		let updatedFilter = [...(categoryFilter || [])];

		if (categoryId === allCategory) {
			// Selecting 'All' should deselect others
			updatedFilter = [allCategory];
			updateCalendarInfo('categoryFilter', updatedFilter);
			updateCalendarInfo(
				'selectedCategory',
				categoryList?.find((cat) => cat?._id === allCategory),
			);
			return;
		}

		// Remove 'all' if it's selected
		updatedFilter = updatedFilter.filter((id) => id !== allCategory);

		if (updatedFilter.includes(categoryId)) {
			// Deselecting the category
			updatedFilter = updatedFilter.filter((id) => id !== categoryId);
		} else {
			// Selecting the category
			updatedFilter.push(categoryId);
		}

		if (updatedFilter.length === 0) {
			// No filters selected — fallback to default (or just 'all' if needed)
			if (defaultCategory) {
				updatedFilter = [defaultCategory];
				updateCalendarInfo(
					'selectedCategory',
					categoryList?.find((cat) => cat?._id === defaultCategory),
				);
			} else {
				updatedFilter = [];
				updateCalendarInfo('selectedCategory', null);
			}
		} else {
			// One or more categories selected
			updateCalendarInfo(
				'selectedCategory',
				categoryList?.find((cat) => cat?._id === categoryId),
			);
		}

		updateCalendarInfo('categoryFilter', updatedFilter);
	};

	return (
		<div
			className={`categoriesParentContainer ${info?.expanded ? 'expanded' : ''}`}
			ref={expandRef}
		>
			<div className="categoriesHeadWrapper">
				<div className="headerContainer">
					<span className="headLabel">Categories</span>
				</div>
				<div className="headerButtonsContainer">
					<div className="addCategoryButton" onClick={handleAddCategoryClick}>
						<PlusSvg />
					</div>
					<div className="expandIcon" onClick={handleCategoryExpand}>
						<DownSvg />
					</div>
				</div>
			</div>

			{info?.expanded && (
				<div
					className="categoriesContainer"
					style={{
						overflowY: 'auto',
						maxHeight: '138px',
					}}
				>
					{categoryList?.map((category) => {
						const isChecked = categoryFilter?.includes(category?._id);
						return (
							<div className="categoryTypeContainer" key={category?._id}>
								<div className="typeWrapper">
									<span
										className="statusIndicator"
										style={{ backgroundColor: category?.color }}
									></span>
									<label
										htmlFor={`${category?.name}-checkbox`}
										className="typeLabel"
									>
										{category?.name}
										{category?.name?.toLowerCase() !== 'all' &&
											category?.type?.toLowerCase() !== 'all' && (
												<button
													className="editButton"
													onClick={() => handleEditCategory(category)}
												>
													<PencilSvg />
												</button>
											)}
									</label>
									<input
										type="checkbox"
										className="checkBox"
										id={`${category?.name}-checkbox`}
										checked={isChecked}
										onChange={() => handleCheckboxChange(category?._id)}
										aria-checked={isChecked}
										aria-label={`${category?.name} category`}
									/>
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
