import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import { ReactComponent as Plus } from '../../../assets/svg/files/Plus.svg';
import Spinner from '../../components/loaders/Spinner';
import { memo, useContext, useEffect, useState, useCallback } from 'react';
import Context from '../../../context/context';
import InfiniteScroll from '../globalComponents/InfiniteScroll';
import gsap from 'gsap';
import FilterDropdown from '../dropDown/file/FilterDropdown';
import { fetchOriginSelection } from '../../../helpers';
import { message } from '../globalComponents/CustomToast';
import moment from 'moment';
import EmptyState from './EmptyState';
import { Tooltip } from 'antd';

const filterOptions = [
	{ label: 'All', value: '' },
	{ label: 'Form', value: 'form-submission' },
	{ label: 'Proposal', value: 'proposal' },
	{ label: 'Presentation', value: 'presentation' },
	{ label: 'Invoice', value: 'invoice' },
	{ label: 'Contract', value: 'contract' },
];

const sortOptions = [
	{ label: 'Recently Created', value: 'createdAt', sortType: -1 },
	{ label: 'Recently Updated', value: 'updatedAt', sortType: -1 },
	{ label: 'A-Z', value: 'title', sortType: 1 },
];
let origin = fetchOriginSelection();
const TemplatesGrid = ({ handleTotalChange }) => {
	const {
		templates: { myWorkflows, getMyWorkflows, createBlankTemplate },
	} = useContext(Context);

	const [info, setInfo] = useState({
		workflowTemplates: [],
		currentPage: 1,
		hasNextPage: false,
		loading: true,
		selectedFilter: { label: 'All', value: '' },
		selectedSort: { label: 'Recently Created', value: 'createdAt', sortType: -1 },
		blankTemplateLoading: false,
	});

	useEffect(() => {
		getMyWorkflowTemplatesData(1);
	}, [info?.selectedFilter?.value, info?.selectedSort?.value, info?.selectedSort?.sortType]);

	useEffect(() => {
		if (myWorkflows) {
			const currentPage = myWorkflows?.currentPage || 1;
			myWorkflowsDataParser(myWorkflows, currentPage !== 1);
		}
	}, [myWorkflows]);
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
	}, [info?.workflowTemplates?.length]);

	const getStatusBadge = (template) => {
		if (!template?.workflowStats) return 'Draft';

		if (template.workflowStats.contractSigned) return 'Client Signed';
		if (template.workflowStats.filesViewed) return 'Client Viewed';
		if (template.workflowStats.filesSent) return 'Sent';
		if (template.workflowStats.confirmed) return 'Confirmed';
		if (template.workflowStats.enquiry) return 'Draft';

		return template?.status === 'published' ? 'Live' : 'Draft';
	};

	const getMyWorkflowTemplatesData = useCallback(
		(page, fetchMore = false) => {
			const { value: sortBy, sortType } = info?.selectedSort;
			const payload = {
				filters: {
					limit: 20,
					page: page,
					type: 'workspace',
					sortBy,
					sortType,
					action: info?.selectedFilter?.value,
				},
			};
			if (info?.searchChanged) {
				payload.filters.title = info?.searchValue || '';
			}
			getMyWorkflows(payload, fetchMore);
		},
		[info, info?.selectedFilter?.value],
	);

	const fetchMore = () => {
		if (!info?.hasNextPage) return;
		getMyWorkflowTemplatesData(info?.currentPage + 1);
	};

	const myWorkflowsDataParser = useCallback(
		(dataToBeUsed, fetchMore = false) => {
			const { data, currentPage, hasNextPage, totalDocs } = dataToBeUsed;
			let workflowTemplates = [];

			for (let i = 0; i < data?.length; i++) {
				if (
					data?.[i]?.tenantId &&
					data?.[i]?.tenantId !== null &&
					data?.[i]?.status === 'published'
				) {
					workflowTemplates?.push(data?.[i]);
				}
			}

			if (fetchMore) {
				workflowTemplates = [...(info?.workflowTemplates || [])]?.concat(workflowTemplates);
			}
			setInfo((prev) => ({
				...prev,
				loading: false,
				workflowTemplates,
				currentPage,
				hasNextPage,
				loading: false,
			}));
			handleTotalChange(totalDocs);
		},
		[info?.workflowTemplates],
	);
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

	const handleCardClick = (templateId) => {
		window.location.href = `${origin}/${templateId}`;
	};

	const handleCreateBlankTemplate = async () => {
		if (info?.blankTemplateLoading) return;
		setInfo((prev) => ({ ...prev, blankTemplateLoading: true }));
		const response = await createBlankTemplate({
			templateInput: {
				title: 'Untitled Template',
			},
		});

		if (response?.[0]) {
			window.location.href = `${origin}/${response?.[1]?.data?.createBlankTemplate?._id}`;
			setInfo((prev) => ({ ...prev, blankTemplateLoading: false }));
		} else {
			setInfo((prev) => ({ ...prev, blankTemplateLoading: false }));
			message.error('Failed to create blank template');
		}
	};

	return (
		<div className="card-sub-container-center">
			<div className="center-container-header">
				<FilterDropdown
					options={filterOptions}
					selected={info?.selectedFilter}
					onOptionClick={(value) => handleStateUpdate({ selectedFilter: value })}
					width="130px"
				/>
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
				) : info?.workflowTemplates?.length > 0 ? (
					<InfiniteScroll
						dataLength={info?.workflowTemplates?.length}
						next={fetchMore}
						hasMore={info?.hasNextPage}
						height={'100%'}
					>
						<div className={`card-container`}>
							<div className="card-item" onClick={handleCreateBlankTemplate}>
								<div className="card-item-style card-item-style-btn">
									<button className="card-btn">
										<Plus />
										Create Template
									</button>
								</div>
							</div>
							{info?.workflowTemplates?.map((template, index) => (
								<div
									className="card-item"
									key={index}
									onClick={() => handleCardClick(template?._id)}
								>
									<div
										className="card-item-style content-wrapper note-card-content templates-grid-container tooltip"
										data-tooltip={template?.title || ''}
									>
										{/* <span
											className={`status-badge ${
												template?.status === 'published' ? 'live' : 'draft'
											}`}
										>
											{getStatusBadge(template)}
										</span> */}
										<span className="item-title">{template?.title || ''}</span>
										<span className="notes-sub-heading">
											{moment.unix(template?.createdAt).fromNow()}
										</span>
									</div>
								</div>
							))}
						</div>
					</InfiniteScroll>
				) : (
					<div className="spinner-container">
						<EmptyState
							title={'No templates here'}
							subtitle={'Try creating some templates'}
							buttonOnClick={handleCreateBlankTemplate}
							buttonText={'Create template'}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(TemplatesGrid);
