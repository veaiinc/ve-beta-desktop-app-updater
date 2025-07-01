// import React, { Component } from 'react';
import { withRouter } from '../../services/withRouter';
// import ProposalImage from '../../assets/svg/samples/1.png';
// import InvoiceImage from '../../assets/svg/samples/2.png';
// import ContractImage from '../../assets/svg/samples/3.png';
// import ThankyouImage from '../../assets/svg/samples/4.png';
import { ReactComponent as Loader } from '../../assets/svg/generate-loader.svg';
import { ReactComponent as Preview } from '../../assets/svg/preview.svg';
import { ReactComponent as Shuffle } from '../../assets/svg/shuffle.svg';
import '../../assets/scss/generate.scss';
import { gql, useMutation } from '@apollo/client';
import Proposals from '../../controllers/proposals';
import ManagePages from '../components/managePages';
import GenerateModule from '../components/generate/module';
import ManageBlocks from '../components/manageBlocks';
// import ManageTheme from '../components/manageTheme';
import _ from 'lodash';
const query = gql`
	query Query($getDetailedTemplateInfoId: ID!) {
		getDetailedTemplateInfo(id: $getDetailedTemplateInfoId)
	}
`;
const updateModules = gql`
	mutation UpdateWorkflowTemplate($templateId: ID!, $updateObj: TemplateUpdateObj!) {
		updateWorkflowTemplate(templateId: $templateId, updateObj: $updateObj) {
			_id
		}
	}
`;
const duplicateWorkflowQuery = gql`
	mutation DuplicateWorkflowTemplate($templateId: ID!, $title: String!) {
		duplicateWorkflowTemplate(templateId: $templateId, title: $title) {
			_id
		}
	}
`;
class Generate extends Proposals {
	constructor() {
		super();
		this.state = {
			step: 3,
			animatingSpans: {},
			showModuleCards: true,
			showCardFull: false,
			showBottomBar: false,
			showRightSidebar: false,
			modules: [],
			isLoading: true,
			variables: {},
			tenantLogo: null,
			activeModule: null,

			activeModuleKey: 0,
			callApi: false,
			sections: [],
			workflowDuplicateID: null,
			isPromptLoading: true,
			duplicateModules: [],
		};
	}

	changeStep = (e) => {
		this.setState(
			{
				step: e,
			},
			() => {
				if (this.state.step == 2) {
					setTimeout(() => {
						this.animateImages();
					}, 100);

					// Small delay to ensure CSS transition works
				} else if (this.state.step == 1) {
					setTimeout(() => {
						this.setState({ showBottomBar: true, showRightSidebar: true });
					}, 100);
				}
			},
		);
	};

	componentDidMount = async () => {
		this.setState({
			step: 1,
			showBottomBar: true,
			showRightSidebar: true,
		});
		if (localStorage.getItem('prompt') && localStorage.getItem('title')) {
			await this.duplicateWorkflow(
				duplicateWorkflowQuery,
				{
					templateId: this.props.params.templateID,
					title: localStorage.getItem('title'),
				},
				query,
			);
			if (this.state.workflowDuplicateID !== null) {
				async () => {
					// 	let prompt = localStorage.getItem('prompt');
					// 	if(prompt){
					// await this.generateTemplate({ user_prompt: prompt, page_type: 'proposal' });
					// 	}
				};
			}
		} else {
			await this.getWorkflowInfo(query);
		}
		await this.getVariables();
	};
	// componentDidUpdate = (prevProps, prevState) => {
	// 	if (this.state.step !== prevState.state && this.state.step == 2) {
	// 		this.setState({
	// 			activeModule: this.state.modules[0],
	// 		});
	// 	}
	// };
	animateImages = () => {
		let arr = [];
		_.map(this.state.modules, (module, k) => {
			arr.push(module._id);
		});
		const imageTypes = arr;
		imageTypes.forEach((type) => this.animateImage(type));

		// Remove module-cards div after a short delay and show card-full
		setTimeout(() => {
			this.setState({ showModuleCards: false });
			setTimeout(() => {
				this.setState({ showCardFull: true });
			}, 50); // Small delay to ensure CSS transition works
		}, 100);
	};

