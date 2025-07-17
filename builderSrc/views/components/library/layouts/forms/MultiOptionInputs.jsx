import React, { Component } from 'react';
import Edit from '../actions/edit.jsx';
import Deleted from '../actions/delete.jsx';
import _ from 'lodash';
import { RadioSVG, SelectDownSVG } from '../../../builder_client_common';

class MultiOptionInputs extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sections: props.sections,
			isDragging: false,
			actionType: props.actionType,
			actionValue: props.actionValue,
			preview: props.preview,
			previewType: props.previewType,
			setActiveTheme: props?.setActiveTheme,
			submitFormLoading: props?.submitFormLoading,
			isTheme: props?.isTheme,
			answer: props.answer ? props.answer : '',
			inputError: '',
			options: props.options ? props.options : [],
			showAddOption: false,
			emptyOption: '',
			editOption: false,
			editOptionKey: null,
			showSelectDown: false,
		};
		this.labelRefs = [];
		this.selectContainerRef = null;
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.sections !== nextProps.sections) {
			this.setState({
				sections: nextProps.sections,
			});
		}
		if (this.state.isTheme !== nextProps.isTheme) {
			this.setState({
				isTheme: nextProps.isTheme,
			});
		}
		if (this.state.setActiveTheme !== nextProps.setActiveTheme) {
			this.setState({
				setActiveTheme: nextProps.setActiveTheme,
			});
		}
		if (this.state.actionType !== nextProps.actionType) {
			this.setState({
				actionType: nextProps.actionType,
			});
		}
		if (this.state.activeTextBlock !== nextProps.activeTextBlock) {
			this.setState({
				activeTextBlock: nextProps.activeTextBlock,
			});
		}
		if (this.state.actionValue !== nextProps.actionValue) {
			this.setState({
				actionValue: nextProps.actionValue,
			});
		}
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
			});
		}
		if (this.state.previewType !== nextProps.previewType) {
			this.setState({
				previewType: nextProps.previewType,
			});
		}
		if (this.state.submitFormLoading !== nextProps.submitFormLoading) {
			this.setState({
				submitFormLoading: nextProps.submitFormLoading,
			});
		}
		if (this.state.answer !== nextProps.answer && nextProps.answer) {
			this.setState({
				answer: nextProps.answer,
			});
		}
		if (this.state.options !== nextProps.options) {
			this.setState({
				options: nextProps.options,
			});
		}
	};
	// componentDidMount = () => {
	// 	document.addEventListener('mousedown', this.handleClickOutside);
	// };

	// componentWillUnmount() {
	// 	document.removeEventListener('mousedown', this.handleClickOutside);
	// }
	handleClickOutside = (event) => {
		if (this.selectContainerRef && !this.selectContainerRef.contains(event.target)) {
			this.setState({ showSelectDown: false }); // Close the dropdown
		}
		if (this.blockRef?.current && !this.blockRef?.current?.contains(event.target)) {
			this.setState({
				showBlockActions: false,
			});
		}
		this.labelRefs.forEach((ref, index) => {
			if (ref && !ref.contains(event.target)) {
				this.setState({
					editOption: false,
					editOptionKey: null,
				});
			}
		});
	};

	setOpt = (e) => {
		this.setState(
			{
				showAddOption: false,
				emptyOption: '',
			},
			() => {
				this.props.addOptionForForm(e);
			},
		);
	};
	editOption = (e, k) => {
		e.stopPropagation();
		let options = [...this.state.options];
		let arr = [];
		_.map(options, (opt, key) => {
			if (key == k) {
				opt = e.target.value;
			}
			arr.push(opt);
		});
		this.setState(
			{
				options: arr,
			},
			() => {
				this.props?.setOptions(arr, true);
			},
		);
	};
	setHandleAnswer = (e, k) => {
		e.stopPropagation();
		let answerState = [`${k}`];
		this.setState(
			{
				answer: answerState,
				isSlideError: false,
				isErrorMessage: '',
				showSelectDown: false,
			},
			() => {
				this.props?.setAnswer(answerState);
			},
		);
	};

	handleDeleteOption = (e, k) => {
		e.stopPropagation();
		let options = [...this.state.options];
		let arr = [];
		_.map(options, (opt, key) => {
			if (key !== k) {
				arr.push(opt);
			}
		});
		this.setState(
			{
				options: arr,
			},
			() => {
				this.props.setOptions(arr);
			},
		);
	};
	handleEditOption = (e, k) => {
		e.stopPropagation();
		this.setState({
			editOption: true,
			editOptionKey: k,
		});
	};
	render() {
		return (
			<div className="multiOptionInputs">
				{this.props.type === 'singleChoice' ? (
					<>
						<div
							className="label"
							style={{
								color: this.state.isTheme
									? this.state.setActiveTheme?.fieldBorder
									: 'gray',
							}}
						>
							Choose one option
						</div>
						<div className="options radio-container">
							{_.map(this.state?.options, (option, k) => {
								return (
									<label
										class="radio-option-container"
										key={k}
										ref={(el) => (this.labelRefs[k] = el)}
									>
										{this.state?.editOption == true &&
										this.state?.editOptionKey == k ? (
											<div className="add-opt" style={{ height: 35 }}>
												<input
													value={option}
													onChange={(e) => this.editOption(e, k)}
													style={{ opacity: 1 }}
												/>
											</div>
										) : (
											<>
												<span
													className={
														this.state?.answer?.includes(option)
															? 'radio-span radio-span-active'
															: 'radio-span'
													}
													onClick={(e) => this.setHandleAnswer(e, option)}
												>
													<RadioSVG />
												</span>
												<span
													className="radio-span-text"
													style={{
														color: this.state.isTheme
															? this.state.setActiveTheme?.option
															: '#000',
													}}
												>
													{option}
												</span>

												{this.state.preview === false ? (
													<div className="edit-delete">
														<span>
															<a
																onClick={(e) =>
																	this.handleEditOption(e, k)
																}
															>
																<Edit />
															</a>
															<a
																onClick={(e) =>
																	this.handleDeleteOption(e, k)
																}
															>
																<Deleted />
															</a>
														</span>
													</div>
												) : (
													''
												)}
											</>
										)}
									</label>
								);
							})}
						</div>
					</>
				) : (
					<div className="select-container">
						<div
							className="select-input-container"
							ref={(el) => (this.selectContainerRef = el)}
							style={{
								backgroundColor: this.state?.isTheme
									? this?.state?.setActiveTheme?.fieldFill
									: '#fff',
								border: this.state.isTheme
									? ` 1px solid ${this?.state?.setActiveTheme?.fieldBorder}`
									: '#fff',
							}}
							onClick={(e) => {
								e.stopPropagation();
								this.setState({
									showSelectDown: !this.state?.showSelectDown,
								});
							}}
						>
							<span
								style={{
									color: this.state.isTheme
										? this.state.setActiveTheme?.option
										: 'gray',
								}}
							>
								{this.state.answer || 'select an option'}{' '}
							</span>
							<div
								className="select-down-svg"
								style={{ rotate: this.state.showSelectDown ? '180deg' : '0deg' }}
							>
								<SelectDownSVG />
							</div>
						</div>
						{this.state.showSelectDown && (
							<div
								className="select-option-container"
								style={{
									backgroundColor: this.state?.isTheme
										? this?.state?.setActiveTheme?.fieldFill
										: '#fff',
									border: this.state.isTheme
										? ` 1px solid ${this?.state?.setActiveTheme?.fieldBorder}`
										: '#fff',
								}}
							>
								{_.map(this.state?.options, (option, k) => {
									return (
										<div className="select-option-item" key={k}>
											{this.state?.editOption == true &&
											this.state?.editOptionKey == k ? (
												<div className="add-opt" style={{ height: 35 }}>
													<input
														value={option}
														onChange={(e) => this.editOption(e, k)}
														style={{ opacity: 1 }}
														onBlur={() =>
															this.setState({
																editOption: false,
																editOptionKey: null,
															})
														}
													/>
												</div>
											) : (
												<>
													<span
														onClick={(e) => {
															e.stopPropagation();
															this.setHandleAnswer(e, option);
														}}
														style={{
															cursor: 'pointer',
															width: '80%',
															color: this.state.isTheme
																? this.state.setActiveTheme?.option
																: '#000',
														}}
													>
														{option}
													</span>
													{this.state.preview === false ? (
														<div className="edit-delete">
															<span>
																<a
																	onClick={(e) =>
																		this.handleEditOption(e, k)
																	}
																>
																	<Edit />
																</a>
																<a
																	onClick={(e) =>
																		this.handleDeleteOption(
																			e,
																			k,
																		)
																	}
																>
																	<Deleted />
																</a>
															</span>
														</div>
													) : (
														''
													)}
												</>
											)}
										</div>
									);
								})}
							</div>
						)}
					</div>
				)}
				{this.state.preview === false ? (
					<a
						className="add-option"
						onClick={() =>
							this.setState({
								showAddOption: true,
							})
						}
					>
						+ Add Option
					</a>
				) : (
					''
				)}
				{this.state?.showAddOption ? (
					<div className="add-opt">
						<input
							onChange={(e) =>
								this.setState({
									emptyOption: e.target.value,
								})
							}
							value={this.state?.emptyOption}
						/>
						<span
							onClick={(e) =>
								this.state.emptyOption !== ''
									? this.setOpt(this.state?.emptyOption)
									: ''
							}
						>
							Save
						</span>
					</div>
				) : (
					''
				)}
			</div>
		);
	}
}

export default MultiOptionInputs;
