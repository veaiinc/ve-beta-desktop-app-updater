import React, { memo, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import InfiniteScroll from 'react-infinite-scroll-component';

const TemplateCards = ({ data, loading, hasNextPage, fetchMoreMyWorkflows }) => {
	const [info, setInfo] = useState({
		workflowTemplates: data,
		loading: loading,
		hasNextPage: hasNextPage,
	});

	useEffect(() => {
		setInfo({
			workflowTemplates: data,
			loading: loading,
			hasNextPage: hasNextPage,
		});
	}, [data, loading, hasNextPage]);

	return (
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
								<span className="docsFooterContentSubTitle">created 14 files</span>
							</div>
						</div>
					))}
				</InfiniteScroll>
			)}
		</div>
	);
};

export default memo(TemplateCards);
