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
					<div className="categoryTypeContainer">
						<div className="typeWrapper">
							<input type="checkbox" className="checkBox" id="meeting-checkbox" />
							<label for="meeting-checkbox" className="typeLabel">
								Meeting
							</label>
						</div>
						<div className="statusWrapper" data-type="meeting">
							<div className="statusCount">
								<span className="activeCount">4</span>/
								<span className="totalCount">15</span>
							</div>

							<span className="statusIndicator"></span>
						</div>
					</div>
					<div className="categoryTypeContainer">
						<div className="typeWrapper">
							<input type="checkbox" className="checkBox" id="task-checkbox" />
							<label for="task-checkbox" className="typeLabel">
								Task
							</label>
						</div>
						<div className="statusWrapper" data-type="task">
							<div className="statusCount">
								<span className="activeCount">4</span>/
								<span className="totalCount">15</span>
							</div>

							<span className="statusIndicator"></span>
						</div>
					</div>
					<div className="categoryTypeContainer">
						<div className="typeWrapper">
							<input type="checkbox" className="checkBox" id="payment-checkbox" />
							<label for="payment-checkbox" className="typeLabel">
								Payments
							</label>
						</div>
						<div className="statusWrapper" data-type="payments">
							<div className="statusCount">
								<span className="activeCount">4</span>/
								<span className="totalCount">15</span>
							</div>

							<span className="statusIndicator"></span>
						</div>
					</div>
					<div className="categoryTypeContainer">
						<div className="typeWrapper">
							<input
								type="checkbox"
								className="checkBox"
								id="appointments-checkbox"
							/>
							<label for="appointments-checkbox" className="typeLabel">
								Appointments
							</label>
						</div>
						<div className="statusWrapper" data-type="appointments">
							<div className="statusCount">
								<span className="activeCount">4</span>/
								<span className="totalCount">15</span>
							</div>

							<span className="statusIndicator"></span>
						</div>
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
};

export default memo(CalendarCategories);
