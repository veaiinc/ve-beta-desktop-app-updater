import React, { useCallback, useContext, useEffect, useState } from 'react';
import Context from '../../../../context/context';
import { message } from 'antd';
import HeaderComponent from './HeaderComponent';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../../helpers';
import ActionDetailsBlock from './ActionDetailsBlock';

const FormResponseTrigger = ({ onClose, onSave, addTriggerLoading, triggerData }) => {
	const {
		templates: { getMyWorkflows, myWorkflows, myMoreWorkflows },
	} = useContext(Context);

	const [info, setInfo] = useState({
		chooseFromTemplate: false,
		workflowTemplates: [],
		currentPage: 1,
		hasNextPage: false,
		loading: true,
		selectedTemplate: null,
		title: '',
		description: '',
	});

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
				action: 'form-submission',
				version: 1,
			},
		};

		getMyWorkflows(payload, fetchMore);
	}, []);

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

	const fetchMoreMyWorkflows = useCallback(() => {
		getMyWorkflowTemplatesData(info?.currentPage + 1, true);
	}, [info?.hasNextPage, info?.currentPage]);

	const updateStateInfo = (updatedInfo) => {
		setInfo((prev) => ({ ...prev, ...updatedInfo }));
	};

	const getFormTemplateId = useCallback((template) => {
		if (template?.version) {
			return template?.moduleTemplates?.find((item) =>
				item?.actions?.includes('form-submission'),
			)?._id;
		} else {
			return template?.moduleTemplates?.find((item) => item?.module === 'form')?._id;
		}
	}, []);

	const customSaveFn = useCallback(() => {
		if (!info?.selectedTemplate) {
			message?.error('Please select a template');
			return;
		}
		if (!info?.title || !info?.description) {
			message?.error('Please enter title and description');
			return;
		}

		onSave({
			title: info?.title,
			description: info?.description,
			triggerType: triggerData?.triggerType,
			app: triggerData?.app,
			type: 'trigger',
			inApp: {
				event: triggerData?.event,
				module: triggerData?.module,
				workflowTemplateId: info?.selectedTemplate?._id,
				formTemplateId: getFormTemplateId(info?.selectedTemplate),
			},
		});
	}, [info?.selectedTemplate, info?.title, info?.description, triggerData, onSave]);

	return (
		<>
			<HeaderComponent
				onBack={() => {
					if (info?.chooseFromTemplate) {
						updateStateInfo({ chooseFromTemplate: false });
					} else {
						onClose();
					}
				}}
				heading={info?.chooseFromTemplate ? 'Choose from Template' : 'Form Submitted'}
			/>
			{info.chooseFromTemplate ? (
				<div className="chooseFromTemplateContainer">
					<InfiniteScroll
						dataLength={info?.workflowTemplates?.length || 0}
						next={fetchMoreMyWorkflows}
						hasMore={info?.hasNextPage}
						loader={<FetchMoreLoaderComp />}
						style={{
							display: 'flex',
							flexDirection: 'column',
							width: '100%',
						}}
						height="calc(100vh - 52px - 80px)"
					>
						{info?.workflowTemplates?.map((template, index) => (
							<div
								className={`chooseFromTemplateFormContainer ${
									info?.selectedTemplate?._id === template?._id ? 'selected' : ''
								}`}
								key={index}
								onClick={() =>
									updateStateInfo({
										selectedTemplate: template,
										chooseFromTemplate: false,
									})
								}
							>
								<div className="templatePreview"></div>
								<div className="templateDetails">
									<h2 className="templateName">{template?.title}</h2>
									<p className="templateDescription">
										{template?.description || 'Enquiry Form'}
									</p>
								</div>
							</div>
						))}
					</InfiniteScroll>
				</div>
			) : (
				<>
					<ActionDetailsBlock
						actionLabel={'Form Submitted'}
						heading={'Trigger'}
						description={info?.description}
						title={info?.title}
						updaterFn={(updatedData) => {
							updateStateInfo(updatedData);
						}}
					/>
					<div className="formSelectionBlockContainer">
						<h3 className="formSelectionBlockHeading">Select form</h3>
						{info?.selectedTemplate ? (
							<div className="selectedTemplateWrapper">
								<div
									className="chooseFromTemplateFormContainer"
									onClick={() => updateStateInfo({ chooseFromTemplate: true })}
								>
									<div className="templatePreview"></div>
									<div className="templateDetails">
										<h2 className="templateName">
											{info.selectedTemplate.title}
										</h2>
										<p className="templateDescription">
											{info.selectedTemplate.description || 'Enquiry Form'}
										</p>
									</div>
									<button
										className="changeButton"
										onClick={() =>
											updateStateInfo({ chooseFromTemplate: true })
										}
									>
										Change
									</button>
								</div>
							</div>
						) : (
							<>
								<button
									className="formSelectionBlockButton"
									onClick={() => updateStateInfo({ chooseFromTemplate: true })}
								>
									Choose from Template
								</button>
								<div className="formSelectionBlockButtonAiWrapper">
									<button className="formSelectionBlockButtonAi">
										<span>Generate with AI</span>
									</button>
								</div>
							</>
						)}
						<div className="triggerSaveButtonContainer">
							<button
								className="triggerSaveButton"
								onClick={customSaveFn}
								disabled={addTriggerLoading}
							>
								{addTriggerLoading ? 'Saving...' : 'Save'}
							</button>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default FormResponseTrigger;
