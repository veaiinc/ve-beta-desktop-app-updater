import moment from 'moment';
import '../../../assets/scss/files/files.scss';
import '../../../assets/scss/files/index.scss';
import { ReactComponent as Plus } from '../../../assets/svg/files/Plus.svg';
import { ReactComponent as Add } from '../../../assets/svg/files/add2.svg';
import { ReactComponent as DocIcon } from '../../../assets/svg/files/doc.svg';
import { DocsStatusButton } from '../../features/docs/Docs';
// import DocsCardBg from '../../../assets/images/files/docs-card-bg.png';
import gsap from 'gsap';
import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import FilterDropdown from '../dropDown/file/FilterDropdown';
import InfiniteScroll from '../globalComponents/InfiniteScroll';
import Spinner from '../loaders/Spinner';
import EmptyState from './EmptyState';
// import { fetchOriginSelection } from '../../../helpers';
import { Tooltip } from 'antd';
import { ReactComponent as Link } from '../../../assets/svg/files/link.svg';
import CardsViewIcon from '../../../assets/svg/notesPage/CardsViewIcon';
import ListViewIcon from '../../../assets/svg/notesPage/ListViewIcon';
import { ReactComponent as Search } from '../../../assets/svg/search.svg';
import { message } from '../globalComponents/CustomToast';
// import { ReactComponent as Copy } from '../../../assets/svg/files/copy.svg';
// import { ReactComponent as Share } from '../../../assets/svg/files/share.svg';
// const DocumentShortPreview = lazy(() =>
// 	import('../../../../builderSrc/views/feature/DocumentShortPreview'),
// );

// const origin = fetchOriginSelection();

// const filterOptions = [
// 	{ label: 'All', value: '' },
// 	{ label: 'Form', value: 'form-submission' },
// 	{ label: 'Proposal', value: 'proposal' },
// 	{ label: 'Presentation', value: 'presentation' },
// 	{ label: 'Invoice', value: 'invoice' },
// 	{ label: 'Contract', value: 'contract' },
// ];

const docsStatusButtonStyles = {
	display: 'flex',
	height: '20px',
	padding: '2px 8px',
	justifyContent: 'center',
	alignItems: 'center',
	gap: '4px',
	borderRadius: '100px',
	border: '1px solid var(--stroke, #2B2E31)',
	color: '#FFFFFF',
	fontFamily: 'var(--primary-font-family)',
	fontSize: '10px',
	fontStyle: 'normal',
	fontWeight: '500',
	lineHeight: '14px',
};
const sortOptions = [
	{ label: 'Recently Added', value: 'createdAt', sortType: -1 },
	{ label: 'Recently Updated', value: 'updatedAt', sortType: -1 },
	{ label: 'A-Z', value: 'title', sortType: 1 },
];

const docsCtaMapper = [
	{
		id: 0,
		icon: <Link />,
		action: 'copyDocLink',
	},
	// {
	// 	id: 1,
	// 	icon: <Copy />,
	// 	action: 'duplicate',
	// },
	// {
	// 	id: 2,
	// 	icon: <Share />,
	// 	action: 'share',
	// },
];

