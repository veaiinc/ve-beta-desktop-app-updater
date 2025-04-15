import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import moment from 'moment';
import { DocsStatusButton } from '../../features/docs/Docs';
import { ReactComponent as Plus } from '../../../assets/svg/files/Plus.svg';
import { useNavigate } from 'react-router-dom';
import { memo, useContext, useEffect, useState } from 'react';
import InfiniteScroll from '../globalComponents/InfiniteScroll';
import Context from '../../../context/context';
import gsap from 'gsap';
import Spinner from '../loaders/Spinner';
const DocsGrid = ({ statusTextmapper, handleCreateDoc }) => {
	const navigate = useNavigate();

	const {
		templates: { getDocsFilesList, docsFilesList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		docs: [],
		hasNextPage: false,
		currentPage: 1,
		loading: true,
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
			const { currentPage = 1, hasNextPage = false, data = [] } = docsFilesList || {};
			const newDocs = currentPage === 1 ? [...data] : [...info?.docs, ...(data || [])];
			handleStateUpdate({ docs: newDocs, currentPage, hasNextPage, loading: false });
		}
	}, [docsFilesList]);

	useEffect(() => {
		fetchDocs({ page: 1 });
	}, []);

	const handleStateUpdate = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const fetchDocs = async ({ page = 1, limit = 20 }) => {
		try {
			const payload = {
				filters: {
					limit,
					page,
				},
			};
			await getDocsFilesList(payload, false);
		} catch (error) {
			console.error('Error fetching docs:', error);
		}
	};

	const fetchMore = () => {
		if (!info?.hasNextPage) return;
		fetchDocs({ page: info?.currentPage + 1 });
	};

	return info?.loading ? (
		<div className="spinner-container">
			<Spinner />
		</div>
	) : (
		<InfiniteScroll
			dataLength={info?.docs?.length}
			next={fetchMore}
			hasMore={info?.hasNextPage}
			height={'100%'}
		>
			<div className={`card-container`}>
				<div className="card-item" onClick={handleCreateDoc}>
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
						onClick={() => navigate(`/doc/${doc?._id}`)}
					>
						<div className="card-item-style content-wrapper docs">
							<div className="docs-preview"></div>
							<DocsStatusButton
								content={statusTextmapper?.[doc?.status]?.text}
								style={statusTextmapper?.[doc?.status]?.style}
								dotStyle={statusTextmapper?.[doc?.status]?.dotStyle}
							/>
							<div className="docs-title-wrapper">
								<span className="docs-item-title">{doc?.title}</span>
								<span className="docs-item-sub-title">
									{moment.unix(doc?.createdAt).fromNow()}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</InfiniteScroll>
	);
};

export default memo(DocsGrid);
