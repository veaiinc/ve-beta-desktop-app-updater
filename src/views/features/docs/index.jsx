import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/docs/index.scss';
import { ReactComponent as Files } from '../../../assets/svg/docs/files.svg';
import { fetchOriginSelection } from '../../../helpers';
import { ReactComponent as UpArrow } from '../../../assets/svg/workflow/downArrow.svg';
import FilesListView from './FilesListView';
import Context from '../../../context/context';
import moment from 'moment';
let origin = fetchOriginSelection();
const Docs = () => {
	let {
		templates: {
			getMyWorkflows,
			myWorkflows,
			myMoreWorkflows,
			salePageRefresh,
			updateStateValues,
			generatePublicLinkData,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		loading: true,
		myWorkflowData: null,
		hasNextPage: false,
		currentPage: 1,
		myWorkflowModal: false,
		activeTemplateData: null,
		activeCardsData: null,
		copyModal: false,
		showGeneratedLinkModalData: null,
		testingDrawerModal: false,
		shownInitialLoader: localStorage.getItem('showInitialLoader'),
		currentWorkspaceId: null,
		pendingCopyAction: null,
		copyLink: null,
	});

	useEffect(() => {
		getMyWorkflowTemplatesData(1);
	}, []);

	useEffect(() => {
		setInfo((prev) => ({ ...prev, myWorkflowData: myWorkflows?.data }));
	}, [myWorkflows]);

	const getMyWorkflowTemplatesData = useCallback((page, fetchMore = false) => {
		const payload = {
			filters: {
				limit: 10,
				page: page,
				type: 'workspace',
				status: 'published',
				sortBy: 'createdAt',
				sortType: -1,
			},
		};
		getMyWorkflows(payload, fetchMore);
	}, []);

	const onGenerateAIFunc = () => {
		window.location.href = `${origin}/generate`;
	};
	return (
		<div className="docsParentContainer">
			<div className="docsParentHeaderContainer">
				<div className="docsHeaderButtons colorful" onClick={onGenerateAIFunc}>
					<div className="docsHeaderButtonsTitle">Create proposal from your template</div>
					<div className="docsHeaderSubButtonsSubTitleColored">Start with AI</div>
				</div>
				<div className="docsHeaderButtons">
					{' '}
					<div className="docsHeaderButtonsTitle">Create proposal from your template</div>
					<div className="docsHeaderSubButtonsSubTitle">
						Pick your template from your playbook
					</div>
				</div>
				<div className="docsHeaderButtons">
					{' '}
					<div className="docsHeaderButtonsTitle">Create proposal from your template</div>
					<div className="docsHeaderSubButtonsSubTitle">
						Upload your files, our AI will generate tailored proposal for you
					</div>
				</div>
			</div>
			<div className="docsTemplatesContainer">
				<div className="docsTemplatesContainerHeader">
					Create new file from your existing templates
					<div className="docsTemplatesAllFilesContainer">
						<Files />
						All files
					</div>
				</div>

				<div className="docsTemplateContainer">
					{info?.myWorkflowData?.map((workflow, index) => (
						<div key={index} className="docsTemplateCard">
							<div className="docsTemplateImageContainer">
								<div className="docsTemplateHoverContentContainer">
									<div className="docsHoverArrowContainer">
										<UpArrow />
									</div>
									<div className="docsHoverOptionsContainer">
										<span className="docsHoverOptionsStyling">Create File</span>
										<span
											className="docsHoverOptionsStyling"
											onClick={() =>
												(window.location.href = `${origin}/${workflow?._id} `)
											}
										>
											Edit Design
										</span>
										<span className="docsHoverOptionsStyling">Duplicate</span>
										<span className="docsHoverOptionsStyling">Delete</span>
									</div>
								</div>
								<div className="coverImage">
									<iframe
										src={`${origin}/preview/${workflow?._id}?module=${workflow?.moduleTemplates?.[0]?._id}&isPubic=${workflow?.moduleTemplates?.[0]?.isPublic}&restrictClick=true`}
										title="Builder Preview"
										width="100%"
										height="100%"
										style={{ zoom: 0.3 }}
									/>
								</div>
							</div>
							<div className="docsFooterContent">
								<span className="docsFooterContentTitle">{workflow?.title}</span>
								<span className="docsFooterContentSubTitle">created 14 files</span>
								<span className="docsFooterContentHoverContainer">
									<span className="docsFooterContentHoverCreatedAt">
										Created on{' '}
										{moment.unix(workflow?.createdAt).format('DD MMM YYYY')}
									</span>
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="docsFooterContainer">
				<FilesListView />
			</div>
		</div>
	);
};

export default memo(Docs);
