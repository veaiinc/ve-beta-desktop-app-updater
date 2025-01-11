import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/my_templates/myTemplates.scss';
import { ReactComponent as Stars } from '../../../assets/svg/my_templates/stars.svg';
import { ReactComponent as Plus } from '../../../assets/svg/my_templates/plus.svg';
import { ReactComponent as Search } from '../../../assets/svg/my_templates/search.svg';
import { ReactComponent as UpDownArrow } from '../../../assets/svg/my_templates/up-down-arrow.svg';
import { ReactComponent as Filter } from '../../../assets/svg/my_templates/filter.svg';
import { ReactComponent as ThreeDots } from '../../../assets/svg/my_templates/three-dots.svg';
import Skeleton from 'react-loading-skeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import Context from '../../../context/context';

const SubTitle = () => {
	return (
		<div className="subTitleContainer">
			<Stars />
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

const navItems = [
	{
		id: 1,
		title: 'All',
	},
	{
		id: 2,
		title: 'Templates',
	},
	{
		id: 3,
		title: 'Invoice',
	},
	{
		id: 4,
		title: 'Contract',
	},
	{
		id: 5,
		title: 'Presentation',
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
	loading: false,
	workflowTemplates: [],
	hasNextPage: false,
	currentPage: 1,
};

const MyTemplates = () => {
	const {
		templates: { getMyWorkflows, myWorkflows, myMoreWorkflows },
	} = useContext(Context);

	const [info, setInfo] = useState({
		...initialState,
	});

	useEffect(() => {
		console.log('workflowTemplates', info?.workflowTemplates);
	}, [info?.workflowTemplates]);

	useEffect(() => {
		getMyWorkflowTemplatesData(1);
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

	return (
		<div className="myTemplatesContainer">
			<div className="headerContainer">
				<h1 className="title">My Templates</h1>
				<div className="cardsContainer">
					{cards.map((card) => (
						<div className="card" key={card?.id}>
							<h2 className="cardTitle">{card?.title}</h2>
							<p className="cardSubTitle">{card?.subTitle}</p>
						</div>
					))}
				</div>
			</div>

			<div className="templateWrapper">
				<nav className="navContainer">
					<div className="navItemsContainer">
						{navItems?.map((navItem) => (
							<div
								className={`navItem ${
									navItem?.id === info?.activeNav ? 'active' : ''
								}`}
								key={navItem?.id}
								onClick={() => setInfo({ activeNav: navItem?.id })}
							>
								{navItem?.title}
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

				<div className="myTemplatesInfiniteContainer">
					{info?.loading ? (
						[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]?.map(
							(ele, index) => <Skeleton key={index} height={258} width={232} />,
						)
					) : (
						<InfiniteScroll
							dataLength={info?.workflowTemplates?.length || 0}
							hasMore={info?.hasNextPage}
							next={fetchMoreMyWorkflows}
							loader={[{}, {}, {}]?.map((ele, index) => (
								<Skeleton key={index} height={258} width={232} />
							))}
							style={{
								display: 'flex',
								flexDirection: 'row',
								flexWrap: 'wrap',
								flexFlow: 'wrap',
								alignItems: 'flex-end',
								alignContent: 'flex-start',
								gap: '8px',
								width: '100%',
								overflowX: 'hidden',
							}}
							className="tetsing"
							height="calc(100vh - 340px)"
						>
							{info?.workflowTemplates?.map((template, index) => (
								<div key={index} className="docsTemplateCard">
									<div className="docsTemplateImageContainer">
										{/* <div className="docsTemplateHoverContentContainer">
											<div className="docsHoverArrowContainer">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="13"
													height="8"
													viewBox="0 0 13 8"
													fill="none"
												>
													<path
														fill-rule="evenodd"
														clip-rule="evenodd"
														d="M6.55711 5.30343L11.8604 0.000179734L12.9209 1.06068L7.08736 6.89418C6.94671 7.03478 6.75598 7.11377 6.55711 7.11377C6.35824 7.11377 6.16751 7.03478 6.02686 6.89418L0.193359 1.06068L1.25386 0.000180198L6.55711 5.30343Z"
														fill="#E0E0E0"
														fill-opacity="0.48"
													/>
												</svg>
											</div>
											<div className="docsHoverOptionsContainer">
												<span className="docsHoverOptionsStyling">
													Create File
												</span>
												<span className="docsHoverOptionsStyling">
													Edit Design
												</span>
												<span className="docsHoverOptionsStyling">
													Duplicate
												</span>
												<span className="docsHoverOptionsStyling">
													Delete
												</span>
											</div>
										</div> */}
										<img
											src="https://s3-alpha-sig.figma.com/img/15b6/6719/e9a63a81d478a52552ed98ac31e7a2b6?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=AHd93og5SQiiQLECz4ZuNCrzERGP~NAz3qk7eS5Sfl2rnN0oWzjo~8CgS5fNWE5Knb5s0yTjbQ7uXSeHW6H8J3E1eSneLfc0U9057RjAp0VEqJ-evjzPJjlrXdlli85n2yZM7obW8hfc~8-9MlR57xLGtWobCP7v50apSuXv~1NXhnucgryS87p1CZyKsZZ1Ro-JHIDtSqRygCQDk7N~x2ZS0u5JL6cEZF~nC0oZdxR73cBZ1yBbIG~CYAqEdojkRWVcoOYkPROyviNf-vIl8O3kRvgvVLXAgH7WeebcdHwODd4LeNcCXL7uhHAfZPRwvTeKbq4NW9MarD7lglA2cw__"
											alt="Template preview"
										/>
									</div>
									<div className="docsFooterContent">
										<span className="docsFooterContentTitle">
											{template?.title || 'Template Card'}
										</span>
										<span className="docsFooterContentSubTitle">
											created 14 files
										</span>
									</div>
								</div>
							))}
						</InfiniteScroll>
					)}
				</div>
			</div>
		</div>
	);
};

export default memo(MyTemplates);