const DocsGrid = ({
	statusTextmapper,
	handleTotalChange,
	clientId = null,
	viewMode,
	setViewMode,
}) => {
	const navigate = useNavigate();
	const {
		templates: { getDocsFilesList, docsFilesList, updateStateValues, docsFilesRefetch },
		profileInfo: { tennantSettingsData },
	} = useContext(Context);
	const mountedRef = useRef(true);

	const [info, setInfo] = useState({
		docs: [],
		hasNextPage: false,
		currentPage: 1,
		loading: true,
		searchLoading: false,
		selectedFilter: { label: 'All', value: '' },
		selectedSort: { label: 'Recently Updated', value: 'updatedAt', sortType: -1 },
		searchQuery: '',
		filterOptions: [
			{ label: 'All', value: '' },
			{ label: 'Files Viewed', value: 'filesViewed' },
			{ label: 'Enquiry', value: 'enquiry' },
			{ label: 'Sent', value: 'filesSent' },
			{ label: 'Confirmed', value: 'confirmed' },
			{ label: 'Contract Signed', value: 'contractSigned' },
			{ label: 'Accepted', value: 'proposalAccepted' },
		],
		logoUrl: tennantSettingsData?.logo_s3_500w_key || '',
	});

	// Remove local viewMode state since it's now passed as prop

	useEffect(() => {
		if (!docsFilesList) {
			fetchDocs({ page: 1 });
			updateStateValues({ docsFilesList: null });
		}
	}, [docsFilesList]);

	// // Add refetch mechanism when component mounts
	// useEffect(() => {
	// 	// Clear
	// 	updateStateValues({ docsFilesList: null });
	// 	// Always refetch data when component mounts to ensure fresh data
	// 	fetchDocs({ page: 1 });
	// }, []);

	// // Handle docsFilesRefetch from context
	// useEffect(() => {
	// 	if (docsFilesRefetch) {
	// 		fetchDocs({ page: 1 });
	// 		updateStateValues({ docsFilesRefetch: null });
	// 	}
	// }, [docsFilesRefetch]);

	// Handle filter changes
	// useEffect(() => {
	// 	fetchDocs({ page: 1 });
	// }, [info?.selectedFilter]);

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
	}, [info?.docs?.length, viewMode]);

	useEffect(() => {
		if (docsFilesList) {
			const {
				currentPage = 1,
				hasNextPage = false,
				data = [],
				totalDocs = data.length,
			} = docsFilesList || {};
			const newDocs = currentPage === 1 ? [...data] : [...info?.docs, ...(data || [])];
			handleStateUpdate({ docs: newDocs, currentPage, hasNextPage, loading: false });
			if (typeof handleTotalChange === 'function') {
				handleTotalChange(totalDocs);
			}
		}
	}, [docsFilesList]);

	useEffect(() => {
		if (mountedRef.current) {
			mountedRef.current = false;
			return;
		}
		const timeout = setTimeout(() => {
			fetchDocs({ page: 1 });
		}, 1000);

		return () => clearTimeout(timeout);
	}, [info?.searchQuery, info?.selectedSort?.value, info?.selectedSort?.sortType]);

	const handleStateUpdate = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const fetchDocs = async ({ page = 1, limit = 20 }) => {
		try {
			if (page === 1) {
				handleStateUpdate({ searchLoading: true });
			}
			const { value: sortBy, sortType } = info?.selectedSort;
			const payload = {
				filters: {
					limit,
					page,
					sortBy,
					sortType,
					title: info?.searchQuery,
				},
			};
			if (info?.selectedFilter?.value) {
				payload.filters.status = info.selectedFilter.value;
			}
			if (clientId) {
				payload.filters.clientId = clientId;
			}
			await getDocsFilesList(payload, false);
			handleStateUpdate({ searchLoading: false });
		} catch (error) {
			console.error('Error fetching docs:', error);
			handleStateUpdate({ searchLoading: false });
		}
	};

	const fetchMore = () => {
		if (!info?.hasNextPage) return;
		fetchDocs({ page: info?.currentPage + 1 });
	};

	// useEffect(() => {
	// 	fetchDocs({ page: 1 });
	// }, []);

	const handleSortClick = (value) => {
		let sortType = value?.sortType;
		if (value?.value === info?.selectedSort?.value) {
			sortType = info?.selectedSort?.sortType * -1;
		}
		handleStateUpdate({ selectedSort: { ...value, sortType } });
	};

	const handleFilterClick = (value) => {
		handleStateUpdate({ selectedFilter: value });
	};

	const handleDocClick = useCallback((doc) => {
		if (doc) {
			const version = doc?.version;
			version === 0 || version === null
				? navigate(`/smart-file/${doc?.templateId}/${doc?._id}`)
				: navigate(`/builder/document/view/${doc?._id}?workflow=true`);
		}
	}, []);

	const getDocLink = useCallback(
		(doc) => {
			if (!doc?._id || !tennantSettingsData) return null;

			const workspaceId =
				tennantSettingsData?.workspaceIds?.[tennantSettingsData?.workspaceIds?.length - 1];
			const isCustomDomainExists = tennantSettingsData?.customDomain;

			if (isCustomDomainExists) {
				return `https://${tennantSettingsData.customDomain}/portal/${doc?.slug || doc._id}`;
			} else {
				return `https://${workspaceId}.ve.ai/portal/${doc?.slug || doc._id}`;
			}
		},
		[tennantSettingsData],
	);

	const handleDocCta = ({ e, action, doc }) => {
		e?.stopPropagation();
		if (action === 'copyDocLink') {
			const link = getDocLink(doc);
			if (!link) {
				message.error('Unable to copy document link!');
				return;
			}

			if (!navigator?.clipboard) {
				message.error('Clipboard access not supported!');
				return;
			}

			navigator.clipboard
				.writeText(link)
				.then(() => message.success('Document link copied successfully!'))
				.catch(() => message.error('Failed to copy document link!'));
		} else if (action === 'duplicate') {
			// Handle duplicate document
			console.log('Duplicate doc:', doc);
		} else if (action === 'share') {
			// Handle share document
			console.log('Share doc:', doc);
		}
	};

	return (
		<div className="card-sub-container-center">
			<div className="header-container">
				<div className="center-container-header">
					<FilterDropdown
						options={info?.filterOptions}
						selected={info?.selectedFilter}
						onOptionClick={handleFilterClick}
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
				) : info?.docs?.length > 0 ? (
					<InfiniteScroll
						dataLength={info?.docs?.length}
						next={fetchMore}
						hasMore={info?.hasNextPage}
						height={'100%'}
					>
						<div className={`card-container${viewMode === 'list' ? ' list-view' : ''}`}>
							{viewMode === 'list' ? (
								<div
									className="card-item create"
									onClick={() => navigate('/builder/create-document')}
								>
									<div className="card-item-style card-item-style-btn docs-list-create-row">
										<DocIcon className="create-doc-icon" />
										<div className="doc-add-text">
											<span className="create-doc-text">Create Document</span>
											<span className="create-doc-subtext">
												Begin a document that’s structured to grow with your
												thinking.
											</span>
										</div>
										<Add className="create-doc-plus" />
									</div>
								</div>
							) : (
								<div
									className="card-item create"
									onClick={() => navigate('/builder/create-document')}
								>
									<div className="card-item-style card-item-style-btn">
										<button className="card-btn">
											<Plus />
											Create Document
										</button>
									</div>
								</div>
							)}
							{info?.docs?.map((doc, index) => (
								<div
									className="card-item "
									key={index}
									onClick={() => handleDocClick(doc)}
								>
									<div
										className="docsCardContainer"
										onClick={() => handleDocClick(doc)}
									>
										{viewMode === 'card' ? (
											<div className="docsCardPreview">
												{doc?.imageUrl ? (
													<img src={doc?.imageUrl} alt="doc" />
												) : (
													<div className="docsCardPreviewPlaceholder">
														<img src={info?.logoUrl} alt="doc" />
														{/* <DocIcon className="placeholder-icon" />
														<div className="placeholder-text">
															No Preview Available
														</div> */}
													</div>
												)}
												<div className="docsCardOverlay">
													<div className="docsTitleOnPreview">
														{doc?.title}
													</div>
													<div className="docsSubtitleOnPreview">
														{info?.selectedSort?.value ===
														'updatedAt' ? (
															<Tooltip title="Updated On">
																{moment
																	.unix(doc?.updatedAt)
																	.fromNow()}
															</Tooltip>
														) : (
															<Tooltip title="Created On">
																{moment
																	.unix(doc?.createdAt)
																	.fromNow()}
															</Tooltip>
														)}
													</div>
												</div>
											</div>
										) : (
											<div className="docsListInfo">
												<div className="docsListContent">
													<div className="docsTitleOnPreview">
														{doc?.title}
													</div>
													<div className="docsSubtitleOnPreview">
														{info?.selectedSort?.value ===
														'updatedAt' ? (
															<Tooltip title="Updated On">
																{moment
																	.unix(doc?.updatedAt)
																	.fromNow()}
															</Tooltip>
														) : (
															<Tooltip title="Created On">
																{moment
																	.unix(doc?.createdAt)
																	.fromNow()}
															</Tooltip>
														)}
													</div>
												</div>
												<DocsStatusButton
													content={statusTextmapper?.[doc?.status]?.text}
													style={{
														...statusTextmapper?.[doc?.status]?.style,
														...docsStatusButtonStyles,
													}}
													dotStyle={
														statusTextmapper?.[doc?.status]?.dotStyle
													}
												/>
												<div className="cta-container">
													{docsCtaMapper?.map((cta) => (
														<div
															className="cta"
															key={cta?.id}
															onClick={(e) =>
																handleDocCta({
																	e,
																	action: cta?.action,
																	doc: doc,
																})
															}
														>
															{cta?.icon}
														</div>
													))}
												</div>
											</div>
										)}
										{viewMode === 'card' && (
											<div className="docsTitleContainer">
												<DocsStatusButton
													content={statusTextmapper?.[doc?.status]?.text}
													style={{
														...statusTextmapper?.[doc?.status]?.style,
														...docsStatusButtonStyles,
													}}
													dotStyle={
														statusTextmapper?.[doc?.status]?.dotStyle
													}
												/>
												<div className="cta-container">
													{docsCtaMapper?.map((cta) => (
														<div
															className="cta"
															key={cta?.id}
															onClick={(e) =>
																handleDocCta({
																	e,
																	action: cta?.action,
																	doc: doc,
																})
															}
														>
															{cta?.icon}
														</div>
													))}
												</div>
											</div>
										)}
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
							// buttonOnClick={handleCreateDoc}
							buttonText={'Create Document'}
							showUpload={false}
							buttonOnClick={() => navigate('/builder/create-document')}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(DocsGrid);
