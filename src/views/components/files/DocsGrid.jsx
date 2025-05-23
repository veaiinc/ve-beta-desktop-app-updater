import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import moment from 'moment';
import { DocsStatusButton } from '../../features/docs/Docs';
import { ReactComponent as Plus } from '../../../assets/svg/files/Plus.svg';
import DocsCardBg from '../../../assets/images/files/docs-card-bg.png';
import { useNavigate } from 'react-router-dom';
import { memo, useContext, useEffect, useState, useCallback } from 'react';
import InfiniteScroll from '../globalComponents/InfiniteScroll';
import Context from '../../../context/context';
import gsap from 'gsap';
import Spinner from '../loaders/Spinner';
import FilterDropdown from '../dropDown/file/FilterDropdown';
import EmptyState from './EmptyState';
import { fetchOriginSelection } from '../../../helpers';
import { Tooltip } from 'antd';

const origin = fetchOriginSelection();

// const filterOptions = [
// 	{ label: 'All', value: '' },
// 	{ label: 'Form', value: 'form-submission' },
// 	{ label: 'Proposal', value: 'proposal' },
// 	{ label: 'Presentation', value: 'presentation' },
// 	{ label: 'Invoice', value: 'invoice' },
// 	{ label: 'Contract', value: 'contract' },
// ];

const sortOptions = [
	{ label: 'Recently Added', value: 'createdAt', sortType: -1 },
	{ label: 'Recently Updated', value: 'updatedAt', sortType: -1 },
	{ label: 'A-Z', value: 'title', sortType: 1 },
];

const DocsGrid = ({ statusTextmapper, handleCreateDoc, handleTotalChange, clientId = null }) => {
	const navigate = useNavigate();

	const {
		templates: { getDocsFilesList, docsFilesList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		docs: [],
		hasNextPage: false,
		currentPage: 1,
		loading: true,
		selectedFilter: { label: 'All', value: '' },
		selectedSort: { label: 'Recently Updated', value: 'updatedAt', sortType: -1 },
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
	}, [info?.docs?.length]);

	useEffect(() => {
		if (docsFilesList) {
			const {
				currentPage = 1,
				hasNextPage = false,
				data = [],
				totalDocs = 0,
			} = docsFilesList || {};
			const newDocs = currentPage === 1 ? [...data] : [...info?.docs, ...(data || [])];
			handleStateUpdate({ docs: newDocs, currentPage, hasNextPage, loading: false });
			handleTotalChange(totalDocs);
		}
	}, [docsFilesList]);

	useEffect(() => {
		fetchDocs({ page: 1 });
	}, [info?.selectedSort?.value, info?.selectedSort?.sortType]);

	const handleStateUpdate = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const fetchDocs = async ({ page = 1, limit = 20 }) => {
		try {
			const { value: sortBy, sortType } = info?.selectedSort;
			const payload = {
				filters: {
					limit,
					page,
					sortBy,
					sortType,
					// action: info?.selectedFilter?.value,
				},
			};
			if (clientId) {
				payload.filters.clientId = clientId;
			}
			await getDocsFilesList(payload, false);
		} catch (error) {
			console.error('Error fetching docs:', error);
		}
	};

	const fetchMore = () => {
		if (!info?.hasNextPage) return;
		fetchDocs({ page: info?.currentPage + 1 });
	};

	const handleSortClick = (value) => {
		let sortType = value?.sortType;
		if (value?.value === info?.selectedSort?.value) {
			sortType = info?.selectedSort?.sortType * -1;
		}
		handleStateUpdate({ selectedSort: { ...value, sortType } });
	};

	const handleDocClick = useCallback((doc) => {
		if (doc) {
			const version = doc?.version;
			version === 0 || version === null
				? navigate(`/smart-file/${doc?.templateId}/${doc?._id}`)
				: (window.location.href = `${origin}/document/view/${doc?._id}?workflow=true`);
		}
	}, []);

	return (
		<div className="card-sub-container-center">
			<div className="center-container-header">
				{/* <FilterDropdown
					options={filterOptions}
					selected={info?.selectedFilter}
					onOptionClick={(value) => handleStateUpdate({ selectedFilter: value })}
					width="130px"
				/> */}
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
				) : info?.docs?.length > 0 ? (
					<InfiniteScroll
						dataLength={info?.docs?.length}
						next={fetchMore}
						hasMore={info?.hasNextPage}
						height={'100%'}
					>
						<div className={`card-container`}>
							<div
								className="card-item"
								// onClick={handleCreateDoc}
								onClick={() => {
									window.location.href = `${origin}/create-document`;
								}}
							>
								<div className="card-item-style card-item-style-btn">
									<button className="card-btn">
										<Plus />
										Create Document
									</button>
								</div>
							</div>
							{info?.docs?.map((doc, index) => (
								<div
									className="card-item"
									key={index}
									onClick={() => handleDocClick(doc)}
								>
									<div className="card-item-style content-wrapper docs">
										<img
											className="docs-card-bg"
											src={DocsCardBg}
											alt="Docs Card Background"
										/>
										<div className="docs-preview"></div>
										<DocsStatusButton
											content={statusTextmapper?.[doc?.status]?.text}
											style={statusTextmapper?.[doc?.status]?.style}
											dotStyle={statusTextmapper?.[doc?.status]?.dotStyle}
										/>
										<div className="docs-title-wrapper docs-card-container">
											<span className="docs-item-title">{doc?.title}</span>
											<span className="docs-item-sub-title">
												{info?.selectedSort?.value === 'updatedAt' ? (
													<Tooltip title="Updated On">
														{moment.unix(doc?.updatedAt).fromNow()}
													</Tooltip>
												) : (
													<Tooltip title="Created On">
														{moment.unix(doc?.createdAt).fromNow()}
													</Tooltip>
												)}
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
							title={'No documents found!'}
							subtitle={
								'Start by creating a document, image, or media to keep everything in one place.'
							}
							buttonOnClick={handleCreateDoc}
							buttonText={'Create Document'}
							showUpload={false}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(DocsGrid);
