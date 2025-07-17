import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactComponent as Question } from '../../../assets/svg/question.svg';
import { ReactComponent as RightMark } from '../../../assets/svg/rightMark.svg';
import { ReactComponent as Lock } from '../../../assets/svg/lock.svg';
import { ReactComponent as Edit } from '../../../assets/svg/edit.svg';
import _ from 'lodash';
export default class ManagePages extends Component {
	constructor(props) {
		super();
		this.state = {
			modules: props?.modules,
			activeModule: null,
		};
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.modules !== nextProps.modules) {
			this.setState({
				modules: nextProps.modules,
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
			this.props.putModules(arr);
		});
	};
	handleSlideToggle = (module, checked) => {
		let modules = [...this.state.modules];
		let arr = _.map(modules, (module, k) => {
			if (module.module === 'proposal') {
				module.showAsSlide = checked;
			} else {
				module.showAsSlide = false;
			}
			return module;
		});
		this.setState({ modules: arr }, () => {
			this.props.putModules(arr);
		});
	};
	render() {
		return (
			<div className="managePages">
				<div className="pagesContainer">
					<b className="heading">Add Pages to Your Smart File</b>
					<p className="title">
						Choose pages for your smart file that align with your business needs
					</p>
					<div className="modules">
						<div className="pageHeading">
							<p>Public</p>
							{/* <Question /> */}
						</div>
						{this.state.modules.map((module, index) => (
							<div style={{ color: 'white' }}>
								{module.isPublic && (
									<>
										<div className="moduleContainer">
											<div className="module">
												<div
													className={`rightIcon ${
														module.hide ? 'hide' : ''
													}`}
													onClick={() =>
														this.handleModuleVisibility(
															this.state.modules,
															module._id,
														)
													}
												>
													<RightMark />
												</div>
												<p
													className="title"
													onMouseLeave={() =>
														this.setState({ activeModule: null })
													}
												>
													{this.state.activeModule === module._id ? (
														<input
															type="text"
															value={module.label}
															onChange={(e) =>
																this.handleModuleNameChange(
																	e,
																	module._id,
																)
															}
														/>
													) : (
														module.label
													)}
													<span
														style={{ cursor: 'pointer', width: 6 }}
														onClick={() =>
															this.setState({
																activeModule: module._id,
															})
														}
													>
														<Edit />
													</span>
												</p>{' '}
											</div>
											{module.module === 'form' && (
												<p>
													<Lock />
												</p>
											)}
										</div>
										<div className="line"></div>
									</>
								)}
							</div>
						))}
					</div>
					<div className="modules">
						<div className="pageHeading">
							<p>Private</p>
							{/* <Question /> */}
						</div>

						<DragDropContext onDragEnd={(e) => this.props.onDragEnd(e)}>
							<Droppable droppableId="modules">
								{(provided) => (
									<div {...provided.droppableProps} ref={provided.innerRef}>
										{this.state.modules.map(
											(module, index) =>
												!module.isPublic && (
													<Draggable
														key={module._id}
														draggableId={module._id}
														index={index}
														isDragDisabled={this.isDragDisabled(module)}
													>
														{(provided) => (
															<div
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																style={{
																	color: 'white',

																	...provided.draggableProps
																		.style,
																}}
															>
																<div
																	className="moduleContainer"
																	style={{
																		cursor: this.isDragDisabled(
																			module,
																		)
																			? 'not-allowed'
																			: 'grab',
																	}}
																>
																	<div className="module">
																		<div
																			className={`rightIcon ${
																				module.hide
																					? 'hide'
																					: ''
																			}`}
																			onClick={() =>
																				this.handleModuleVisibility(
																					this.state
																						.modules,
																					module._id,
																				)
																			}
																		>
																			<RightMark />
																		</div>
																		<p
																			className="title"
																			onMouseLeave={() =>
																				this.setState({
																					activeModule:
																						null,
																				})
																			}
																		>
																			{this.state
																				.activeModule ===
																			module._id ? (
																				<input
																					type="text"
																					value={
																						module.label
																					}
																					onChange={(e) =>
																						this.handleModuleNameChange(
																							e,
																							module._id,
																						)
																					}
																				/>
																			) : (
																				module.label
																			)}
																			<span
																				style={{
																					cursor: 'pointer',
																					width: 6,
																				}}
																				onClick={() =>
																					this.setState({
																						activeModule:
																							module._id,
																					})
																				}
																			>
																				<Edit />
																			</span>
																		</p>
																	</div>
																	{module?.module ===
																		'proposal' && (
																		<>
																			<div className="toggle-slide">
																				<span className="toggle-label">
																					Show as slide
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
																		</>
																	)}
																	{module.module ===
																		'proposal' && (
																		<p>
																			<Lock />
																		</p>
																	)}
																</div>
																<div className="line"></div>
															</div>
														)}
													</Draggable>
												),
										)}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</DragDropContext>
					</div>
				</div>
			</div>
		);
	}
}
