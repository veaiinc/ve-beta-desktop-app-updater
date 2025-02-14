import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import '../../../assets/scss/my_templates/myTemplates.scss';
import { ReactComponent as Stars } from '../../../assets/svg/my_templates/stars.svg';
import { ReactComponent as Plus } from '../../../assets/svg/my_templates/plus.svg';
import { ReactComponent as Search } from '../../../assets/svg/my_templates/search.svg';
import { ReactComponent as UpDownArrow } from '../../../assets/svg/my_templates/up-down-arrow.svg';
import { ReactComponent as Filter } from '../../../assets/svg/my_templates/filter.svg';
import { ReactComponent as ThreeDots } from '../../../assets/svg/my_templates/three-dots.svg';
import TemplateCards from '../../components/myTemplate/TemplateCards';
import Context from '../../../context/context';
import QuickActions from '../../components/globalComponents/QuickActions';

const SubTitle = () => {
	return (
		<div className="subTitleContainer">
			<span>This is a template</span>
		</div>
	);
};

const cards = [
	{
		id: 1,
		title: `Let's Create a New Template`,
		subTitle: <SubTitle />,
	},
	{
		id: 2,
		title: 'Import file or URL',
		subTitle: 'Create template from your file or URL',
	},
	{
		id: 3,
		title: 'Install template from playbook',
		subTitle: 'Pick your template from playbook',
	},
];

const ctaItems = [
	{
		id: 1,
		icon: <Plus />,
	},
	{
		id: 1,
		icon: <Search />,
	},
	{
		id: 1,
		icon: <UpDownArrow />,
	},
	{
		id: 1,
		icon: <Filter />,
	},
	{
		id: 1,
		icon: <ThreeDots />,
	},
];

const initialState = {
	activeNav: 1,
	loading: true,
	workflowTemplates: [],
	hasNextPage: false,
	currentPage: 1,
	activeTab: 'all', //all, proposals, invoices, contracts, presentations
};

const MyTemplates = () => {
	const {
		templates: {
			getMyWorkflows,
			myWorkflows,
			myMoreWorkflows,
			getSpecificTemplatesInfo,
			specificTemplatesInfo,
		},
	} = useContext(Context);

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
		if (myWorkflows) {
			myWorkflowsDataParser(myWorkflows);
		}
	}, [myWorkflows]);

	useEffect(() => {
		if (myMoreWorkflows) {
			myWorkflowsDataParser(myMoreWorkflows, true);
		}
	}, [myMoreWorkflows]);

	const getMyWorkflowTemplatesData = useCallback((page, fetchMore = false) => {
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
		getMyWorkflows(payload, fetchMore);
	}, []);

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

	return (
		<div className="myTemplatesContainer">
			<div className="headerContainer">
				<div className="myTemplatesHeader">
					<div className="headerText">
						<span className="lineOne">Templates</span>
						<span className="lineTwo">You Created</span>
					</div>
					<div className="quickActionsBtn">
						<QuickActions />
					</div>
				</div>

				<div className="cardsContainer">
					{cards.map((card) => (
						<div className="card" key={card?.id}>
							<h2 className="cardTitle">{card?.title}</h2>
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
					<div className="ctaContainer">
						{ctaItems?.map((ctaItem) => (
							<div className="ctaItem" key={ctaItem?.id}>
								{ctaItem?.icon}
							</div>
						))}
					</div>
				</nav>

				{tabs?.[info?.activeTab]?.comp || ''}
			</div>
		</div>
	);
};

export default memo(MyTemplates);
