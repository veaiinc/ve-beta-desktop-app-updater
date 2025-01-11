import React, { memo, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchOriginSelection } from '../../../helpers';
let origin = fetchOriginSelection();

const TemplateCards = ({ data, loading, hasNextPage, fetchMoreMyWorkflows }) => {
	const [info, setInfo] = useState({
		workflowTemplates: data,
		loading: loading,
		hasNextPage: hasNextPage,
		showPreview: false,
	});

	useEffect(() => {
		setInfo({
			workflowTemplates: data,
			loading: loading,
			hasNextPage: hasNextPage,
			showPreview: false,
		});
	}, [data, loading, hasNextPage]);

	const handleTemplateClick = (template) => {
		console.log('template', template);
	};

	return (
		<>
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
							<div
								key={index}
								className="docsTemplateCard"
								onClick={() => handleTemplateClick(template)}
							>
								<div className="docsTemplateImageContainer">
									<iframe
										src={`${origin}/preview/${template?._id}?module=${template?.moduleTemplates?.[0]?._id}&isPubic=${template?.moduleTemplates?.[0]?.isPublic}&restrictClick=true`}
										title="Builder Preview"
										width="100%"
										height="100%"
										style={{ zoom: 0.3 }}
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
			{/* <Sidebar open={info?.showRightDrawer} openSendSmartFileModal={openSendSmartFileModal} /> */}
		</>
	);
};

export default memo(TemplateCards);
