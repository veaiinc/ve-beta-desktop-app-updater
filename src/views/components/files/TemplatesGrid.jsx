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
import { ReactComponent as Search } from '../../../assets/svg/search.svg';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import ListViewIcon from '../../../assets/svg/notesPage/ListViewIcon';
import CardsViewIcon from '../../../assets/svg/notesPage/CardsViewIcon';
import { ReactComponent as TemplateIcon } from '../../../assets/svg/files/templat.svg';
import { ReactComponent as Plus2 } from '../../../assets/svg/files/add2.svg';
import { accessControlCheck } from '../../../helpers/accessControlCheck';

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
	// { label: 'Recently Updated', value: 'updatedAt', sortType: -1 },
	{ label: 'A-Z', value: 'title', sortType: 1 },
];
let origin = fetchOriginSelection();
const TemplatesGrid = ({ handleTotalChange, viewMode, setViewMode }) => {
	const mountedRef = useRef(true);
	const {
		templates: {
			myWorkflows,
			getMyWorkflows,
			createBlankTemplate,
			templatesRefetch,
			updateStateValues,
		},
	} = useContext(Context);

	const navigate = useNavigate();

	const [info, setInfo] = useState({
		workflowTemplates: [],
		currentPage: 1,
		hasNextPage: false,
		loading: true,
		searchLoading: false,
		selectedFilter: { label: 'All', value: '' },
		selectedSort: { label: 'Recently Created', value: 'createdAt', sortType: -1 },
		blankTemplateLoading: false,
		searchQuery: '',
	});
	// Remove local viewMode state since it's now passed as prop
	useEffect(() => {
		if (!myWorkflows) {
			getMyWorkflowTemplatesData(1);
		}
	}, [myWorkflows]);

	// Add refetch mechanism when component mounts
	// useEffect(() => {
	// 	// Clear
	// 	updateStateValues({ myWorkflows: null });
	// 	// Always refetch data when component mounts to ensure fresh data
	// 	getMyWorkflowTemplatesData(1);
	// }, []);

	// Handle templatesRefetch from context
	// useEffect(() => {
	// 	if (templatesRefetch) {
	// 		getMyWorkflowTemplatesData(1);
	// 		updateStateValues({ templatesRefetch: null });
	// 	}
	// }, [templatesRefetch]);

	useEffect(() => {
		if (mountedRef.current) {
			mountedRef.current = false;
			return;
		}
		const timeout = setTimeout(() => {
			getMyWorkflowTemplatesData(1);
		}, 1000);

		return () => clearTimeout(timeout);
	}, [
		info?.searchQuery,
		info?.selectedFilter?.value,
		info?.selectedSort?.value,
		info?.selectedSort?.sortType,
	]);

	useEffect(() => {
		if (myWorkflows) {
			const currentPage = myWorkflows?.currentPage || 1;
			myWorkflowsDataParser(myWorkflows, currentPage !== 1);
		}
	}, [myWorkflows]);
	useEffect(() => {
		// Skip animations when in list view
		if (viewMode === 'list') return;

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
	}, [info?.workflowTemplates?.length, viewMode]);

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
			try {
				if (page === 1) {
					handleStateUpdate({ searchLoading: true, loading: true });
				}
				const { value: sortBy, sortType } = info?.selectedSort;
				const payload = {
					filters: {
						limit: 20,
						page,
						type: 'workspace',
						sortBy,
						sortType,
						action: info?.selectedFilter?.value,
						title: info?.searchQuery || undefined,
					},
				};
				getMyWorkflows(payload, fetchMore);
			} catch (error) {
				console.error('Error fetching templates:', error);
				handleStateUpdate({ searchLoading: false, loading: false });
			}
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
				searchLoading: false,
				workflowTemplates,
				currentPage,
				hasNextPage,
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
		navigate(`/builder/${templateId}`);
	};

	const handleCreateBlankTemplate = async () => {
		if (!accessControlCheck('workflow')) return;
		if (info?.blankTemplateLoading) return;
		setInfo((prev) => ({ ...prev, blankTemplateLoading: true }));
		const response = await createBlankTemplate({
			templateInput: {
				title: 'Untitled Template',
			},
		});

		if (response?.[0]) {
			navigate(`/builder/${response?.[1]?.data?.createBlankTemplate?._id}`);
			setInfo((prev) => ({ ...prev, blankTemplateLoading: false }));
		} else {
			setInfo((prev) => ({ ...prev, blankTemplateLoading: false }));
			message.error('Failed to create blank template');
		}
	};

	return (
		<div className="card-sub-container-center">
			<div className="header-container">
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
					<div className="filter-container-search">
						<Search width={16} height={16} />
						<input
							type="text"
							placeholder="Search"
							value={info?.searchQuery}
							onChange={(e) => handleStateUpdate({ searchQuery: e.target.value })}
							className="search-input"
						/>
						{info?.searchLoading && info?.searchQuery?.length > 0 && (
							<div className="search-spinner">
								<Spinner
									size="small"
									width={16}
									height={16}
									borderWidth={1.5}
									color="var(--primary-button)"
								/>
							</div>
						)}
					</div>
				</div>
				<div className="view-mode">
					<div
						className={`view-mode-icon${viewMode === 'list' ? ' selected' : ''}`}
						onClick={() => setViewMode('list')}
					>
						<ListViewIcon />
					</div>
					<div
						className={`view-mode-icon${viewMode === 'card' ? ' selected' : ''}`}
						onClick={() => setViewMode('card')}
					>
						<CardsViewIcon />
					</div>
				</div>
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
						<div className={`card-container${viewMode === 'list' ? ' list-view' : ''}`}>
							{viewMode === 'list' ? (
								<div
									className="card-item create"
									onClick={handleCreateBlankTemplate}
								>
									<div className="card-item__style card-item__style--btn docs-list__create-row">
										<TemplateIcon className="create-doc-icon" />
										<div className="doc-add-text">
											<span className="create-doc-text">Create Template</span>
											<span className="create-doc-subtext">
												Build a template that sets the tone, layout, and
												style for all your future creations.
											</span>
										</div>
										<Plus2 className="create-doc-plus" />
									</div>
								</div>
							) : (
								<div
									className="card-item create"
									onClick={handleCreateBlankTemplate}
								>
									<div className="card-item-style card-item-style-btn">
										<button className="card-btn">
											<Plus />
											Create Template
										</button>
									</div>
								</div>
							)}
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
										<span className="item-title">{template?.title || ''}</span>
										<span className="notes-sub-heading">
											<Tooltip title="Created On">
												{moment.unix(template?.createdAt).fromNow()}
											</Tooltip>
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
