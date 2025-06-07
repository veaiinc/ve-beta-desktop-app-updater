import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactComponent as Back } from '../../../assets/svg/back.svg';
import { ReactComponent as Folder } from '../../../assets/svg/folder.svg';
import { ReactComponent as Folders } from '../../../assets/svg/folders.svg';
import { ReactComponent as PageIcon } from '../library/svgs/Pages/PageIcon.svg';
import { ReactComponent as Drag } from '../library/svgs/Pages/Drag.svg';
import { ReactComponent as EditPop } from '../library/svgs/Pages/EditPop.svg';
import { ReactComponent as EditModule } from '../library/svgs/Pages/EditModule.svg';
import { ReactComponent as DuplicateModule } from '../library/svgs/Pages/DuplicateModule.svg';
import { ReactComponent as DeleteModule } from '../library/svgs/Pages/DeleteModule.svg';
import { ReactComponent as GotoPage } from '../library/svgs/Pages/GotoPage.svg';
import { ReactComponent as Page } from '../library/svgs/Pages/Page.svg';
import { ReactComponent as AI } from '../library/svgs/Pages/AI.svg';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Switch } from 'antd/lib';
import _ from 'lodash';

let hostNameMapper = {
	localhost: 'localhost',
	've.ai': 've.ai',
	've.co': 've.co',
	'www.ve.co': 've.co',
	'www.ve.ai': 've.ai',
	'builder.ve.co': 've.co',
	'builder.ve.ai': 've.ai',
	'www.builder.ve.co': 've.co',
	'www.builder.ve.ai': 've.ai',
};

export default class ManagePages extends Component {
	constructor(props) {
		super();
		this.state = {
			modules: props?.modules,
			activeModule: null,
			step: 1,
			templateList: props?.templateList,
			activeTemplateData: {},
			editPop: true,
			activeModulePop: null,
			debounceTime: null,
			activeModuleId: props?.activeModuleId,
			editActiveModule: false,
			showNavbar: false,
			section: props?.section,
			isRenameEdit: false,
		};
		this.editPopRef = React.createRef();
		this.isRenameEditRef = React.createRef();
	}
	handleClickOutside = (event) => {
		if (this.editPopRef.current && !this.editPopRef.current.contains(event.target)) {
			this.setState({ editPop: false, activeModulePop: null });
		}
		if (this.isRenameEditRef.current && !this.isRenameEditRef.current.contains(event.target)) {
			this.setState({ editActiveModule: false });
		}
	};
	componentWillReceiveProps = (nextProps) => {
		if (this.state.modules !== nextProps.modules) {
			this.setState({
				modules: nextProps.modules,
			});
		}
		if (this.state.templateList !== nextProps.templateList) {
			this.setState({
				templateList: nextProps.templateList,
			});
		}
		if (this.state.activeModuleId !== nextProps.activeModuleId) {
			this.setState({
				activeModuleId: nextProps.activeModuleId,
			});
		}
		if (this.state.section !== nextProps.section) {
			this.setState({
				section: nextProps.section,
			});
		}
	};
	isDragDisabled = (module) => {
		return module.module === 'proposal' || module.module === 'thankyou';
	};
	handleModuleVisibility = (modules, moduleId) => {
		const arr = [];

		_.map(modules, (module, k) => {
			if (module._id === moduleId) {
				module.hide = module.hide ? !module.hide : true;
			}
			arr.push(module);
		});

		this.setState({ modules: arr }, () => {
			this.props.putModules(arr);
		});
	};
	handleModuleNameChange = (e, moduleId) => {
		let modules = [...this.state.modules];
		let arr = [];
		_.map(modules, (module, k) => {
			if (module._id === moduleId) {
				module.label = e.target.value;
			}
			arr.push(module);
		});
		this.setState({ modules: arr }, () => {
			this.debounceFuncForPage(() => {
				this.props.putModules(arr);
				this.setState({ isRenameEdit: false });
			}, 1000);
			// this.props.putModules(arr);
		});
	};
	debounceFuncForPage = (func, timeout = 800) => {
		if (this.state.debounceTime) {
			clearTimeout(this.state.debounceTime);
		}
		const timeFunction = setTimeout(() => {
			func();
		}, timeout);
		this.setState({
			debounceTime: timeFunction,
		});
	};
	handleAddPage = (e) => {
		this.setState({
			step: this.state.step + 1,
		});
		// this.props.addPage(e);
		this.props.getTemplateList(e, 1);
	};
	handleTemplatePages = (template) => {
		this.setState({
			step: this.state.step + 1,
			activeTemplateData: template,
		});
	};
	handleAddNewPage = (module) => {
		this.setState({
			step: 1,
		});
		this.clearState();
		this.props.addPage(module);
	};
	fetchOrigin = () => {
		const hostname = window.location.hostname;
		return hostNameMapper?.[hostname];
	};
	fetchMoreTemplates = () => {
		this.props.getTemplateList(null, this.state.templateList.data.currentPage + 1);
	};
	clearState = () => {
		this.setState({
			templateList: [],
		});
	};

