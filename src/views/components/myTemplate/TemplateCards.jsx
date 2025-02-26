import React, { memo, useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchOriginSelection } from '../../../helpers';
import SideBarPreview from './SideBarPreview';
import CreateFileLead from './CreateFileLead';
import { ReactComponent as OpenedEye } from '../../../assets/svg/my_templates/openedEye.svg';
import { ReactComponent as ThreeDots } from '../../../assets/svg/my_templates/verticalThreeDots.svg';
import DeleteWorkflowModal from '../../components/modalsV2/workflowBuilderModals/DeleteWorkflowModal';
import moment from 'moment';
import { Tooltip, message } from 'antd';
import Context from '../../../context/context';
let origin = fetchOriginSelection();

const TemplateCards = ({ data, loading, hasNextPage, fetchMoreMyWorkflows }) => {
	const navigate = useNavigate();
	const {
		templates: { deleteWorkflowTemplates, duplicateGlobalWorkflowTemplate, updateStateValues },
		activityInfo: { createSmartfile, smartfile },
	} = useContext(Context);
	const [info, setInfo] = useState({
		workflowTemplates: data,
		loading: loading,
		hasNextPage: hasNextPage,
		showPreview: false,
		templateData: null,
		showFileLeadModal: false,
		hoverIndex: null,
		showHoverActions: false,
		duplicateWorkflowModal: false,
		deleteWorkflowModal: false,
		deleteWorkflowLoader: false,
		hoverTemplateData: null,
		deleteTemplateData: null,
		previewTemplateData: null,
	});

	useEffect(() => {
		setInfo({
			workflowTemplates: data,
			loading: loading,
			hasNextPage: hasNextPage,
			showPreview: false,
			showFileLeadModal: false,
			deleteTemplateData: null,
		});
	}, [data, loading, hasNextPage]);

	useEffect(() => {
		if (smartfile?._id && info?.templateData?._id) {
			window.location.href = `${origin}/workflow/${smartfile?._id}?workflow=true&templateId=${info?.templateData?._id}`;
		}
	}, [smartfile]);

	const handleTemplateClick = (template) => {
		setInfo((prev) => ({ ...prev, showPreview: true, previewTemplateData: template }));
	};

	const openFileLeadModal = (template) => {
		setInfo((prev) => ({ ...prev, showFileLeadModal: true, templateData: template }));
	};

	const createFileFunc = async (template) => {
		setInfo((prev) => ({ ...prev, loading: true, templateData: template }));
		const payload = {
			smartFileInput: {
				templateId: template?._id,
				title: template?.title,
			},
		};
		await createSmartfile(payload);
		setInfo((prev) => ({ ...prev, loading: false }));
	};

	const createFileClick = (template) => {
		if (template?.version) {
			createFileFunc(template);
		} else {
			openFileLeadModal(template);
		}
	};

	const duplicateWorkflowFunc = useCallback(
		async (hoverTemplateData) => {
			if (!hoverTemplateData) {
				return;
			}
			const payload = {
				templateId: hoverTemplateData?._id,
				title: hoverTemplateData?.title,
			};
			const response = await duplicateGlobalWorkflowTemplate(payload);
			if (response?.[0]) {
				window.location.href = `${origin}/${response?.[1]?._id}`;
			}
		},
		[info?.hoverTemplateData],
	);

	const deleteWorkflowFunc = useCallback(async () => {
		if (!info?.deleteTemplateData) {
			return;
		}
		setInfo((prev) => ({ ...prev, deleteWorkflowLoader: true }));
		const payload = {
			deleteTemplateId: info?.deleteTemplateData?._id,
		};
		const resposne = await deleteWorkflowTemplates(payload);
		setInfo((prev) => ({
			...prev,
			deleteWorkflowModal: false,
			deleteWorkflowLoader: false,
		}));
		if (resposne?.[0]) {
			setInfo((prev) => ({ ...prev, deleteTemplateData: null }));
			updateStateValues({ templatesRefetch: true });
			return navigate('/my-templates');
		} else {
			message.error('Something went wrong,try again');
		}
	}, [info?.deleteTemplateData, info?.deleteWorkflowLoader]);

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
							// gap: '8px',
							rowGap: '50px',
							columnGap: '10px',
							width: '100%',
							overflowX: 'hidden',
						}}
						className="tetsing"
						height="calc(100vh - 340px)"
					>
						{info?.workflowTemplates?.map((template, index) => (
							<div
								key={index}
								className={`docsTemplateCard ${
									info?.hoverIndex === index ? 'hover' : ''
								}`}
								onClick={(e) => {
									e.stopPropagation();
									handleTemplateClick(template);
								}}
								onMouseEnter={() =>
									setInfo((prev) => ({
										...prev,
										hoverIndex: index,
										hoverTemplateData: template,
									}))
								}
								onMouseLeave={() =>
									setInfo((prev) => ({
										...prev,
										hoverIndex: null,
										hoverTemplateData: null,
									}))
								}
							>
								<div className="docsTemplateImageContainer">
									<iframe
										src={`${origin}/preview/${template?._id}?module=${template?.moduleTemplates?.[0]?._id}&isPubic=${template?.moduleTemplates?.[0]?.isPublic}&restrictClick=true`}
										title="Builder Preview"
										width="100%"
										height="100%"
										onClick={(e) => e.stopPropagation()}
										onMouseDown={(e) => e.stopPropagation()}
										onMouseUp={(e) => e.stopPropagation()}
										style={{
											zoom: 0.3,
											pointerEvents: 'none',
										}}
									/>
								</div>
								<div className="docsFooterContentContainer">
									<div className="docsFooterContent">
										<span
											className="docsFooterContentTitle"
											title={template?.title || 'Template Card'}
										>
											{template?.title || 'Template Card'}
										</span>
										<span className="docsFooterContentSubTitle">
											Created On:{' '}
											{template?.createdAt
												? moment
														.unix(template?.createdAt)
														.format('DD MMM YYYY')
												: ''}
										</span>
									</div>
									{info?.hoverIndex === index && (
										<div className="docsFooterContentActions">
											<OpenedEye
												onClick={(e) => {
													e.stopPropagation();
													handleTemplateClick(template);
												}}
											/>
											<Tooltip
												title={
													<div className="docsFooterContentActionsTooltip">
														<div
															className="docsFooterContentActionsTooltipItem"
															onClick={(e) => {
																duplicateWorkflowFunc(
																	info?.hoverTemplateData,
																);
																setInfo((prev) => ({
																	...prev,
																	duplicateWorkflowModal: true,
																}));
																e.stopPropagation();
															}}
														>
															Duplicate
														</div>
														<div
															className="docsFooterContentActionsTooltipItem"
															onClick={(e) => {
																setInfo((prev) => ({
																	...prev,
																	deleteWorkflowModal: true,
																	deleteTemplateData:
																		prev.hoverTemplateData,
																}));
																e.stopPropagation();
															}}
														>
															Delete
														</div>
													</div>
												}
												placement="bottom"
												arrow={false}
												trigger="hover"
												color="transparent"
											>
												<ThreeDots />
											</Tooltip>
										</div>
									)}
								</div>
							</div>
						))}
					</InfiniteScroll>
				)}
			</div>

			<SideBarPreview
				open={info?.showPreview}
				onClose={() => setInfo((prev) => ({ ...prev, showPreview: false }))}
				activeTemplate={info?.previewTemplateData}
				openFileLeadModal={openFileLeadModal}
			/>

			<CreateFileLead
				open={info?.showFileLeadModal}
				onClose={() => setInfo((prev) => ({ ...prev, showFileLeadModal: false }))}
				workflow={info?.previewTemplateData}
			/>
			<DeleteWorkflowModal
				modalIsOpen={info?.deleteWorkflowModal}
				closeModal={() => setInfo((prev) => ({ ...prev, deleteWorkflowModal: false }))}
				deleteWorkflowFunc={deleteWorkflowFunc}
				deleteLoader={info?.deleteWorkflowLoader}
			/>
		</>
	);
};

export default memo(TemplateCards);