	animateImage = (type) => {
		const fromElement = document.getElementById(`${type}-from`);
		const toElement = document.getElementById(`${type}-to`);

		if (fromElement && toElement) {
			const fromRect = fromElement.getBoundingClientRect();
			const toRect = toElement.getBoundingClientRect();

			const clone = fromElement.cloneNode(true);
			clone.id = `clone-${type}-${Date.now()}`; // Unique ID for the clone
			clone.style.position = 'fixed';
			clone.style.left = `${fromRect.left}px`;
			clone.style.top = `${fromRect.top}px`;
			clone.style.width = `${fromRect.width}px`;
			clone.style.height = `${fromRect.height}px`;
			clone.style.transition = 'all 1s cubic-bezier(0.25, 0.1, 0.25, 1)';
			clone.style.zIndex = '1000';
			clone.style.borderRadius = '12px';
			clone.style.opacity = '1';
			clone.style.transform = 'scale(1)';
			// Ensure the module-class div is styled correctly
			const moduleClassDiv = clone.querySelector('.module-class');
			if (moduleClassDiv) {
				moduleClassDiv.style.width = '100%';
				moduleClassDiv.style.height = '100%';
				moduleClassDiv.style.borderRadius = '12px';
				moduleClassDiv.style.overflow = 'hidden';
				moduleClassDiv.style.zoom = `${0.1} !important`;
			}

			document.body.appendChild(clone);

			// Force a reflow before starting the animation
			void clone.offsetWidth;

			requestAnimationFrame(() => {
				clone.style.left = `${toRect.left}px`;
				clone.style.top = `${toRect.top}px`;
				clone.style.width = `${toRect.width}px`;
				clone.style.height = `${toRect.height}px`;
				clone.style.opacity = '0.8';
				clone.style.transform = 'scale(1)';
				clone.style.borderRadius = '12px';
			});

			const handleTransitionEnd = () => {
				if (document.body.contains(clone)) {
					document.body.removeChild(clone);
				}
				toElement.innerHTML = fromElement.innerHTML;
				this.setState((prevState) => ({
					animatingSpans: {
						...prevState.animatingSpans,
						[`${type}-from`]: true,
					},
				}));
				clone.removeEventListener('transitionend', handleTransitionEnd);
			};

			clone.addEventListener('transitionend', handleTransitionEnd);

			// Fallback: remove the clone after a set time if the transition doesn't fire
			setTimeout(() => {
				if (document.body.contains(clone)) {
					document.body.removeChild(clone);
					handleTransitionEnd();
				}
			}, 1000); // Adjust this time as needed, should be longer than your transition
		}
	};
	onDragEnd = (result) => {
		if (!result.destination || result.destination.index === result.source.index) {
			return; // Return early if there's no destination or the item wasn't moved
		}

		const items = Array.from(this.state.modules);

		const [reorderedItem] = items.splice(result.source.index, 1);

		const proposalIndex = items.findIndex((item) => item.module === 'proposal');
		const thankyouIndex = items.findIndex(
			(item) => item.module === 'thankyou' && item.isPublic === false,
		);

		// Prevent moving 'contract' or 'invoice' above 'proposal'
		if (
			(reorderedItem.module === 'contract' || reorderedItem.module === 'invoice') &&
			result.destination.index <= proposalIndex
		) {
			return;
		}
		if (result.destination.index > thankyouIndex) {
			return;
		}

		// Move the item to its new position
		items.splice(result.destination.index, 0, reorderedItem);

		// Update the order if it has changed
		const updatedItems = items.map((item, index) => ({
			...item,
			order: index + 1,
		}));

		this.setState(
			{
				duplicateModules: updatedItems,

				modules: [...updatedItems]
					.filter((module) => module.hide !== true) // Exclude modules where hide is explicitly false
					.sort((a, b) => {
						return a.isPublic === b.isPublic ? 0 : a.isPublic ? -1 : 1;
					}),
			},
			async () => {
				await this.updateModules(updateModules, {
					templateId: this.props.params.templateID,
					updateObj: {
						moduleTemplates: updatedItems,
					},
				});
			},
		);
	};
	putModules = (e) => {
		this.setState(
			{
				duplicateModules: e,
				modules: [...e]
					.filter((module) => module.hide !== true)
					.sort((a, b) => {
						return a.isPublic === b.isPublic ? 0 : a.isPublic ? -1 : 1;
					}),
			},
			async () => {
				await this.updateModules(updateModules, {
					templateId: this.props.params.templateID,
					updateObj: {
						moduleTemplates: e,
					},
				});
			},
		);
	};

