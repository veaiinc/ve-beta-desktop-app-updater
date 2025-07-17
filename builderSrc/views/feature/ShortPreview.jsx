import React, { Component, createRef } from 'react';
import { gql, useMutation } from '@apollo/client';
import NewProposals from '../../controllers/newProposals';
import { withRouter } from '../../services/withRouter';
import Builder from '../components/library/builder';
import _ from 'lodash';
import '../../assets/scss/home.scss';
import { message } from 'antd';

const query = gql`
	query Query($getDetailedTemplateInfoId: ID!) {
		getDetailedTemplateInfo(id: $getDetailedTemplateInfoId)
	}
`;

const moduleQuery = gql`
	query Query($getModuleTemplateId: ID!, $module: String) {
		getModuleTemplate(id: $getModuleTemplateId, module: $module)
	}
`;

const moduleWorkflowQuery = gql`
	query Query($getModuleTemplateId: ID!, $module: String) {
		getWorkflowModule(id: $getModuleTemplateId, module: $module)
	}
`;

const loadingTexts = [
	'Believe in the process',
	'Your digital vision is coming to life',
	'Control what you can',
	'Hang tight! Crafting your digital masterpiece',
	'Creativity is intelligence having fun',
	'Your vision is our mission',
];

class ShortBuilderPreview extends NewProposals {
	constructor(props) {
		super(props);
		this.state = {
			showRemovableText: true,
			spanText: 'Remove this text',
			showSideBar: false,
			client: true,
			preview: true,
			isAllModulesLoading: true,
			previewType: this?.props?.editingWorflow ? 'd' : 'm',
			isLoading: true,
			activeModuleId: this.props.params.templateID,
			previewModuleSections: [],
			isPublicModule: false,
			iframeSendMessage: false,
			displayModules: '',
			isWorkflow: false,
			restrictClick: false,
			moduleType: '',
			singleTemplatePreview: false,
			showSmartFileSidebar: this.props.showSmartFileSideBar || false,
			customDomain: '',
			currencySymbol: '',
			updateClient: false,
			clientListArray: [],
			isSubmit: false,
			isClientVariable: false,
			activeBlockIdToScroll: null,
			clientDetails: {},
			fetchAgain: null,
			endUrl: '',
			expiresAt: '',
			customExpiryDate: '',
			mobileViewLocked: false,
		};
		this.parentRef = createRef();
		this.updateClientRef = createRef();

		this.listenerCheckInterval = null;

		this.originalConsoleLog = console.log;
		// console.log = (...args) => {
		// 	this.originalConsoleLog.apply(console, args);
		// 	window.parent.postMessage(
		// 		{
		// 			type: 'CONSOLE_LOG',
		// 			message: args
		// 				.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : arg))
		// 				.join(' '),
		// 		},
		// 		window.location.hostname === 'localhost'
		// 			? 'http://localhost:8000'
		// 			: 'https://www.ve.ai',
		// 	);
		// };
	}

	stringToBoolean = (str) => {
		try {
			return JSON.parse(str?.toLowerCase());
		} catch (e) {
			return false;
		}
	};

	componentDidMount = async () => {
		// await this.getWorkflowInfo(query, true);

		window.addEventListener('message', this.handleMessage);

		this.startListenerCheck();
		// await this.getWorkflowWithModules(workflowQueryWithModules, {
		// 	getWorkflowWithModulesId: this.props.params.templateID,
		// });

		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);

		const module = urlParams?.get('module') || this.state.displayModules;
		const isPublic =
			this.stringToBoolean(urlParams?.get('isPublic')) || this.state.isPublicModule;
		const restrictClick = urlParams?.get('restrictClick') || this.state.restrictClick;
		const moduleType = urlParams?.get('moduleType') || this.state.moduleType;
		const singleTemplatePreview = urlParams?.get('singleTemplatePreview')?.length
			? true
			: false;
		this.setState({
			displayModules: urlParams?.get('moduleType') ? this.props.params.templateID : module,
			isPublicModule: isPublic,
			restrictClick,
			moduleType,
		});

