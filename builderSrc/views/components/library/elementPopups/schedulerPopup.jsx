import React from 'react';
import './schedular.scss';
import { ReactComponent as EditIcon } from '../svgs/schedulerpopup/EditIcon.svg';
import { ReactComponent as PickerIcon } from '../svgs/schedulerpopup/picker.svg';
import ColorPicker from '../../properties/colorpicker/index';
import { ReactComponent as SearchIcon } from '../svgs/smartFieldsvg/Search.svg';
import { ReactComponent as DropDown } from '../../../../assets/svg/dropDown.svg';
import { ReactComponent as ActiveTick } from '../svgs/tick.svg';

import '../../sidebar/elementSidebar.scss';
import _ from 'lodash';
class SchedulerPopup extends React.Component {
	// Add state to track active tab
	constructor(props) {
		super(props);
		this.state = {
			activeTab: 'scheduler',
			selectedSession: this.props?.activeComponent?.blocks?.[0]?.selectedSessionName || null,
			editingSession: null,
			editedName: '',
			themeDropdownOpen: false,
			activeComponent: props.activeComponent,
			activeFont: props?.fontFamily,
			showFontsDropDown: false,
			searchFont: '',
		};
		this.dropdownref = React.createRef();
		this.dropdownfontref = React.createRef();
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.activeComponent !== this.state.activeComponent) {
			this.setState({
				activeComponent: nextProps.activeComponent,
			});
		}
		if (
			this.state.selectedSession !==
			nextProps.activeComponent?.blocks?.[0]?.selectedSessionName
		) {
			this.setState({
				selectedSession: nextProps.activeComponent?.blocks?.[0]?.selectedSessionName,
			});
		}
		if (nextProps.fontFamily !== this.state.activeFont) {
			this.setState({
				activeFont: nextProps.fontFamily,
			});
		}
	}
	componentDidMount() {
		// Set the first session as default when component mounts
		if (this.props.allSchedules && this.props.allSchedules.length > 0) {
			const firstSession = this.props.allSchedules[0].sessionName;
			if (!this.props.activeComponent?.blocks?.[0]?.selectedSessionName) {
				this.handleSessionSelect(firstSession);
			}
		}
	}

	// Add method to handle tab switching
	handleTabClick = (tab) => {
		this.setState({ activeTab: tab });
	};

	handleSessionSelect = (sessionName) => {
		// this.setState({ selectedSession: sessionName });
		// Make sure this prop exists and is passed from parent
		if (this.props.onSessionSelect) {
			this.props.onSessionSelect(sessionName);
		}
	};
	handleEditClick = (sessionName, event) => {
		event.stopPropagation(); // Prevent session selection when clicking edit
		this.setState({
			editingSession: sessionName,
			editedName: sessionName,
		});
	};

	handleNameChange = (event) => {
		this.setState({ editedName: event.target.value });
	};
	handleClickOutside = (event) => {
		if (this.dropdownref.current && !this.dropdownref.current.contains(event.target)) {
			this.setState({
				showFontsDropDown: false,
			});
		}
		if (this.dropdownfontref.current && !this.dropdownfontref.current.contains(event.target)) {
			this.setState({
				showFontsVariantDropDown: false,
			});
		}
	};
	toggleFontsDropDown = (e) => {
		e.stopPropagation();
		this.setState(
			{
				showFontsVariantDropDown: false,
				showFontsDropDown: !this.state.showFontsDropDown,
			},
			() => {},
		);
	};
	toggleFontsVariantDropDown = (e) => {
		e.stopPropagation();
		this.setState({
			showFontsDropDown: false,
			showFontsVariantDropDown: !this.state.showFontsVariantDropDown,
		});
	};
	handleNameSubmit = async (schedule, event) => {
		event.preventDefault();
		const { editedName } = this.state;

		if (editedName.trim() && editedName !== schedule.sessionName) {
			// Call the API to update the session name
			if (this.props.onUpdateSessionName) {
				await this.props.getAllSchedules(editedName);
			}
		}

		this.setState({
			editingSession: null,
			editedName: '',
		});
	};
	toggleThemeDropdown = () => {
		this.setState((prevState) => ({
			themeDropdownOpen: !prevState.themeDropdownOpen,
		}));
	};

	handleSchedulerBlockStyles = (type, value) => {
		let newComponent = { ...this.state.activeComponent };
		if (
			type == 'background' ||
			type == 'fontColor' ||
			type == 'accentColor' ||
			type == 'fontFamily'
		) {
			newComponent = {
				...newComponent,
				style: {
					...newComponent.style,
					cardColors: {
						...newComponent.style.cardColors,
						[type]: value,
					},
					fontFamily: type == 'fontFamily' ? value : newComponent.style?.fontFamily,
				},
			};
		}
		this.props.handleScheduleStyles(newComponent);
	};

	render() {
		const { activeTab, selectedSession, themeDropdownOpen } = this.state;
		// Find the selected schedule object based on selectedSession name
		const selectedSchedule = this.props?.allSchedules?.find(
			(schedule) => schedule?.sessionName === selectedSession,
		);

		const fonts = [...(this.props?.fonts || [])];
		return (
			<div className="elementPopupContainer  scheduler-popup ">
				<div className="tabs">
					<span
						className={activeTab === 'scheduler' ? 'active' : ''}
						onClick={() => this.handleTabClick('scheduler')}
					>
						Schedular
					</span>
					<span
						className={activeTab === 'design' ? 'active' : ''}
						onClick={() => this.handleTabClick('design')}
					>
						Design
					</span>
				</div>

				{activeTab === 'scheduler' ? (
					<>
						<h2>Select a Session</h2>

						<div
							className="session-list"
							style={{ maxHeight: '275px', overflowY: 'auto' }}
						>
							{this.props?.allSchedules?.map((schedule, index) => (
								<div
									className="session-item"
									key={index}
									onClick={() => this.handleSessionSelect(schedule?.sessionName)}
									style={{ cursor: 'pointer' }}
								>
									<div className="session-header">
										<input
											type="radio"
											name="session"
											id={`schedule-${index}`}
											checked={
												this.state.selectedSession === schedule?.sessionName
											}
											onChange={() =>
												this.handleSessionSelect(schedule?.sessionName)
											}
										/>
										{this.state.editingSession === schedule?.sessionName ? (
											<form
												onSubmit={(e) => this.handleNameSubmit(schedule, e)}
											>
												<input
													type="text"
													value={this.state.editedName}
													onChange={this.handleNameChange}
													onClick={(e) => e.stopPropagation()}
													autoFocus
												/>
											</form>
										) : (
											<>
												<label htmlFor={`schedule-${index}`}>
													{schedule?.sessionName}
												</label>
												<span
													className="edit-icon"
													onClick={(e) =>
														this.handleEditClick(
															schedule?.sessionName,
															e,
														)
													}
												>
													<EditIcon />
												</span>
											</>
										)}
									</div>
									<div className="session-details">
										<div className="session-info">
											{schedule?.sessionTypeInfo?.sessionType === 'In Person'
												? 'Video-call'
												: schedule?.sessionTypeInfo?.sessionType}
											,{schedule?.sessionDuration?.unitCount}{' '}
											{schedule?.sessionDuration?.unitType},
											{schedule?.sessionTimezone?.split('/')[1]}
										</div>
										<div className="session-type">
											Type : {schedule?.sessionTypeInfo?.sessionType}
										</div>
									</div>
								</div>
							))}
						</div>

						{/* <button className="create-session">
                            Create a Session
                            <span className="external-icon">↗</span>
                        </button> */}
					</>
				) : (
					<>
						<div className="design-content element_image">
							{selectedSchedule ? (
								<>
									<div className="session-title">
										<div className="session-title-dot"></div>
										<h2 className="session-title-text">
											{selectedSchedule.sessionName}
										</h2>
										<div className="session-edit-icon">
											<EditIcon />
										</div>
									</div>
									<div className="session-info">
										Video-call, {selectedSchedule.sessionDuration.unitCount}{' '}
										minutes, MDT/MST
									</div>
									<div className="session-type">
										Type: {selectedSchedule.sessionTypeInfo.sessionType}
									</div>

									<div className="design-divider"></div>

									{/* Font Selection */}
									<div className="element_image_container_main">
										<div className="element_image">
											<div className="element_pasteURL">
												<p className="subheading">Fonts</p>
												<>
													<div
														className="element_input"
														style={{
															flexDirection: 'row',
															alignItems: 'center',
															cursor: 'pointer',
														}}
														onClick={(e) => {
															this.toggleFontsDropDown(e);
														}}
													>
														<span
															style={{
																fontSize: '13px',
																color: '#f1f1f1',
																cursor: 'pointer',
																width: '100%',
																height: '100%',
															}}
														>
															{this.state.activeFont
																? this.state.activeFont
																: 'Font Family'}
														</span>

														<DropDown
															style={{
																cursor: 'pointer',
																rotate: !this.state
																	.showFontsDropDown
																	? '0deg'
																	: '180deg',
															}}
														/>
													</div>
													{this.state.showFontsDropDown ? (
														<>
															<div
																className="fonts-dropdown"
																ref={this.dropdownref}
															>
																<div
																	style={{
																		width: '100%',
																		position: 'sticky',
																		top: '0px',
																		background: '#171717',
																		zIndex: 10,
																	}}
																	className="font-search-container"
																>
																	<SearchIcon />
																	<input
																		className="font-search"
																		value={
																			this.state.searchFont
																		}
																		onChange={(e) =>
																			this.setState({
																				searchFont:
																					e.target.value,
																			})
																		}
																		placeholder={'Search Font'}
																	/>
																</div>

																{(() => {
																	const searchFiltered =
																		fonts.filter(
																			(font) =>
																				this.state
																					.searchFont ===
																					'' ||
																				font.fontName
																					?.toLowerCase()
																					?.includes(
																						this.state.searchFont?.toLowerCase(),
																					),
																		);

																	// Group fonts by their 'group' property
																	let groupedFonts = _.groupBy(
																		searchFiltered,
																		'group',
																	);

																	return Object.entries(
																		groupedFonts,
																	).map(
																		([
																			groupName,
																			groupFonts,
																		]) => (
																			<div
																				key={groupName}
																				className="font-group"
																			>
																				<div className="group-title">
																					{groupName}
																				</div>
																				<div className="group-fonts">
																					{_.orderBy(
																						_.uniqBy(
																							groupFonts,
																							(
																								font,
																							) =>
																								font.fontName?.toLowerCase(),
																						),
																						[
																							(
																								font,
																							) =>
																								font.fontName?.toLowerCase(),
																						],
																						['asc'],
																					).map(
																						(
																							font,
																							k,
																						) => (
																							<div
																								className="font-item"
																								style={{
																									display:
																										'flex',
																									alignItems:
																										'center',
																									justifyContent:
																										'space-between',
																								}}
																							>
																								<p
																									key={
																										k
																									}
																									onClick={(
																										e,
																									) =>
																										this.handleSchedulerBlockStyles(
																											'fontFamily',
																											font.value,
																										)
																									}
																									style={{
																										fontFamily:
																											font?.value,
																									}}
																									// className={`font-item ${this.state.selectedFont === font.value ? 'active' : ''}`}
																								>
																									{
																										font.fontName
																									}
																								</p>
																								{this
																									.state
																									.activeFont ==
																									font?.value && (
																									<ActiveTick />
																								)}
																							</div>
																						),
																					)}
																				</div>
																			</div>
																		),
																	);
																})()}
															</div>
														</>
													) : (
														''
													)}
												</>
											</div>
										</div>
									</div>

									<div className="design-divider"></div>

									{/* Theme Selection */}
									<div
										className="theme-dropdown"
										onClick={this.toggleThemeDropdown}
									>
										<span className="theme font-medium">Theme</span>
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											style={{
												transform: themeDropdownOpen
													? 'rotate(180deg)'
													: 'rotate(0deg)',
												transition: 'transform 0.3s ease',
											}}
										>
											<path
												d="M6 9L12 15L18 9"
												stroke="white"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</div>

									{/* Color Selection */}
									{themeDropdownOpen && (
										<>
											<div
												className="card-section pad-color-p-imp"
												style={{ padding: '12px 0px', width: '100%' }}
											>
												<ColorPicker
													title={'Card Background'}
													color={
														this.state?.activeComponent?.cardColors
															?.backgroundColor
													}
													handleColor={(e) =>
														this.handleSchedulerBlockStyles(
															'background',
															e,
														)
													}
													brandColors={this.props?.brandColors}
													zoom={0.77}
												/>
											</div>

											<div
												className="font-section pad-color-p-imp"
												style={{ padding: '12px 0px', width: '100%' }}
											>
												<ColorPicker
													title={'Font Color'}
													color={
														this.state?.activeComponent?.cardColors
															?.fontColor
													}
													handleColor={(e) =>
														this.handleSchedulerBlockStyles(
															'fontColor',
															e,
														)
													}
													brandColors={this.props?.brandColors}
													zoom={0.77}
												/>
											</div>

											<div
												className="accent-section pad-color-p-imp"
												style={{ padding: '12px 0px', width: '100%' }}
											>
												<ColorPicker
													title={'Accent/Button'}
													color={
														this.state?.activeComponent?.cardColors
															?.accentColor
													}
													handleColor={(e) =>
														this.handleSchedulerBlockStyles(
															'accentColor',
															e,
														)
													}
													brandColors={this.props?.brandColors}
													zoom={0.77}
												/>
											</div>
										</>
									)}
								</>
							) : (
								<div className="no-session-selected">
									<p>
										Please select a session from the Scheduler tab to customize
										its design.
									</p>
								</div>
							)}
						</div>
					</>
				)}
			</div>
		);
	}
}

export default SchedulerPopup;
