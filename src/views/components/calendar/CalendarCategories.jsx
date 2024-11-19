import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import '../../../assets/scss/calendar/calendarCategories.scss';
import { ReactComponent as PlusSvg } from '../../../assets/svg/calendar/plus.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/calendar/down.svg';
import { ReactComponent as UpSvg } from '../../../assets/svg/calendar/up.svg';
import AddCategoryModal from './AddCategoryModal';

const CalendarCategories = () => {
	const [info, setInfo] = useState({
		expanded: false,
		height: '62px',
		isCategoryModalOpen: false,
		isCategoryEditable: false,
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

	const handleCategoryExpand = useCallback(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			expanded: !prevInfo.expanded,
		}));
	}, []);

	const handleCategoryModalClose = useCallback(() => {
		setInfo((previnfo) => ({ ...previnfo, isCategoryModalOpen: false }));
	}, []);

	const handleCategoryModalOpen = useCallback(() => {
		setInfo((previnfo) => ({ ...previnfo, isCategoryModalOpen: true }));
	}, []);

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
					<span className="headicon" onClick={handleCategoryModalOpen}>
						<PlusSvg />
					</span>
				</div>

				<div className="expandIcon" onClick={handleCategoryExpand}>
					{info?.expanded ? <UpSvg /> : <DownSvg />}
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
			{info?.isCategoryModalOpen ? (
				<AddCategoryModal
					handleCategoryModalClose={handleCategoryModalClose}
					isCategoryEditable={info?.isCategoryEditable}
				/>
			) : (
				''
			)}
		</div>
	);
};

export default memo(CalendarCategories);
