import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import '../../../assets/scss/calendar/calendarCategories.scss';
import { ReactComponent as PlusSvg } from '../../../assets/svg/calendar/plus.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/calendar/down.svg';
import { ReactComponent as UpSvg } from '../../../assets/svg/calendar/up.svg';
import { ReactComponent as PencilSvg } from '../../../assets/svg/calendar/pencil.svg';
import UpdateCategoryModal from '../modalsV2/calendar/UpdateCategoryModal';

const CalendarCategories = () => {
	const [info, setInfo] = useState({
		expanded: false,
		height: '62px',
		isCategoryModalOpen: false,
		isCategoryEditable: false,
		colorsArray: [
			'#CF824B',
			'#89AC4F',
			'#4F9BAC',
			'#7E78C9',
			'#C378C9',
			'#5E8BE2',
			'#CF4B92',
			'#7A7A7A',
			'#B08D8D',
			'#D76262',
		],
		categoryLabelData: {
			name: '',
			type: '',
			color: '',
		},
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

	const categoryModalOpen = () => {
		setInfo((prev) => ({ ...prev, isCategoryModalOpen: true }));
	};

	const handleAddCategoryClick = useCallback(() => {
		setInfo((prevInfo) => ({ ...prevInfo, isCategoryEditable: false }));
		categoryModalOpen();
	}, []);

	const handleCategoryEditClick = useCallback(() => {
		setInfo((prevInfo) => ({ ...prevInfo, isCategoryEditable: true }));
		categoryModalOpen();
	}, []);

	const handelCategoryLabelDataChange = useCallback((key, value) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			categoryLabelData: { ...prevInfo.categoryLabelData, [key]: value },
		}));
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
					<span className="headicon" onClick={handleAddCategoryClick}>
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
							<label htmlFor="meeting-checkbox" className="typeLabel">
								Meeting
							</label>
							<button className="editButton" onClick={handleCategoryEditClick}>
								<PencilSvg />
							</button>
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
							<label htmlFor="task-checkbox" className="typeLabel">
								Task
							</label>
							<button className="editButton" onClick={handleCategoryEditClick}>
								<PencilSvg />
							</button>
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
							<label htmlFor="payment-checkbox" className="typeLabel">
								Payments
							</label>
							<button className="editButton" onClick={handleCategoryEditClick}>
								<PencilSvg />
							</button>
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
							<label htmlFor="appointments-checkbox" className="typeLabel">
								Appointments
							</label>
							<button className="editButton" onClick={handleCategoryEditClick}>
								<PencilSvg />
							</button>
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

			<UpdateCategoryModal
				open={info?.isCategoryModalOpen}
				closeModal={() => setInfo((prev) => ({ ...prev, isCategoryModalOpen: false }))}
				isCategoryEditable={info?.isCategoryEditable}
				name={info?.categoryLabelData?.name}
				type={info?.categoryLabelData?.type}
				color={info?.categoryLabelData?.color}
				colorsArray={info?.colorsArray}
				handelCategoryLabelDataChange={handelCategoryLabelDataChange}
			/>
		</div>
	);
};

export default memo(CalendarCategories);
