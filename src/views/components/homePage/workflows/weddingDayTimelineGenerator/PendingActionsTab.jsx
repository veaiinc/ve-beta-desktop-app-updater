import React, { useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import '../../../../../assets/scss/home_page/workflows/weddingDayTimelineGenerator.scss';
import { ReactComponent as CheckIcon } from '../../../../../assets/svg/home_page/Check.svg';
import Context from '../../../../../context/context';
import { FetchMoreLoaderComp } from '../../../../../helpers';
const PendingActionsTab = () => {
	const {
		templates: { requiredActions, getRequiredActions },
	} = useContext(Context);

	const [info, setInfo] = useState({
		page: 1,
	});

	useEffect(() => {
		getRequiredActions({
			filters: {
				page: 1,
				limit: 10,
			},
			resetRequiredActions: true,
		});
	}, []);

	const fetchMoreRequiredActions = () => {
		const nextPage = info?.page + 1;
		if (requiredActions?.hasMore) {
			getRequiredActions({
				filters: {
					page: nextPage,
					limit: 10,
				},
				resetRequiredActions: false,
			});

			setInfo((prev) => ({
				...prev,
				page: nextPage,
			}));
		}
	};
	console.log(requiredActions);

	return (
		<>
			<div
				style={{
					flex: 1,
					overflowY: 'auto',
					maxHeight: '100%',
					height: '100%',
					width: '100%',
				}}
				id="pendingActions"
			>
				<InfiniteScroll
					next={fetchMoreRequiredActions}
					hasMore={requiredActions?.hasMore}
					dataLength={requiredActions?.actions?.length || 0}
					loader={<FetchMoreLoaderComp />}
					scrollableTarget={'pendingActions'}
				>
					<div className="workflow-container">
						{requiredActions?.actions?.map((pendingAction) => {
							return (
								<div className="workflow-inner-card">
									<span className="left-text">{pendingAction?.action}</span>
									<span className="right-text">
										<CheckIcon />
									</span>
								</div>
							);
						})}
					</div>
				</InfiniteScroll>
			</div>
		</>
	);
};

export default PendingActionsTab;
