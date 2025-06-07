import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactComponent as Question } from '../../../assets/svg/question.svg';
import { ReactComponent as RightMark } from '../../../assets/svg/rightMark.svg';
import { gql, useMutation } from '@apollo/client';
import Proposals from '../../../controllers/proposals';
import ManageTheme from '../manageTheme';
import _ from 'lodash';
const moduleQuery = gql`
	query Query($getModuleTemplateId: ID!, $module: String) {
		getModuleTemplate(id: $getModuleTemplateId, module: $module)
	}
`;
export default class ManageBlocks extends Proposals {
	constructor(props) {
		super();
		this.state = {
			activeModule: props?.activeModule,
			isLoading: true,
			activeTab: 1,
		};
	}

	componentDidMount = async () => {
		await this.getModuleTemplate(moduleQuery, {
			getModuleTemplateId: this.state?.activeModule?._id,
			module: this.state?.activeModule?.module,
		});
		if (this.state?.activeModule?.module === 'proposal') {
			this.setState({ activeTab: 1 });
		} else {
			this.setState({ activeTab: 2 });
		}
	};
	componentWillReceiveProps = (nextProps) => {
		if (this.state.activeModule !== nextProps.activeModule) {
			this.setState(
				{
					activeModule: nextProps.activeModule,
				},
				async () => {
					await this.getModuleTemplate(moduleQuery, {
						getModuleTemplateId: this.state?.activeModule?._id,
						module: this.state?.activeModule?.module,
					});
				},
			);
		}
	};
	isDragDisabled = (module) => {
		return false;
	};
	onDragEnd = (result) => {
		if (!result.destination || result.destination.index === result.source.index) {
			return; // Return early if there's no destination or the item wasn't moved
		}

		const items = Array.from(this.state.sections);

		const [reorderedItem] = items.splice(result.source.index, 1);

		// Move the item to its new position
		items.splice(result.destination.index, 0, reorderedItem);

		// Update the order if it has changed
		const updatedItems = items.map((item, index) => ({
			...item,
			order: index + 1,
		}));

		this.setState({ sections: updatedItems }, () => {
			this.props.changeSections(updatedItems, this.state?.activeModule?._id);
		});
	};
	render() {
		return (
			<div className="managePages">
				{this.state.isLoading ? (
					''
				) : (
					<div className="pagesContainer">
						<b>Prompt for {this.state.activeModule?.module}</b>
						<p className="prompt">
							{localStorage.getItem('prompt')
								? localStorage.getItem('prompt')
								: 'Add your prompt here'}
						</p>

						<a className="tabs">
							{this.state.activeModule?.module === 'proposal' ? (
								<span
									className={this.state.activeTab == 1 ? 'active' : ''}
									onClick={() => this.setState({ activeTab: 1 })}
								>
									Outline
								</span>
							) : (
								''
							)}
							<span
								onClick={() => this.setState({ activeTab: 2 })}
								className={this.state.activeTab == 2 ? 'active' : ''}
							>
								Theme
							</span>
						</a>
						{this.state.activeTab == 1 ? (
							<div
								className="modules"
								style={{ maxHeight: 500, overflowY: 'scroll' }}
							>
								{this.state.activeModule?.module === 'proposal' ? (
									<DragDropContext onDragEnd={(e) => this.onDragEnd(e)}>
										<Droppable droppableId="modules">
											{(provided) => (
												<div
													{...provided.droppableProps}
													ref={provided.innerRef}
												>
													{this.state.sections.map((module, index) => (
														<Draggable
															key={module._id}
															draggableId={module._id}
															index={index}
															isDragDisabled={this.isDragDisabled(
																module,
															)}
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
																				className="rightIcon"
																				onClick={(e) =>
																					this.setDisplay(
																						e,
																						module._id,
																					)
																				}
																			>
																				<RightMark />
																			</div>
																			<p>
																				{_.has(
																					module,
																					'title',
																				)
																					? module.title
																					: module.type}
																			</p>
																		</div>
																	</div>
																	<div className="line"></div>
																</div>
															)}
														</Draggable>
													))}
													{provided.placeholder}
												</div>
											)}
										</Droppable>
									</DragDropContext>
								) : (
									''
								)}
							</div>
						) : (
							<ManageTheme
								activeModule={this.props.activeModule}
								changeSections={(e, moduleId) =>
									this.props.changeSections(e, moduleId)
								}
								sections={this.props.sections}
							/>
						)}
					</div>
				)}
			</div>
		);
	}
}