	handleChangeSections = async (e, moduleId) => {
		this.setState({
			callApi: false,
			sections: e,
		});
		let json = {
			sections: e,
		};
		await this.putSections(json, moduleId, true, true);
	};
	render() {
		return (
			<div className="generate-canvas-wrapper">
				{this.state.isLoading ? (
					localStorage.getItem('title') ? (
						<div className="generate-wrapper">
							<div className="generate-container">
								<div className="gw-top">
									<h1>Generate</h1>
									<h5>What would you like to create today?</h5>
								</div>
								<div className="gw-input">
									<textarea value={localStorage.getItem('prompt')} />

									<label>
										<Loader />
									</label>
								</div>
								<div
									className="gw-prompt"
									style={{ opacity: this.state.workflowLoading ? 0 : 1 }}
								>
									<div className="gwp-line"></div>
									<h5>Prompts</h5>
								</div>
								<div
									className="gw-prompts-cards"
									style={{ opacity: this.state.workflowLoading ? 0 : 1 }}
								>
									<a>
										<Preview />
										Create a wedding sale proposal which should have team, award
										section , portfolio
									</a>
									<a>
										<Preview />
										Create a wedding sale proposal which should have team, award
										section , portfolio
									</a>
									<a>
										<Preview />
										Create a wedding sale proposal which should have team, award
										section , portfolio
									</a>
									<a>
										<Preview />
										Create a wedding sale proposal which should have team, award
										section , portfolio
									</a>
								</div>
								<div
									className="shuffle-btn"
									style={{ opacity: this.state.workflowLoading ? 0 : 1 }}
								>
									<a>
										<Shuffle /> Shuffle
									</a>
								</div>
							</div>
						</div>
					) : (
						''
					)
				) : (
					<div className="generate-canvas-wrapper">
						{this.state.step !== 0 ? (
							<div className="generate-canvas">
								{this.state.step == 2 || this.state.step == 3 ? (
									<div className="gc-left-sidebar">
										{_.map(this.state.modules, (module, k) => {
											if (module.hide == true) {
												return '';
											} else {
												return (
													<a
														className={`${
															this.state.activeModuleKey == k
																? 'active-module'
																: ''
														}`}
													>
														{module.module}
														<span
															id={`${module._id}-to`}
															onClick={() =>
																this.setState({
																	activeModuleKey: k,
																})
															}
															style={{ cursor: 'pointer' }}
															className={`module-small-thumb `}
														>
															<GenerateModule
																moduleId={module._id}
																module={module.module}
																variables={this.state.variables}
																previewType={'d'}
																tenantLogo={this.state.tenantLogo}
																zoom={0.6}
																callApi={this.state.callApi}
															/>
														</span>
													</a>
												);
											}
										})}
									</div>
								) : (
									''
								)}
								<div className="gc-center-canvas">
									<div className="gc-center-canvas-inner">
										{this.state.step == 1 ? (
											<div className="manage-pages">
												<ManagePages
													modules={this.state.duplicateModules}
													onDragEnd={(e) => this.onDragEnd(e)}
													putModules={(e) => this.putModules(e)}
												/>
											</div>
										) : (
											''
										)}
										{/* <h5
											style={{
												marginLeft: this.state.step == 1 ? 141 : '',
											}}
										>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit.
										</h5> */}

										{/* {this.state.showModuleCards ? (
											<div
												className="module-cards"
												style={{
													marginLeft: this.state.step == 1 ? 68 : -68,
												}}
											>
												{_.map(this.state.modules, (module, k) => {
													return (
														<div className="card">
															<h3>{module.module}</h3>
															<h6>
																Lorem ipsum dolor sit amet,
																consectetur adipiscing elit.
															</h6>
															<span
																id={`${module._id}-from`}
																style={{
																	opacity: this.state
																		.animatingSpans[
																		`${module._id}-from`
																	]
																		? 0
																		: 1,
																}}
															>
																<GenerateModule
																	moduleId={module._id}
																	module={module.module}
																	variables={this.state.variables}
																	previewType={'d'}
																	tenantLogo={
																		this.state.tenantLogo
																	}
																	zoom={0.6}
																	callApi={this.state.callApi}
																/>
															</span>
														</div>
													);
												})}
											</div>
										) : (
											''
										)} */}
										{this.state.step == 2 || this.state.step == 3 ? (
											<>
												<div
													className={`card-full ${
														this.state.showCardFull ? 'show' : ''
													}`}
													style={{
														height: 'calc(100vh - 164px - 80px - 21px)',
														overflowY: 'scroll',
													}}
												>
													<GenerateModule
														moduleId={
															this.state.modules[
																this.state.activeModuleKey
															]._id
														}
														module={
															this.state.modules[
																this.state.activeModuleKey
															].module
														}
														variables={this.state.variables}
														previewType="d"
														tenantLogo={this.state.tenantLogo}
														zoom={0.6}
														callApi={this.state.callApi}
													/>
												</div>
											</>
										) : (
											''
										)}
									</div>
								</div>
								{this.state.step !== 1 ? (
									<div
										className={`gc-right-sidebar ${
											this.state.showRightSidebar ? 'show' : ''
										}`}
									>
										{this.state.step == 1 ? (
											''
										) : this.state.step == 2 ? (
											<ManageBlocks
												activeModule={
													this.state.modules[this.state.activeModuleKey]
												}
												changeSections={(e, moduleId) =>
													this.handleChangeSections(e, moduleId)
												}
												sections={this.state.sections}
											/>
										) : (
											''
										)}
									</div>
								) : (
									''
								)}
							</div>
						) : (
							''
						)}
						<div
							className={`generate-bottom-bar ${
								this.state.showBottomBar ? 'show' : ''
							}`}
						>
							{this.state.step !== 1 ? (
								<a
									className="prev-btn"
									onClick={async (e) =>
										this.state.step !== 1
											? this.changeStep(this.state.step - 1)
											: ''
									}
								>
									Back
								</a>
							) : (
								''
							)}
							<div className="steps">
								<div className="progress-bar">
									<div
										className="pb"
										style={{
											width:
												this.state.step == 1
													? '50%'
													: this.state.step == 2
													? '100%'
													: this.state.step == 0
													? '0%'
													: '100%',
										}}
									></div>
								</div>
								<div className="steps-info">
									<span>Smart Files</span>
									<span>Outline & Theme</span>
								</div>
							</div>
							<a
								className="nxt-btn"
								onClick={async (e) =>
									this.state.isPromptLoading
										? ''
										: this.state.step == 2
										? this.props.navigate(
												`/${this.props.params.templateID}?aiGenerated=true`,
										  )
										: this.changeStep(this.state.step + 1)
								}
							>
								{this.state.isPromptLoading
									? 'Generating...'
									: this.state.step !== 2
									? 'Next'
									: 'Build'}
							</a>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default withRouter(Generate);
