import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/my_templates/myTemplates.scss';
import { ReactComponent as Stars } from '../../../assets/svg/my_templates/stars.svg';
import { ReactComponent as Plus } from '../../../assets/svg/my_templates/plus.svg';
import { ReactComponent as Search } from '../../../assets/svg/my_templates/search.svg';
import { ReactComponent as UpDownArrow } from '../../../assets/svg/my_templates/up-down-arrow.svg';
import { ReactComponent as Filter } from '../../../assets/svg/my_templates/filter.svg';
import { ReactComponent as ThreeDots } from '../../../assets/svg/my_templates/three-dots.svg';
import { fetchOriginSelection } from '../../../helpers';
import TemplateCards from '../../components/myTemplate/TemplateCards';
import Context from '../../../context/context';
import QuickActions from '../../components/globalComponents/QuickActions';
import SearchSvg from '../../../assets/svg/activity/SearchSvg';
import PlusSvg from '../../../assets/svg/my_templates/PlusSvg';
import UpDownArrowSvg from '../../../assets/svg/my_templates/UpDownArrowSvg';
import ThreeDotsSvg from '../../../assets/svg/my_templates/ThreeDotsSvg';
import FilterSvg from '../../../assets/svg/my_templates/FilterSvg';
import { ReactComponent as Cross } from '../../../assets/svg/docs/cross.svg';
import Spinner from '../../components/loaders/Spinner';
import { message } from 'antd';

let origin = fetchOriginSelection();
const SubTitle = () => {
	return (
		<div className="subTitleContainer">
			<span>with AI</span>
		</div>
	);
};

const cards = [
	{
		id: 1,
		title: `Create a Template`,
		subTitle: <SubTitle />,
	},
	// {
	// 	id: 2,
	// 	title: 'Import file or URL',
	// 	subTitle: 'Create template from your file or URL',
	// },
	{
		id: 3,
		title: 'Install template from playbook',
		subTitle: 'find your templates in Ve.Ai Marketplace',
	},
	{ id: 4, title: 'Create a Blank Template' },
];

const ctaItems = [
	{
		id: 1,
		icon: <PlusSvg />,
	},
	{
		id: 1,
		icon: <SearchSvg />,
	},
	{
		id: 1,
		icon: <UpDownArrowSvg />,
	},
	{
		id: 1,
		icon: <FilterSvg />,
	},
	{
		id: 1,
		icon: <ThreeDotsSvg />,
	},
];

const initialState = {
	activeNav: 1,
	loading: true,
	workflowTemplates: [],
	hasNextPage: false,
	currentPage: 1,
	activeTab: 'all', //all, proposals, invoices, contracts, presentations
	searchValue: '',
	searchExpand: false,
	searchChanged: false,
	timeout: null,
	blankTemplateLoading: false,
};

