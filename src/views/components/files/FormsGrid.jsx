import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import { ReactComponent as Plus } from '../../../assets/svg/files/Plus.svg';
import moment from 'moment';
import { DocsStatusButton } from '../../features/docs/Docs';
import { memo, useContext, useEffect, useState } from 'react';
import InfiniteScroll from '../globalComponents/InfiniteScroll';
import Context from '../../../context/context';
import gsap from 'gsap';
import Spinner from '../loaders/Spinner';
import FilterDropdown from '../dropDown/file/FilterDropdown';
import EmptyState from './EmptyState';
import { Tooltip } from 'antd';

const sortOptions = [
	{ label: 'Recently Added', value: 'createdAt', sortType: -1 },
	{ label: 'Recently Updated', value: 'updatedAt', sortType: -1 },
	{ label: 'A-Z', value: 'title', sortType: 1 },
];

const FormsGrid = ({
	statusTextmapper,
	handleCreateForm,
	handleNavigateForm,
	handleTotalChange,
}) => {
	const {
		templates: { getTemplatesListForForms, formsTemplatesList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		forms: [],
		hasNextPage: false,
		currentPage: 1,
		loading: true,
		selectedSort: { label: 'Recently Created', value: 'createdAt', sortType: -1 },
	});

	useEffect(() => {
		const delay =
			info.selectedView === 'Classic Gallery' || info.selectedView === 'Lite Gallery'
				? 100
				: 0;

		const timeout = setTimeout(() => {
			const cards = document.querySelectorAll(
				'.card-container .card-item:not(.card-item-style-btn)',
			);
			if (!cards || cards.length === 0) return;

			const newCards = Array.from(cards).filter((card) => !card.dataset.animated);
			if (newCards.length === 0) return;

			const ctx = gsap.context(() => {
				newCards.forEach((card) => {
					const yOffset = 50 + Math.random() * 100;
					gsap.set(card, {
						y: yOffset,
						opacity: 0,
					});
				});

				const columnGroups = {
					oddColumns: newCards.filter((_, index) => index % 4 === 0 || index % 4 === 2),
					evenColumns: newCards.filter((_, index) => index % 4 === 1 || index % 4 === 3),
				};

				gsap.to(columnGroups.oddColumns, {
					y: 0,
					opacity: 1,
					duration: 0.4,
					stagger: {
						each: 0.05,
						ease: 'power1.out',
					},
					modifiers: {
						y: (y, target) => {
							const initialY = Math.abs(
								parseFloat(target.style.transform?.split('translateY(')[1]) || 0,
							);
							const duration = gsap.utils.mapRange(50, 150, 0.4, 0.2)(initialY);
							if (target._gsap) target._gsap.duration = duration;
							return y;
						},
					},
					onComplete: () => {
						columnGroups.oddColumns.forEach((card) => {
							card.dataset.animated = 'true';
						});
					},
				});

				gsap.to(columnGroups.evenColumns, {
					y: 0,
					opacity: 1,
					duration: 0.4,
					delay: 0.1,
					stagger: {
						each: 0.05,
						ease: 'power1.out',
					},
					modifiers: {
						y: (y, target) => {
							const initialY = Math.abs(
								parseFloat(target.style.transform?.split('translateY(')[1]) || 0,
							);
							const duration = gsap.utils.mapRange(50, 150, 0.4, 0.2)(initialY);
							if (target._gsap) target._gsap.duration = duration;
							return y;
						},
					},
					onComplete: () => {
						columnGroups.evenColumns.forEach((card) => {
							card.dataset.animated = 'true';
						});
					},
				});
			}, cards[0]);

			return () => ctx.revert();
		}, delay);

		return () => clearTimeout(timeout);
	}, [info?.forms?.length]);

	useEffect(() => {
		fetchForms({ page: 1 });
	}, [info?.selectedSort?.value, info?.selectedSort?.sortType]);

	useEffect(() => {
		if (formsTemplatesList) {
			const {
				currentPage = 1,
				hasNextPage = false,
				data = [],
				totalDocs = 0,
			} = formsTemplatesList || {};
			const newForms = currentPage === 1 ? [...data] : [...info?.forms, ...(data || [])];

			handleStateUpdate({ forms: newForms, currentPage, hasNextPage, loading: false });
			handleTotalChange(totalDocs);
		}
	}, [formsTemplatesList]);

	const fetchForms = ({ page = 1, limit = 20 }) => {
		try {
			const { value: sortBy, sortType } = info?.selectedSort;
			getTemplatesListForForms(page, limit, false, { sortBy, sortType });
		} catch (error) {
			console.error('Error fetching forms:', error);
		}
	};

	const fetchMore = () => {
		if (!info?.hasNextPage) return;
		fetchForms({ page: info?.currentPage + 1 });
	};

	const handleStateUpdate = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const handleSortClick = (value) => {
		let sortType = value?.sortType;
		if (value?.value === info?.selectedSort?.value) {
			sortType = info?.selectedSort?.sortType * -1;
		}
		handleStateUpdate({ selectedSort: { ...value, sortType } });
	};

	return (
		<div className="card-sub-container-center">
			<div className="center-container-header">
				<FilterDropdown
					options={sortOptions}
					selected={info?.selectedSort}
					onOptionClick={handleSortClick}
					showSelectedEndArrow
					width="180px"
					hideOnOptionClick={false}
				/>
			</div>
			<div className="center-container-content">
				{info?.loading ? (
					<div className="spinner-container">
						<Spinner />
					</div>
				) : info?.forms?.length > 0 ? (
					<InfiniteScroll
						dataLength={info?.forms?.length}
						next={fetchMore}
						hasMore={info?.hasNextPage}
						height={'100%'}
					>
						<div className={`card-container`}>
							<div className="card-item" onClick={handleCreateForm}>
								<div className="card-item-style card-item-style-btn">
									<button className="card-btn">
										<Plus />
										New Form
									</button>
								</div>
							</div>
							{info?.forms?.map((form, index) => (
								<div
									className="card-item"
									key={index}
									onClick={() => handleNavigateForm(form)}
								>
									<div className="card-item-style content-wrapper docs">
										<div className="docs-title-wrapper docs-title-wrapper-form">
											<span className="docs-item-title">
												{statusTextmapper?.[form?.status]?.text}
											</span>
											<span className="docs-item-title">
												{form?.title.slice(0, 20)}
											</span>
											<span className="docs-item-sub-title">
												{moment.unix(form?.createdAt).fromNow()}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</InfiniteScroll>
				) : (
					<div className="spinner-container">
						<EmptyState
							title={'No Forms here'}
							subtitle={'Try creating some forms'}
							buttonOnClick={handleCreateForm}
							buttonText={'Create form'}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(FormsGrid);
