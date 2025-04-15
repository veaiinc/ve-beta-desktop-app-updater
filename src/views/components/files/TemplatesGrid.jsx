import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import { ReactComponent as Plus } from '../../../assets/svg/files/Plus.svg';
import Spinner from '../../components/loaders/Spinner';
import { memo, useContext, useEffect, useState, useCallback } from 'react';
import Context from '../../../context/context';
import InfiniteScroll from '../globalComponents/InfiniteScroll';
import gsap from 'gsap';
const TemplatesGrid = ({ isLoading, handleCreateTemplate }) => {
	const {
		templates: { myWorkflows, getMyWorkflows },
	} = useContext(Context);

	const [info, setInfo] = useState({
		workflowTemplates: [],
		currentPage: 1,
		hasNextPage: false,
		loading: true,
	});

	useEffect(() => {
		getMyWorkflowTemplatesData(1);
	}, []);

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
			const payload = {
				filters: {
					limit: 20,
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

	const fetchMore = () => {
		if (!info?.hasNextPage) return;
		getMyWorkflowTemplatesData(info?.currentPage + 1);
	};

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
				loading: false,
			}));
		},
		[info?.workflowTemplates],
	);

	return info?.loading ? (
		<div className="spinner-container">
			<Spinner />
		</div>
	) : (
		<InfiniteScroll
			dataLength={info?.workflowTemplates?.length}
			next={fetchMore}
			hasMore={info?.hasNextPage}
			height={'100%'}
		>
			<div className={`card-container`}>
				<div className="card-item" onClick={handleCreateTemplate}>
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
						// onClick={() => navigate(`/template/${template?._id}`)}
					>
						<div className="card-item-style content-wrapper">
							<span
								className={`status-badge ${
									template?.status === 'published' ? 'live' : 'draft'
								}`}
							>
								{getStatusBadge(template)}
							</span>
							<span className="item-title">
								{template?.title?.slice(0, 20)}
								{template?.title?.length > 20 ? '...' : ''}
							</span>
						</div>
					</div>
				))}
			</div>
		</InfiniteScroll>
	);
};

export default memo(TemplatesGrid);