const MyTemplates = () => {
	const {
		templates: {
			getMyWorkflows,
			myWorkflows,
			myMoreWorkflows,
			getSpecificTemplatesInfo,
			specificTemplatesInfo,
			updateStateValues,
			templatesRefetch,
			createBlankTemplate,
		},
	} = useContext(Context);
	const navigate = useNavigate();

	const [info, setInfo] = useState({
		...initialState,
	});

	useEffect(() => {
		getMyWorkflowTemplatesData(1);
		return () => {
			setInfo((prev) => ({
				...prev,
				...initialState,
			}));
		};
	}, []);

	useEffect(() => {
		if (templatesRefetch) {
			getMyWorkflowTemplatesData(1);
			updateStateValues({ templatesRefetch: null });
		}
	}, [templatesRefetch]);

	useEffect(() => {
		if (myWorkflows) {
			myWorkflowsDataParser(myWorkflows);
		}
	}, [myWorkflows]);

	useEffect(() => {
		if (myMoreWorkflows) {
			myWorkflowsDataParser(myMoreWorkflows, true);
		}
	}, [myMoreWorkflows]);

	useEffect(() => {
		if (info?.searchChanged) {
			handleDebounceFetchSearchResults();
		}
	}, [info?.searchValue, info?.searchChanged]);

	const getMyWorkflowTemplatesData = useCallback(
		(page, fetchMore = false) => {
			const payload = {
				filters: {
					limit: 16,
					page: page,
					type: 'workspace',
					status: 'published',
					sortBy: 'createdAt',
					sortType: -1,
				},
			};
			if (info?.searchChanged) {
				payload.filters.title = info?.searchValue || '';
			}
			getMyWorkflows(payload, fetchMore);
		},
		[info],
	);

	const fetchMoreMyWorkflows = useCallback(() => {
		getMyWorkflowTemplatesData(info?.currentPage + 1, true);
	}, [info?.hasNextPage, info?.currentPage]);

	const myWorkflowsDataParser = useCallback(
		(dataToBeUsed, fetchMore = false) => {
			let { data, currentPage, hasNextPage } = dataToBeUsed;
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
			}));
		},
		[info?.workflowTemplates],
	);

	const tabs = useMemo(() => {
		return {
			all: {
				label: 'All',
				comp: (
					<TemplateCards
						data={info?.workflowTemplates}
						loading={info?.loading}
						hasNextPage={info?.hasNextPage}
						fetchMoreMyWorkflows={fetchMoreMyWorkflows}
					/>
				),
			},
			// proposals: {
			// 	label: 'Proposals',
			// 	comp: <div>Proposals</div>,
			// },
			// invoices: {
			// 	label: 'Invoices',
			// 	comp: <div>Invoices</div>,
			// },
			// contracts: {
			// 	label: 'Contracts',
			// 	comp: <div>Contracts</div>,
			// },
			// presentations: {
			// 	label: 'Presentations',
			// 	comp: <div>Presentations</div>,
			// },
		};
	}, [info?.activeTab, info?.workflowTemplates]);

	const handleTabChange = useCallback(
		(tab) => {
			if (tab === info?.activeTab) return;
			setInfo((prev) => ({ ...prev, activeTab: tab }));
		},
		[info?.activeTab],
	);

	const handleCardClick = (card) => {
		if (card?.id === 3) {
			navigate('/playbook');
		} else if (card?.id === 4) {
			handleCreateBlankTemplate();
		} else if (card?.id === 1) {
			window.location.href = `${origin}/design-builder`;
		}
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
	const handleDebounceFetchSearchResults = useCallback(() => {
		clearInterval(info?.timeout);
		const timeout = setTimeout(() => {
			getMyWorkflowTemplatesData(1);
		}, 500);
		setInfo((prev) => ({ ...prev, timeout }));
	}, [info]);

	return (
		<div className="myTemplatesContainer">
			<div className="headerContainer">
				<div className="myTemplatesHeader">
					<div className="headerTextContainer">
						<div className="headerText">
							<span className="lineOne">Templates</span>
							<span className="lineTwo">You Created</span>
						</div>
						<div className="headerSubText">
							Create, save, and reuse templates for documents, proposals, invoices,
							contracts, and presentations.
						</div>
					</div>
					<div className="quickActionsBtn">
						<QuickActions />
					</div>
				</div>

				<div className="cardsContainer">
					{cards.map((card) => (
						<div
							className="card"
							key={card?.id}
							onClick={() => handleCardClick(card)}
							style={{
								cursor: card?.id === 3 || card?.id === 4 ? 'pointer' : 'default',
							}}
						>
							<h2 className="cardTitle">
								{card?.id === 4 && info?.blankTemplateLoading ? (
									<Spinner height="20px" width="20px" />
								) : (
									card?.title
								)}
							</h2>
							<p className="cardSubTitle">{card?.subTitle}</p>
						</div>
					))}
				</div>
				<h1 className="title">My Templates</h1>
			</div>

			<div className="templateWrapper">
				<nav className="navContainer">
					<div className="navItemsContainer">
						{Object?.keys(tabs)?.map((tab) => (
							<div
								className={`navItem ${tab === info?.activeTab ? 'active' : ''}`}
								key={tab}
								onClick={() => handleTabChange(tab)}
							>
								{tabs?.[tab]?.label}
							</div>
						))}
					</div>

					<div
						className="searchContainer"
						style={{
							width: info?.searchExpand ? '140px' : '16px',
						}}
					>
						<div className={`searchBtn ${info?.searchExpand ? 'searchExpand' : ''}`}>
							<span
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									cursor: 'pointer',
								}}
								onClick={() =>
									setInfo((prev) => ({
										...prev,
										searchExpand: true,
									}))
								}
							>
								<Search />
							</span>

							<div className="inputAndCloseContainer">
								<input
									className="searchInputTag"
									placeholder="Search"
									value={info?.searchValue}
									onChange={(e) =>
										setInfo((prev) => ({
											...prev,
											searchValue: e?.target?.value,
											searchChanged: true,
										}))
									}
								/>
								<span
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										cursor: 'pointer',
									}}
									onClick={() => {
										setInfo((prev) => ({
											...prev,
											searchExpand: false,
											searchValue: '',
										}));
									}}
								>
									<Cross style={{ width: '20px', height: '20px' }} />
								</span>
							</div>
						</div>
					</div>
				</nav>

				{tabs?.[info?.activeTab]?.comp || ''}
			</div>
		</div>
	);
};

export default memo(MyTemplates);