		const workflow = urlParams?.get('workflow') || this.state.isWorkflow;
		this.setState(
			{
				isPublicModule: isPublic,
				isWorkflow: workflow,
			},
			async () => {
				await this.getWorkflowInfo(query, true, null, false);
			},
		);
	};

	componentDidUpdate(prevProps, prevState) {
		const previewSize = _.size(this.state.previewModuleSections);
		const filteredModulesSize = _.size(
			_.filter(this.state.modules, {
				isPublic: this.state.isPublicModule,
			}),
		);

		if (previewSize === filteredModulesSize) {
			this.sendIframeReadyMessage();
		}

		if (prevState.isLoading && !this.state.isLoading) {
			this.attachClickListeners();
		}
	}

	componentWillUnmount() {
		window.removeEventListener('message', this.handleMessage);
		document.removeEventListener('mousedown', this.handleClickOutside);
		console.log = this.originalConsoleLog;
		this.stopListenerCheck();
	}
	handleClickOutside = (e) => {
		if (this.updateClientRef.current && !this.updateClientRef.current.contains(e.target)) {
			this.setState({
				updateClient: false,
			});
		}
	};

	startListenerCheck = () => {
		this.listenerCheckInterval = setInterval(this.attachClickListeners, 1000); // Check every second
	};

	stopListenerCheck = () => {
		if (this.listenerCheckInterval) {
			clearInterval(this.listenerCheckInterval);
		}
	};

	attachClickListeners = () => {
		if (this.parentRef.current) {
			const elements = this.parentRef.current.querySelectorAll(
				'span[id], input[id], span[data-id], input[data-id]',
			);
			elements.forEach((element) => {
				if (!element.hasAttribute('listener-attached')) {
					element.addEventListener('click', this.handleElementClick);
					element.setAttribute('listener-attached', 'true');
				}
			});
		} else {
		}
	};

	handleElementClick = (event) => {
		let id;
		if (event.target.tagName?.toLowerCase() === 'span') {
			id = event.target.id;
		} else if (event.target.tagName?.toLowerCase() === 'input') {
			id = event.target.getAttribute('data-id');
		}

		if (id) {
			this.handleSpanClick(id);
		} else {
			console.log('No valid id found for clicked element');
		}
	};

	handleSpanClick = (id) => {
		let origin =
			window.location.hostname === 'localhost'
				? 'http://localhost:8000'
				: 'https://www.ve.ai';

		window.parent.postMessage(
			{
				type: 'SPAN_CLICKED',
				id: id,
			},
			origin,
		);

		if (this.props?.editingWorflow) {
			this.setState({ activeBlockIdToScroll: id });
		}
	};

	getAllModules = async () => {
		this.setState({ isLoading: true });

		_.map(this.state.modules?.slice(0, 1), async (module, key) => {
			if (
				(module.isPublic === this.state.isPublicModule &&
					this.state.displayModules === '') ||
				this.state.displayModules === module._id
			) {
				if (this.state.isWorkflow)
					this.getWorkflowModuleTemplate(
						moduleWorkflowQuery,
						{
							getModuleTemplateId: module._id,
							module: module.module,
						},
						module._id,
						module.order,
					);
				else
					this.getModuleTemplate(
						moduleQuery,
						{
							getModuleTemplateId: module._id,
							module: module.module,
						},
						module._id,
						module.order,
					);
			}
		});
	};

	getRandomText(array) {
		const randomIndex = Math.floor(Math.random() * array.length);
		return array[randomIndex];
	}

	sendIframeReadyMessage() {
		if (!this.state.iframeSendMessage) {
			let origin =
				window.location.hostname === 'localhost'
					? 'http://localhost:8000'
					: 'https://www.ve.ai';

			window.parent.postMessage(
				{
					type: 'IFRAME_READY',
					id: 'IFRAME_READY',
				},
				origin,
			);
			this.setState({ iframeSendMessage: true });
		}
	}

	render() {
		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<div
					className="home_wrapper"
					ref={this.parentRef}
					style={{
						pointerEvents: this.state?.restrictClick === 'true' ? 'none' : '',

						...(this.props?.homeWrapperStyle || {}),
						width: this.state?.showSmartFileSidebar ? '60%' : '100%',
						transition: 'width 0.3s ease-in-out',
					}}
				>
					{(_.size(this.state.previewModuleSections) ===
						_.size(
							_.filter(this.state.modules, {
								isPublic: this.state.isPublicModule,
							}),
						) &&
						this.state.displayModules === '') ||
					(this.state.displayModules !== '' &&
						_.size(this.state.previewModuleSections) === 1) ||
					this.state.moduleType !== '' ||
					this.state?.singleTemplatePreview ||
					this.state?.isWorkflow ? (
						_.map(
							_.sortBy(this.state.previewModuleSections, ['order']),
							(module, key) => {
								if (
									this.state.displayModules === '' ||
									this.state.displayModules === module.id
								) {
									return (
										<div key={key} className="hwb_container">
											<div
												className={`hwb_wrapper hwb_wrapper_no_padding`}
												style={{
													display: 'flex',
													justifyContent: 'center',
												}}
											>
												<div
													className={`hwb_left ${
														(this.state.preview &&
															(this.state.previewType === 'm' ||
																this.state.previewType === 'ml')) ||
														this.state.previewMode === 'm' ||
														this.state.previewMode === 'ml'
															? 'hwb_left-mobile'
															: ''
													}`}
													style={{
														justifyContent:
															this.state.previewType === 'm' ||
															this.state.previewType === 'ml'
																? 'center'
																: '',
														width:
															this.state.previewType === 'm' ||
															this.state.previewType === 'ml'
																? '420px'
																: this.state?.activeModule
																		?.showType == 'a4' &&
																  this.state?.activeModule?.showAsA4
																? '780px'
																: '',
														boxShadow: this.state?.activeModule
															?.showAsA4
															? `
														-93px 163px 53px 0px rgba(0, 0, 0, 0),
														-59px 104px 48px 0px rgba(0, 0, 0, 0.01),
														-33px 59px 41px 0px rgba(0, 0, 0, 0.05),
														-15px 26px 30px 0px rgba(0, 0, 0, 0.09),
														-4px 7px 17px 0px rgba(0, 0, 0, 0.1)
													`
															: '',
													}}
												>
													<Builder
														clearFontStyles={() =>
															this.setState({
																justifycenter: false,
																justifyleft: false,
																justifyright: false,
																actionType: null,
																actionValue: null,
															})
														}
														module={module.module}
														client={this.state.client}
														deleteFQBlock={(blockID, sectionID) =>
															console.log()
														}
														handleOpenSideBar={(
															e,
															_id,
															service = false,
														) => {
															console.log();
														}}
														activeFontColor={this.state.activeFontColor}
														actionType={this.state.actionType}
														actionValue={this.state.actionValue}
														handleHSelection={(e, activeTextBlock) =>
															console.log()
														}
														crop={this.state.crop}
														zoom={this.state.zoom}
														sections={module.sections}
														activeSectionID={this.state.activeSectionID}
														activeTextBlock={this.state.activeTextBlock}
														handledeleteSection={(e) =>
															this.deleteSection(e)
														}
														handleSetSubBlockContent={(
															content,
															sectionID,
															blockID,
															id,
														) => console.log()}
														handleSetBlockContent={(
															content,
															sectionID,
															blockID,
														) => console.log()}
														preview={this.state.preview}
														previewType={this.state.previewType}
														handleActiveImage={(
															sectionID,
															blockID,
															subBlockID,
															imageURL,
														) => console.log()}
														setSections={(e) => this.setState(e)}
														setActiveTab={(
															e,
															subBlockID = null,
															blockID = null,
														) => {
															console.log();
														}}
														handleAddLayout={(
															workspaceId,
															json,
															templateID,
														) => console.log()}
														activeVariableID={
															this.state.activeVariableID
														}
														activeVariableName={
															this.state.activeVariableName
														}
														subBlockID={this.state.activeSubBlockID}
														handleAddServiceBlock={(
															e,
															order,
															services_style,
														) => console.log()}
														variables={module?.variables}
														tables={module?.tables || []}
														tablesValuesforClient={module?.tables || []}
														serviceSelect={(
															block,
															type,
															value,
															section,
														) => console.log()}
														contractActiveVariable={(e) =>
															this.setState({
																activeContractVariable: e,
																activeSubBlockType: 'v',
															})
														}
														setBlockTab={(e) =>
															this.setState({
																activeSubBlockType: 'b',
															})
														}
														addFormQuestion={(sectionID, blockOrder) =>
															console.log()
														}
														setActiveFormQuestion={(e, blockID) =>
															this.setState({
																activeSubBlockType: 'q',
																activeFormQuestion: blockID,
																showSideBar: this.state.preview
																	? false
																	: true,
															})
														}
														handleAddFormOption={(e) => console.log()}
														handleSetOpenNewtab={(e) => console.log()}
														tenantLogo={this.state.tenantLogo}
														setShape={(e) => console.log()}
														addEmptyLayout={(e) => console.log()}
														handleSetButtonLink={(e) => console.log()}
														setBtStyles={(e) => console.log()}
														btShape={(e) => console.log()}
														imgSettingData={(e) => console.log()}
														setTables={(e) => console.log()}
														selectBlock={(e) => console.log()}
														duplicateBlock={(e) =>
															this.handleDuplicate(e)
														}
														duplicateServiceBlock={(e, f, g) =>
															console.log()
														}
														activeSection={this.state.activeBlock}
														setActiveSection={(e, executeSave = true) =>
															console.log()
														}
														activeSubBlockId={
															this.state.activeSubBlockID
														}
														setServiceSubBlock={(e) => {
															console.log();
														}}
														deleteServiceBlock={(e, f) => console.log()}
														setServiceBlockContent={(e, f, g, h) =>
															console.log()
														}
														handleUpdateSectionData={(e) =>
															console.log()
														}
														headerSection={this.state.headerSection}
														isHeader={this.state.isHeader}
														formBgColor={this.state.formBgColor}
														addBlock={(
															showAddBlock,
															nextOrder,
															prevOrder,
															order,
														) => {
															console.log();
														}}
														setActiveTheme={this.state.activeTheme}
														isTheme={this.state?.isTheme}
														circleTextData={(e) =>
															this.setState({
																circleTextData: e,
															})
														}
														activeAnimation={this.state.activeAnimation}
														smartFilePreview={true}
														currencySymbol={this.state?.currencySymbol}
														handleSpanClick={this?.handleSpanClick}
														editingWorflow={
															this.props?.editingWorflow || false
														}
													/>
												</div>
											</div>
										</div>
									);
								}
							},
						)
					) : (
						<div className="hw_bottom">
							<div className="page_loading">
								<a>
									<span class="loader"></span>
									{this.getRandomText(loadingTexts)}
								</a>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default withRouter(ShortBuilderPreview);