	componentDidMount = () => {
		document.addEventListener('mousedown', this.handleClickOutside);
	};
	componentWillUnmount = () => {
		document.removeEventListener('mousedown', this.handleClickOutside);
	};

	handleSlideToggle = (module, checked) => {
		let modules = [...this.state.modules];
		let arr = _.map(modules, (Module, k) => {
			if (module._id === Module._id) {
				Module.showAsSlide = checked;
			}
			return Module;
		});
		this.setState({ modules: arr }, () => {
			this.props.putModules(arr);
		});
	};
	handleDeleteModule = (module) => {
		if (this.state.activeModuleId === module._id) {
			if (module.order <= 1) {
				this.props.getModuleInfo(this.state.modules[1]._id, this.state.modules[1].module);
			} else {
				this.props.getModuleInfo(
					this.state.modules[module.order - 2]._id,
					this.state.modules[module.order - 2].module,
				);
			}
		}
		this.props.deleteModule(module._id);
	};
	handlePageType = (e) => {
		this.setState(
			{
				editActiveModule: true,
			},
			() => {
				this.props.handlePageType(true);
			},
		);
		this.setState(
			{
				editActiveModule: true,
			},
			() => {
				this.props.handlePageType(true);
			},
		);
	};

	render() {
		const templates = this.state?.templateList?.data || [];
		return (
			<div className="managePages" style={{ padding: 24 }}>
				{this.state.step !== 1 && (
					<div className="backContainer">
						<Back
							className="backButton"
							onClick={() => this.setState({ step: this.state.step - 1 })}
						/>
					</div>
				)}
				{this.state.step === 1 && (
					<>
						<div className="pagesContainer">
							<div className="modules">
								<div className="navigation">
									<div className="navigation-heading">Navigation</div>

									<DragDropContext onDragEnd={(e) => this.props.onDragEnd(e)}>
										<Droppable droppableId="managepagesmodules">
											{(provided) => (
												<div
													{...provided.droppableProps}
													ref={provided.innerRef}
												>
													{this.state.modules.map((module, index) => (
														<Draggable
															key={module._id}
															draggableId={module._id}
															index={index}
															// isDragDisabled={this.isDragDisabled(module)}
														>
															{(provided) => (
																<div
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	style={{
																		color: 'white',
																	}}
																>
																	<div
																		className={`moduleContainer ${
																			this.state.editPop &&
																			this.state
																				.activeModulePop ===
																				module._id
																				? 'editActiveModule'
																				: ''
																		}`}
																		style={{
																			cursor: 'default',
																			...provided
																				.draggableProps
																				.style,
																			maxWidth: '300px',
																		}}
																	>
																		<div
																			{...provided.dragHandleProps}
																			style={{
																				cursor: 'grab',
																			}}
																		>
																			<Drag />
																		</div>
																		<div
																			className={`module ${
																				this.props
																					?.activeModuleId ===
																				module._id
																					? 'activeModule'
																					: ''
																			}`}
																			onClick={(e) => {
																				e.stopPropagation();

																				if (
																					!this.state
																						.isRenameEdit
																				) {
																					if (
																						this.props
																							.activeModuleId !==
																						module._id
																					) {
																						this.props.getModuleInfo(
																							module._id,
																							module.module,
																						);
																					}
																				}
																			}}
																		>
																			<div
																				className={`rightIconL`}
																			>
																				<Page />
																			</div>

																			<div className="module-name">
																				<p
																					className="title title-icons"
																					onMouseLeave={() =>
																						this.setState(
																							{
																								activeModule:
																									null,
																							},
																						)
																					}
																				>
																					{this.state
																						.activeModule ===
																					module._id ? (
																						<input
																							ref={
																								this
																									.isRenameEditRef
																							}
																							className="moduleNameInput"
																							type="text"
																							value={
																								module.label
																							}
																							onChange={(
																								e,
																							) =>
																								this.handleModuleNameChange(
																									e,
																									module._id,
																								)
																							}
																						/>
																					) : (
																						module.label ||
																						'Blank Page'
																					)}
																				</p>
																			</div>
																			<div
																				className="gotoPage"
																				onClick={(e) => {
																					e.stopPropagation();
																					this.handlePageType();
																				}}
																			>
																				<div className="gotoPageIcon">
																					<GotoPage />
																				</div>
																				<div className="gopageTooltip">
																					Edit page layout
																					here
																				</div>
																			</div>
																		</div>

																		<div
																			style={{
																				cursor: 'pointer',
																				display: 'flex',
																				alignItems:
																					'center',
																				justifyContent:
																					'center',
																			}}
																			onClick={() => {
																				this.setState({
																					editPop: true,
																					activeModulePop:
																						module._id,
																				});
																			}}
																		>
																			<EditPop />
																		</div>
																		{this.state.editPop &&
																			this.state
																				.activeModulePop ===
																				module._id && (
																				<div
																					className="editPopMenu"
																					ref={
																						this
																							.editPopRef
																					}
																				>
																					<div
																						className="editPopItem"
																						onClick={() =>
																							this.setState(
																								{
																									activeModule:
																										module._id,
																									isRenameEdit: true,
																								},
																							)
																						}
																					>
																						<EditModule />
																						<span>
																							Rename
																						</span>
																					</div>
																					{_.has(
																						this.props
																							.template,
																						'version',
																					) && (
																						<div
																							className="editPopItem"
																							onClick={() =>
																								this.props.copyModule(
																									module._id,
																									module.order,
																								)
																							}
																						>
																							<DuplicateModule />
																							<span>
																								Duplicate
																							</span>
																						</div>
																					)}
																					{this.state
																						?.modules
																						?.length >
																						1 &&
																						_.has(
																							this
																								.props
																								.template,
																							'version',
																						) && (
																							<div
																								className="editPopItem"
																								onClick={() =>
																									this.handleDeleteModule(
																										module,
																									)
																								}
																							>
																								<DeleteModule />
																								<span>
																									Delete
																								</span>
																							</div>
																						)}
																					{(module?.module ==
																						'proposal' ||
																						module?.module ==
																							'*') && (
																						<div
																							className="editPopItem"
																							onClick={() =>
																								this.setState(
																									{
																										activeModule:
																											module._id,
																										// editPop: false,
																									},
																								)
																							}
																						>
																							<div className="toggle-slide">
																								<span className="toggle-label">
																									Show
																									as
																									slide
																								</span>
																								<label className="switch">
																									<input
																										type="checkbox"
																										checked={
																											module?.showAsSlide
																										}
																										onChange={(
																											e,
																										) =>
																											this.handleSlideToggle(
																												module,
																												e
																													.target
																													.checked,
																											)
																										}
																									/>
																									<span className="slider-round round"></span>
																								</label>
																							</div>
																						</div>
																					)}
																				</div>
																			)}
																	</div>
																</div>
															)}
														</Draggable>
													))}
													{provided.placeholder}
												</div>
											)}
										</Droppable>
									</DragDropContext>
								</div>
							</div>

							<div className="divider"></div>
							{this.props.section && (
								<div className="toggle-navbar">
									<b
										style={{
											textTransform: 'capitalize',
											fontSize: '14px',
											fontWeight: '500',
										}}
									>
										Show Navbar
									</b>

									<Switch
										checked={this.props.section?.style?.navigationBar || false}
										onChange={() => {
											this.props?.handleShowNavbar();
										}}
									/>
								</div>
							)}

							<div className="addPageContainerDiv">
								<div
									onClick={() => this.props.handleAddBlankPage()}
									className="addBlankPage"
								>
									Add blank page
								</div>
								{_.has(this.props.template, 'version') && (
									<div
										style={{ cursor: 'pointer' }}
										onClick={(e) => this.handleAddPage(e)}
										className="addBlankPage"
									>
										Add pages from Template
									</div>
								)}
								{/* <div className="addBlankPage">
									<AI />
									Create page with AI
								</div> */}
							</div>
						</div>
					</>
				)}
				{this.state.step === 2 && (
					<InfiniteScroll
						dataLength={templates?.data?.length || 0}
						next={this.fetchMoreTemplates}
						hasMore={this.state?.templateList?.data?.hasNextPage}
						loader={<h4>Loading...</h4>}
						endMessage={
							<p style={{ textAlign: 'center' }}>
								<b>No more templates</b>
							</p>
						}
						height="80vh"
						className="addPageContainer"
					>
						{templates?.data?.map((template, index) => (
							<div
								key={index}
								className="templateContainer"
								onClick={() => this.handleTemplatePages(template)}
								style={{ backgroundColor: '#202123', borderRadius: '10px' }}
							>
								{/* <div className="templatePreview">
									<iframe
										src={`https://builder.${this.fetchOrigin()}/preview/${
											template?._id
										}?module=${
											this.props.isWorkflow
												? template?.modules?.[0]?._id
												: template?.moduleTemplates?.[0]?._id
										}&isPubic=false&restrictClick=true`}
										title="Builder Preview"
										width="100%"
										height="100%"
										style={{ zoom: 0.1 }}
									/>
								</div> */}
								<div className="templateDetails">
									<div className="templateHeading">
										<p className="title">{template.title}</p>
									</div>
									<div className="templateInfo">
										<div className="templatePages">
											<div>
												{template?.[
													`${
														this.props.isWorkflow
															? 'modules'
															: 'moduleTemplates'
													}`
												]?.length > 1 ? (
													<Folders />
												) : (
													<Folder />
												)}
											</div>
											<div className="templatePagesList">
												<p>
													{template?.[
														`${
															this.props.isWorkflow
																? 'modules'
																: 'moduleTemplates'
														}`
													]?.map((module, index) =>
														index ===
														template[
															`${
																this.props.isWorkflow
																	? 'modules'
																	: 'moduleTemplates'
															}`
														].length -
															1
															? module.label
															: module.label + ',',
													)}
												</p>
											</div>
										</div>
										<p className="numberOfPages">
											{
												template?.[
													`${
														this.props.isWorkflow
															? 'modules'
															: 'moduleTemplates'
													}`
												]?.length
											}{' '}
											{template?.[
												`${
													this.props.isWorkflow
														? 'modules'
														: 'moduleTemplates'
												}`
											]?.length > 1
												? 'pages'
												: 'page'}
										</p>
									</div>
								</div>
							</div>
						))}
					</InfiniteScroll>
				)}
				{this.state.step === 3 && (
					<div className="templatePagesContainer">
						{this.state.activeTemplateData?.[
							`${this.props.isWorkflow ? 'modules' : 'moduleTemplates'}`
						]?.map((module, index) => (
							<div key={index} className="templatePage">
								{/* <div className="templatePagePreview">
									<iframe
										src={`https://builder.${this.fetchOrigin()}/preview/${
											this.state.activeTemplateData._id
										}?module=${module._id}&isPubic=false&restrictClick=true`}
										title="Builder Preview"
										width="100%"
										height="100%"
										style={{ zoom: 0.3 }}
									/>
								</div> */}
								<div className="templatePageHeading">
									<p>{module.label}</p>
								</div>
								<div
									className="templatePageOverlay"
									onClick={() => this.handleAddNewPage(module)}
								></div>
							</div>
						))}
						<div className="addPageButton">+ Add Page</div>
					</div>
				)}
			</div>
		);
	}
}
