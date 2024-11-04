import { memo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from 'react-loading-skeleton';
import { ReactComponent as HollowCircleBlue } from '../../../../assets/svg/Settings/hollow-circle-blue.svg';
import '../../../../assets/scss/settings/aiSetupPage.scss';
// import Template from './tempImg.png';
// import { ReactComponent as LinkWhite } from '../../../../assets/svg/Settings/link-white-color.svg';

const Workflows = ({ info, hideRemove = false, allowWorkflowsSelection = false }) => {
	const [selectedWorkflows, setSelectedWorkflows] = useState([]);

	const handleWorkflowSelection = (e, workflow) => {
		if (e?.target?.checked) {
			setSelectedWorkflows((prevSelectedWorkflows) => [
				...prevSelectedWorkflows,
				workflow?._id,
			]);
		} else {
			setSelectedWorkflows((prevSelectedWorkflows) =>
				prevSelectedWorkflows?.filter((id) => id !== workflow?._id),
			);
		}
	};

	return info?.workflows ? (
		<InfiniteScroll
			className="workflows-infinite-scroll"
			dataLength={info?.workflows?.length || 0}
			height={310}
		>
			{info?.workflows &&
				info?.workflows?.map(
					(workflow) =>
						workflow?.tenantId !== null && (
							<div key={workflow?._id} className="templates-container">
								<div className="template-preview-and-details-container">
									{allowWorkflowsSelection && (
										<div className="workflow-selection-checkbox">
											<input
												onChange={(e) =>
													handleWorkflowSelection(e, workflow)
												}
												type="checkbox"
											/>
										</div>
									)}
									<div className="template-preview">
										<iframe
											src={
												window.location.hostname === 'localhost'
													? `http://localhost:3000/preview/${workflow?._id}?module=${workflow?.moduleTemplates?.[0]?._id}&isPubic=${workflow?.moduleTemplates?.[0]?.isPublic}&restrictClick=true`
													: `https://builder.ve.ai/preview/${workflow?._id}?module=${workflow?.moduleTemplates?.[0]?._id}&isPubic=${workflow?.moduleTemplates?.[0]?.isPublic}&restrictClick=true`
											}
											title="Builder Preview"
											style={{ zoom: 0.3 }}
										/>
									</div>
									<div className="template-details">
										<h1 className="template-name">{workflow?.title}</h1>
										<ul>
											{workflow?.moduleTemplates?.map((moduleInfo) => {
												return (
													<li>
														<HollowCircleBlue />
														<span>{moduleInfo?.module}</span>
													</li>
												);
											})}
										</ul>
										{/* <div className="default-knowledge-container">
													<p>Default Knowledge: </p>
													<div className="default-knowledge-link-container">
														<LinkWhite />
														<p>Smart File</p>
													</div>
												</div> */}
									</div>
								</div>
								{!hideRemove && <div className="template-remove">Remove</div>}
							</div>
						),
				)}
		</InfiniteScroll>
	) : (
		<Skeleton width={'100%'} height={'292px'} />
	);
};

export default memo(Workflows);
