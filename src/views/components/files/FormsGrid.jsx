import { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import moment from 'moment';
import InfiniteScroll from '../globalComponents/InfiniteScroll';
import Context from '../../../context/context';
import gsap from 'gsap';
import Spinner from '../loaders/Spinner';
import FilterDropdown from '../dropDown/file/FilterDropdown';
import EmptyState from './EmptyState';
import { ReactComponent as Plus } from '../../../assets/svg/files/Plus.svg';
import { ReactComponent as Link } from '../../../assets/svg/files/link.svg';
import { ReactComponent as Copy } from '../../../assets/svg/files/copy.svg';
import { ReactComponent as Share } from '../../../assets/svg/files/share.svg';
import { ReactComponent as GreenDot } from '../../../assets/svg/files/green-dot.svg';
import { ReactComponent as GreyDot } from '../../../assets/svg/files/grey-dot.svg';
import { ReactComponent as TrendUp } from '../../../assets/svg/files/trend-up.svg';
import { ReactComponent as Search } from '../../../assets/svg/search.svg';
import { message } from '../globalComponents/CustomToast';
import { fetchOriginSelection } from '../../../helpers';
import { Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

const sortOptions = [
	{ label: 'Recently Added', value: 'createdAt', sortType: -1 },
	// { label: 'Recently Updated', value: 'updatedAt', sortType: -1 },
	{ label: 'A-Z', value: 'title', sortType: 1 },
];

const fileCtaMapper = [
	{
		id: 0,
		icon: <Link />,
		action: 'copyFormLink',
	},
	// {
	// 	id: 1,
	// 	icon: <Copy />,
	// 	action: 'duplicate',
	// },
	// {
	// 	id: 2,
	// 	icon: <Share />,
	// action: 'share',
	// },
];

const FormsGrid = ({
	statusTextmapper,
	handleCreateForm,
	handleNavigateForm,
	handleTotalChange,
}) => {
	const activeWorkspaceId = localStorage.getItem('workspaceId');
	const origin = fetchOriginSelection();

	const {
		templates: {
			getTemplatesListForForms,
			formsTemplatesList,
			duplicateGlobalWorkflowTemplate,
		},
		profileInfo: { tennantSettingsData },
	} = useContext(Context);

	const navigate = useNavigate();

	const [info, setInfo] = useState({
		forms: [],
		hasNextPage: false,
		currentPage: 1,
		loading: true,
		searchLoading: false,
		selectedSort: { label: 'Recently Created', value: 'createdAt', sortType: -1 },
		searchQuery: '',
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
		const timeout = setTimeout(() => {
			fetchForms({ page: 1 });
		}, 1000);

		return () => clearTimeout(timeout);
	}, [info?.searchQuery, info?.selectedSort?.value, info?.selectedSort?.sortType]);

	useEffect(() => {
		if (formsTemplatesList) {
			const {
				currentPage = 1,
				hasNextPage = false,
				data = [],
				totalDocs = 0,
			} = formsTemplatesList || {};
			const newForms = currentPage === 1 ? [...data] : [...info?.forms, ...(data || [])];

			handleStateUpdate({
				forms: newForms,
				currentPage,
				hasNextPage,
				loading: false,
				searchLoading: false,
			});
			handleTotalChange(totalDocs);
		}
	}, [formsTemplatesList]);

	const fetchForms = ({ page = 1, limit = 20 }) => {
		try {
			if (page === 1) {
				handleStateUpdate({ searchLoading: true, loading: true });
			}
			const { value: sortBy, sortType } = info?.selectedSort;
			getTemplatesListForForms(page, limit, false, { sortBy, sortType }, info?.searchQuery);
		} catch (error) {
			console.error('Error fetching forms:', error);
			handleStateUpdate({ searchLoading: false, loading: false });
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

	const handleFileCta = ({ e, action, slug, formId, formTitle }) => {
		e?.stopPropagation();
		if (action === 'copyFormLink') {
			const link = getFormLinkUrl(slug);

			if (!link) {
				message.error('Unable to copy form link!');
				return;
			}

			if (!navigator?.clipboard) {
				message.error('Clipboard access not supported!');
				return;
			}

			navigator.clipboard
				.writeText(link)
				.then(() => message.success('Form link copied successfully!'))
				.catch(() => message.error('Failed to copy form link!'));
		} else if (action === 'duplicate') {
			handleDuplicateForm({ formId, formTitle });
		}
	};

	const getFormLinkUrl = useCallback(
		(slug) => {
			if (!activeWorkspaceId || !slug) return null;

			return tennantSettingsData?.customDomain?.length
				? `https://${tennantSettingsData.customDomain}/${slug}`
				: `https://${activeWorkspaceId}.ve.ai/${slug}`;
		},
		[activeWorkspaceId, tennantSettingsData?.customDomain],
	);

	const handleDuplicateForm = useCallback(
		async ({ formId, formTitle }) => {
			try {
				if (!formId) {
					throw new Error('Form ID is missing');
				}
				const payload = {
					templateId: formId,
					title: `Copy of ${formTitle}`,
				};
				const response = await duplicateGlobalWorkflowTemplate(payload);
				if (response?.[0]) {
					message?.success('Form duplicated successfully');
					navigate(`/builder/${response?.[1]?._id}`);
				} else {
					message?.error('Failed to duplicate form. Please try again.');
				}
			} catch (error) {
				console.error('Error duplicating form:', error);
				message?.error('Failed to duplicate form. Please try again.');
			}
		},
		[duplicateGlobalWorkflowTemplate],
	);

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
				<div className="filter-container-search">
					<Search width={16} height={16} />
					<input
						type="text"
						placeholder="Search"
						value={info?.searchQuery}
						onChange={(e) => handleStateUpdate({ searchQuery: e.target.value })}
						className="search-input"
					/>
					{info?.searchLoading && (
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
						<div className="card-container">
							<div className="card-item create" onClick={handleCreateForm}>
								<div className="card-item-style card-item-style-btn">
									<button className="card-btn">
										<Plus />
										Create Form
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
											<div className="card-header">
												<h1 className="form-title">{form?.title}</h1>
												{form?.formResponsesCount > 0 && (
													<p className="responses-count">
														<span>{form?.formResponsesCount}</span>{' '}
														<span>
															Response
															{form?.formResponsesCount > 1 && 's'}
														</span>{' '}
														<TrendUp />
													</p>
												)}
												<p
													className="createdAt"
													data-tooltip={`Created on ${moment
														.unix(form?.createdAt)
														.format('DD MMM YYYY')}`}
												>
													<Tooltip title="Created On">
														{moment.unix(form?.createdAt).fromNow()}
													</Tooltip>
												</p>
											</div>
											<div className="card-footer">
												<div className="cta-container">
													{fileCtaMapper?.map((cta) => (
														<div
															className="cta"
															key={cta?.id}
															onClick={(e) =>
																handleFileCta({
																	e,
																	action: cta?.action,
																	slug: form?.slug,
																	formId: form?._id,
																	formTitle: form?.title,
																})
															}
														>
															{cta?.icon}
														</div>
													))}
												</div>
												<div className="file-status">
													{form?.status === 'published' ? (
														<>
															<GreenDot />
															<span>Live</span>
														</>
													) : (
														<>
															<GreyDot />
															<span>Draft</span>
														</>
													)}
												</div>
											</div>
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
