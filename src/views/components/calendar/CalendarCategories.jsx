import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/calendar/calendarCategories.scss';
import { ReactComponent as PlusSvg } from '../../../assets/svg/calendar/plus.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/calendar/down.svg';
import { ReactComponent as UpSvg } from '../../../assets/svg/calendar/up.svg';

const CalendarCategories = () => {
	const [info, setInfo] = useState({
		expanded: false,
		// categories: [
		//     { name: 'Meeting', selected: false },
		//     { name: 'Work', selected: false },
		//     { name: 'Personal', selected: false },
		// ],
		// selectedCategory: '',
		// showCategories: false,
		// showAddCategory: false,
		// addCategory: '',
		// error: false,
		// errorMessage: '',
		// addCategoryError: false,
		// addCategoryErrorMessage: '',
		// addCategorySuccess: false,
		// addCategorySuccessMessage: '',
		// addCategoryButtonLoading: false,
		// showCategoryFilter: false,
		// filterCategory: '',
		// filterCategories: [],
		// showCategorySort: false,
		// sortCategory: '',
		// sortCategories: [],
	});
	const handleCategoryExpand = useCallback(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			expanded: !prevInfo.expanded,
		}));
	}, []);
	return (
		<div className="categoriesParentContainer">
			<div className="categoriesHeadWrapper">
				<div className="headerContainer">
					<span className="headLabel">Categories</span>
					<span className="headicon">
						<PlusSvg />
					</span>
				</div>

				<div className="expandIcon">
					{info?.expanded ? (
						<UpSvg onClick={handleCategoryExpand} />
					) : (
						<DownSvg onClick={handleCategoryExpand} />
					)}
				</div>
			</div>

			{info?.expanded ? (
				<div className="categoriesContainer">
					<div> meet </div>
				</div>
			) : (
				''
			)}
		</div>
	);
};

export default memo(CalendarCategories);
