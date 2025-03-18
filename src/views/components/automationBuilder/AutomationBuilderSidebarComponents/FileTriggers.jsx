import { useMemo, memo, useState, useCallback, useEffect, useContext } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/fileTriggers.scss';
import ActionDetailsBlock from './ActionDetailsBlock';
import HeaderComponent from './HeaderComponent';
import Context from '../../../../context/context';
import { message } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../../helpers';

const FileTriggers = ({
	onClose,
	onSave,
	addTriggerLoading,
	triggerData,
	activeStepsData = null,
}) => {
	const {
		templates: {
			getMyWorkflows,
			myWorkflows,
			myMoreWorkflows,
			specificTemplatesInfo,
			getSpecificTemplatesInfo,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		title: '',
		description: '',
		actionType: '',
		previousStepId: '',
		workflowTemplates: [],
		loading: false,
		currentPage: 1,
		hasNextPage: false,
		selectedTemplate: null,
		chooseFromTemplate: false,
	});

	useEffect(() => {
		if (activeStepsData) {
			setInfo((prev) => ({
				...prev,
				title: activeStepsData?.title,
				description: activeStepsData?.description,
			}));
			getSpecificTemplatesInfo({
				templateInfoId: activeStepsData?.inputBody?.fileId,
			});
		}
	}, [activeStepsData]);

	useEffect(() => {
		getMyWorkflowTemplatesData(1);
	}, []);

	useEffect(() => {
		if (specificTemplatesInfo && activeStepsData) {
			setInfo((prev) => ({
				...prev,
				selectedTemplate: specificTemplatesInfo,
			}));
		}
	}, [specificTemplatesInfo]);

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
				version: 1,
				sortType: -1,
			},
		};

		getMyWorkflows(payload, fetchMore);
	}, []);

	const customSaveFn = useCallback(() => {
		if (!info?.selectedTemplate) {
			message.error('Please select a template');
			return;
		}

		if (!info?.title?.trim()) {
			message.error('Please enter a title');
			return;
		}

		if (!info?.description?.trim()) {
			message.error('Please enter a description');
			return;
		}

		onSave({
			title: info?.title?.trim(),
			description: info?.description?.trim(),
			app: 'inApp',
			type: 'trigger',
			triggerType: 'database',
			inApp: {
				module: 'createFile',
				event: triggerData?.event,
				workflowTemplateId: info?.selectedTemplate?._id,
			},
		});
	}, [onSave, info?.selectedTemplate, info?.title, info?.description, triggerData?.event]);

	// const onChangeButtonClick = useCallback(() => {
	// 	if (activeStepsData) {
	// 		handleChangeClick(activeStepsData?.app);
	// 	} else {
	// 		onBack();
	// 	}
	// }, [handleChangeClick, activeStepsData, onBack]);

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

	const updateInfo = useCallback((data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

	return (
		<div className="fileTriggerContainer">
			<HeaderComponent
				heading={`File ${triggerData?.event}d`}
				onBack={() => {
					if (info?.chooseFromTemplate) {
						updateInfo({ chooseFromTemplate: false });
					} else {
						onClose();
					}
				}}
			/>
			{info?.chooseFromTemplate ? (
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
						{info?.workflowTemplates?.length > 0 ? (
							info?.workflowTemplates?.map((template, index) => (
								<div
									className={`chooseFromTemplateFormContainer ${
										info?.selectedTemplate?._id === template?._id
											? 'selected'
											: ''
									}`}
									key={index}
									onClick={() =>
										updateInfo({
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
							))
						) : (
							<div className="noTemplatesContainer">
								<p>No templates found</p>
							</div>
						)}
					</InfiniteScroll>
				</div>
			) : (
				<>
					<ActionDetailsBlock
						actionLabel={`File ${triggerData?.event}d`}
						heading="Triggers"
						title={info?.title}
						description={info?.description}
						updaterFn={updateInfo}
						onChangeButtonClick={onClose}
						showChangeButton={activeStepsData ? false : true}
					/>
					<div className="createFileFormSelectionBlockContainer">
						{info?.selectedTemplate ? (
							<div className="selectedTemplateWrapper">
								<div
									className="chooseFromTemplateFormContainer"
									onClick={() => updateInfo({ chooseFromTemplate: true })}
								>
									<div className="templatePreview"></div>
									<div className="templateDetails">
										<h2 className="templateName">
											{info?.selectedTemplate?.title}
										</h2>
										<p className="templateDescription">
											{info?.selectedTemplate?.description || 'Enquiry Form'}
										</p>
									</div>
									<button
										className="changeButton"
										onClick={() => updateInfo({ chooseFromTemplate: true })}
									>
										Change
									</button>
								</div>
							</div>
						) : (
							<>
								<button
									className="formSelectionBlockButton"
									onClick={() => updateInfo({ chooseFromTemplate: true })}
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
					</div>
					<div className="triggerSaveButtonContainer">
						<button
							className="triggerSaveButton"
							onClick={customSaveFn}
							disabled={addTriggerLoading}
						>
							{addTriggerLoading ? 'Saving...' : 'Save'}
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default FileTriggers;
