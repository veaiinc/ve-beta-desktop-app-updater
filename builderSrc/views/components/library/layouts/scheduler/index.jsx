import React, { useState } from 'react';
import './scheduler.scss';
// import Text from '../../elements/text/index';
import { ElementSidebar } from '../../../builder_client_common';
// import moment from 'moment';

// Time slots
const morningSlots = ['9:30 AM', '11:30 AM'];
const afternoonSlots = ['2:30 PM', '5:00 PM', '6:30 PM'];

// Timezone options
const timezones = [
	'Indian Standard Time (IST): UTC+5:30',
	'Eastern Time (ET): UTC-5:00',
	'Pacific Time (PT): UTC-8:00',
	'Central European Time (CET): UTC+1:00',
];

class Scheduler extends React.Component {
	constructor(props) {
		super(props);
		this.containerRef = React.createRef();

		const today = new Date();

		this.state = {
			showElementSidebar: false,
			selectedDate: today,
			currentMonth: today.getMonth(),
			currentYear: today.getFullYear(),
			selectedTimezone: timezones[0],
			preview: props.preview,
			previewType: props.previewType,
			summaryBg: props.summaryBg,
			summaryFont: props.summaryFont,
			summaryFontColor: props.summaryFontColor,
			summaryFontSize: props?.summaryFontSize,

			sections: props?.globalSummaryData?.sections,
			tables: props?.globalSummaryData?.tables,
			style: props?.style,
			preview: props.preview,
			previewType: props.previewType,

			client: props?.client,

			showBlockOptions: false,
			showBlockActions: false,
			activeFontColor: props.activeFontColor,
			actionType: props.actionType,
			actionValue: props.actionValue,

			blocks: props.blocks,
			activeSectionID: props.activeSectionID,
			sectionID: props._id,
			activeTextBlock: props.activeTextBlock,
			activeVariableID: props.activeVariableID,
			activeVariableName: props.activeVariableName,
			subBlockID: props.subBlockID,
			activeSubBlockId: props.activeSubBlockId,
			isActiveSection: props.isActiveSection,
			sectionType: props?.sectionType,
			triggerFont: props?.triggerFont,
			triggeredFont: props?.triggeredFont,
			backgroundType: props.backgroundType,
			backgroundImageURL: props?.backgroundImageURL,
			backgroundVideoURL: props.backgroundVideoURL,
			activeSection: props?.activeSection,
			section: props?.section,
			showSummary: false,
			isConfirmed: false,
			selectedSessionName: this.props?.allSchedules?.[0]?.sessionName || null,
			client: props?.client,
			activeImageSubBlock: props?.activeImageSubBlock,
			saveSections: props.saveSections,
			isSubmitting: false,
			bookingError: null,
		};
	}

	componentDidMount() {
		// Add click event listener to document
		document.addEventListener('mousedown', this.handleClickOutside);
	}

	componentWillUnmount() {
		// Remove event listener when component unmounts
		document.removeEventListener('mousedown', this.handleClickOutside);
	}
	componentWillReceiveProps(nextProps) {
		if (this.state.section !== nextProps?.section) {
			this.setState({
				section: nextProps?.section,
			});
		}
	}

	handleClickOutside = (event) => {
		if (this.containerRef.current && !this.containerRef.current.contains(event.target)) {
			this.setState({
				showElementSidebar: false,
			});
		}
	};
	handleContainerClick = (e) => {
		// Only show ElementSidebar in builder mode, not in client mode
		if (!this.props.client) {
			e.stopPropagation();

			// Only set state if sidebar isn't already showing to prevent unnecessary re-renders
			if (!this.state.showElementSidebar) {
				this.setState({
					showElementSidebar: true,
				});
			}
		}
	};
	handleSessionSelect = (sessionName) => {
		const selectedSession = this.props?.allSchedules?.find(
			(schedule) => schedule.sessionName === sessionName,
		);

		this.setState(
			{
				selectedSessionName: sessionName,
			},
			() => {
				if (!this.props.client) {
					const { section } = this.state;
					if (section) {
						const sessionDuration = selectedSession?.sessionDuration
							? `${selectedSession.sessionDuration.unitCount} ${selectedSession.sessionDuration.unitType}`
							: '';

						const updateBlocks = section.blocks
							? section.blocks.map((block) => {
									return {
										...block,
										selectedSessionName: sessionName,
										sessionTitle: sessionName,
										sessionDuration: sessionDuration,
									};
							  })
							: [];

						const updatedSection = {
							...section,
							selectedSessionName: sessionName,
							sessionTitle: sessionName,
							sessionDuration: sessionDuration,
							sessionID: selectedSession?._id,
							// Save availability slots to section data for client mode
							availabilitySlots: selectedSession?.availabilitySlots || [],
							blocks: updateBlocks,
						};

						// Update sections array
						const updatedSections = this.props.sections.map((s) =>
							s._id === section._id ? updatedSection : s,
						);

						// Uncomment this line to actually save the changes
						this.props.saveSections(updatedSections);
					}
				}
			},
		);
	};
	getSessionDurationText = () => {
		const { selectedSessionName } = this.state;
		// Add this line to check if we're in client mode and use section data if available
		if (this.props.client && this.state.section?.sessionDuration) {
			return this.state.section.sessionDuration;
		}

		const selectedSession = this.props?.allSchedules?.find(
			(schedule) => schedule.sessionName === selectedSessionName,
		);

		if (selectedSession?.sessionDuration) {
			const { unitCount, unitType } = selectedSession.sessionDuration;
			return `${unitCount} ${unitType}`;
		}

		return 'Duration not specified';
	};

	getAvailableTimeSlots = () => {
		const { selectedDate } = this.state;

		// For client mode, use the saved slots from section data if available
		if (this.props.client && this.state.section?.availabilitySlots) {
			const dayOfWeek = selectedDate.getDay();
			const dayNames = [
				'Sunday',
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
				'Saturday',
			];
			const dayName = dayNames[dayOfWeek];

			// Find slots for this day from the saved section data
			const daySlots = this.state.section.availabilitySlots.find(
				(slot) => slot.dayOfWeek === dayName,
			);

			if (!daySlots || !daySlots.timeRanges) return [];

			// Convert time ranges to formatted time slots
			return daySlots.timeRanges.map((range) => {
				// Convert 24h format to 12h format
				const formatTime = (timeStr) => {
					const [hours, minutes] = timeStr.split(':');
					const hour = parseInt(hours, 10);
					const ampm = hour >= 12 ? 'PM' : 'AM';
					const hour12 = hour % 12 || 12;
					return `${hour12}:${minutes} ${ampm}`;
				};

				return formatTime(range.startTime);
			});
		}

		// Original code for builder mode
		const { allSchedules } = this.props;
		if (!selectedDate || !allSchedules) return [];

		// Get the selected session
		const selectedSession = allSchedules.find(
			(schedule) => schedule.sessionName === this.state.selectedSessionName,
		);

		if (!selectedSession || !selectedSession.availabilitySlots) return [];

		// Get day of week (0 = Sunday, 1 = Monday, etc.)
		const dayOfWeek = selectedDate.getDay();
		const dayNames = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
		];
		const dayName = dayNames[dayOfWeek];

		// Find slots for this day
		const daySlots = selectedSession.availabilitySlots.find(
			(slot) => slot.dayOfWeek === dayName,
		);

		if (!daySlots || !daySlots.timeRanges) return [];

		// Convert time ranges to formatted time slots
		return daySlots.timeRanges.map((range) => {
			// Convert 24h format to 12h format
			const formatTime = (timeStr) => {
				const [hours, minutes] = timeStr.split(':');
				const hour = parseInt(hours, 10);
				const ampm = hour >= 12 ? 'PM' : 'AM';
				const hour12 = hour % 12 || 12;
				return `${hour12}:${minutes} ${ampm}`;
			};

			return formatTime(range.startTime);
		});
	};

	groupTimeSlots = (slots) => {
		const morning = [];
		const afternoon = [];

		slots.forEach((slot) => {
			if (slot.includes('AM')) {
				morning.push(slot);
			} else {
				afternoon.push(slot);
			}
		});

		return { morning, afternoon };
	};

	// Get days in month
	getDaysInMonth(month, year) {
		return new Date(year, month + 1, 0).getDate();
	}

	// Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
	getFirstDayOfMonth(month, year) {
		return new Date(year, month, 1).getDay();
	}

	// Generate calendar days for the current month view
	generateCalendarDays() {
		const { currentMonth, currentYear, selectedDate } = this.state;
		const today = new Date();
		const daysInMonth = this.getDaysInMonth(currentMonth, currentYear);
		const firstDay = this.getFirstDayOfMonth(currentMonth, currentYear);

		// Previous month's days
		const daysInPrevMonth = this.getDaysInMonth(
			currentMonth - 1 < 0 ? 11 : currentMonth - 1,
			currentMonth - 1 < 0 ? currentYear - 1 : currentYear,
		);

		const days = [];

		// Days from previous month
		const prevMonthDays = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday as first day
		for (let i = prevMonthDays - 1; i >= 0; i--) {
			days.push({
				day: daysInPrevMonth - i,
				month: currentMonth - 1 < 0 ? 11 : currentMonth - 1,
				year: currentMonth - 1 < 0 ? currentYear - 1 : currentYear,
				isCurrentMonth: false,
			});
		}

		// Days of current month
		for (let i = 1; i <= daysInMonth; i++) {
			days.push({
				day: i,
				month: currentMonth,
				year: currentYear,
				isCurrentMonth: true,
				isToday:
					i === today.getDate() &&
					currentMonth === today.getMonth() &&
					currentYear === today.getFullYear(),
			});
		}

		// Calculate how many days from next month we need
		const remainingCells = 42 - days.length; // 6 rows × 7 days = 42 total cells

		// Days from next month
		for (let i = 1; i <= remainingCells; i++) {
			days.push({
				day: i,
				month: currentMonth + 1 > 11 ? 0 : currentMonth + 1,
				year: currentMonth + 1 > 11 ? currentYear + 1 : currentYear,
				isCurrentMonth: false,
			});
		}

		return days;
	}

	navigateMonth = (direction) => {
		// Only allow navigation in client mode
		if (this.props.client) {
			this.setState(
				(prevState) => {
					let newMonth = prevState.currentMonth;
					let newYear = prevState.currentYear;

					if (direction === 'prev') {
						newMonth--;
						if (newMonth < 0) {
							newMonth = 11;
							newYear--;
						}
					} else {
						newMonth++;
						if (newMonth > 11) {
							newMonth = 0;
							newYear++;
						}
					}

					return {
						currentMonth: newMonth,
						currentYear: newYear,
					};
				},
				() => {
					// Update sections after state change
					if (!this.props.client) {
						const { section, currentMonth, currentYear } = this.state;
						if (section) {
							const updatedSection = {
								...section,
								currentMonth,
								currentYear,
							};

							// Update sections array
							const updatedSections = this.props.sections.map((s) =>
								s._id === section._id ? updatedSection : s,
							);

							this.props.saveSections(updatedSections);
						}
					}
				},
			);
		}
	};

	// Handle date selection
	handleDateSelect = (day, month, year) => {
		// Only allow date selection in client mode
		if (this.props.client) {
			const selectedDate = new Date(year, month, day);
			this.setState({
				selectedDate,
			});
		}
	};

	handleTimeSelect = (time) => {
		this.setState({
			selectedTime: time,
			showSummary: this.props.client ? true : false,
		});
	};

	handleTimezoneChange = (e) => {
		const selectedTimezone = e.target.value;
		this.setState({
			selectedTimezone,
		});
	};

	// Get month name
	getMonthName(month) {
		const months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];
		return months[month];
	}

	// Get day name
	getDayName(day) {
		const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
		// Reorder days to start with Monday
		const reorderedDays = days.slice(1).concat(days[0]);
		return reorderedDays[day];
	}
	handleDurationChange = (e) => {
		const selectedDuration = e.target.value;
		this.setState({
			selectedDuration,
		});
	};

	handleBack = () => {
		this.setState({
			showSummary: false,
		});
	};

	handleConfirmAppointment = () => {
		this.setState(
			{
				isSubmitting: true, // Add loading state
			},
			async () => {
				if (this.props.handleBookSessionSlot && this.props.client) {
					try {
						// Convert selected date and time to ISO string
						let startDateConverted = new Date(this.state.selectedDate);
						startDateConverted.setHours(
							parseInt(this.state.selectedTime.split(':')[0]),
						);
						startDateConverted.setMinutes(
							parseInt(this.state.selectedTime.split(':')[1]),
						);
						startDateConverted = startDateConverted.toISOString();

						//  convert end date to iso string
						let endDateConverted = new Date(startDateConverted);
						endDateConverted.setMinutes(
							endDateConverted.getMinutes() +
								parseInt(this.getSessionDurationText().split(' ')[0]),
						);
						endDateConverted = endDateConverted.toISOString();

						const appointmentData = {
							endDateTime: endDateConverted,
							startDateTime: startDateConverted,
							timezone: this.state.selectedTimezone,
							title: this.state.section?.blocks?.[0]?.selectedSessionName,
							sessionId: this.props?.section?.sessionID,
						};

						// Assuming handleBookSessionSlot returns a promise
						await this.props.handleBookSessionSlot(
							this.props.section?.sessionID,
							appointmentData,
						);

						//   // Only set confirmed if the booking was successful
						this.setState({
							isConfirmed: true,
							isSubmitting: false,
							bookingError: null,
						});
					} catch (error) {
						// Handle error case
						this.setState({
							isSubmitting: false,
							bookingError:
								error.message || 'Failed to book appointment. Please try again.',
						});
					}
				} else {
					// For non-client mode or when handler isn't available
					// Update sections after state change
					if (!this.props.client) {
						const { section } = this.state;
						if (section) {
							const updatedSection = {
								...section,
								isConfirmed: true,
							};

							// Update sections array
							const updatedSections = this.props.sections.map((s) =>
								s._id === section._id ? updatedSection : s,
							);

							this.props.saveSections(updatedSections);
						}
						this.setState({
							isConfirmed: true,
							isSubmitting: false,
						});
					}
				}
			},
		);
	};

	render() {
		const {
			selectedStylist,
			selectedDate,
			selectedTime,
			currentMonth,
			currentYear,
			selectedTimezone,
			showSummary,
			isConfirmed,
			isSubmitting,
			bookingError,
		} = this.state;
		const calendarDays = this.generateCalendarDays();
		const { showElementSidebar } = this.state;
		const { client } = this.props;
		const availableSlots = this.getAvailableTimeSlots();
		const { morning: morningSlots, afternoon: afternoonSlots } =
			this.groupTimeSlots(availableSlots);

		// Week days starting with Monday
		const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

		if (isConfirmed && client && !bookingError) {
			return (
				<div className="appointment-container" ref={this.containerRef}>
					<div className="confirmation-screen">
						<div className="confirmation-title">Your Appointment Is Confirmed!</div>
						<div className="confirmation-card">
							<div className="details-title">Appointment Details:</div>
							<div
								className="service-name"
								style={{
									color: this.props?.section?.style?.cardColors?.fontColor,
									fontFamily: this.props?.section?.style?.fontFamily,
								}}
							>
								{this.state.section?.blocks?.[0]?.selectedSessionName}
							</div>
							<div className="duration-cost">{this.getSessionDurationText()}</div>
							<div className="appointment-datetime">
								{selectedDate &&
									`${selectedDate.toLocaleDateString('en-US', {
										weekday: 'short',
										month: 'long',
										day: 'numeric',
										year: 'numeric',
									})} At ${selectedTime} ${selectedTimezone.split(':')[0]}`}
							</div>
						</div>
					</div>
				</div>
			);
		}

		return (
			<div
				className="appointment-container"
				onClick={this.handleContainerClick}
				ref={this.containerRef}
				style={{ background: this.props?.section?.style?.cardColors?.background }}
			>
				{showElementSidebar && !client && (
					<ElementSidebar
						ref={this.elementSidebarRef}
						activeType={'scheduler'}
						elementEndPosition={{ x: 883, y: 51 }}
						activePopupComponent={this.state?.section}
						showPopupInMobile={this.state.showPopupInMobile}
						isvalidActiveVideoURL={this.state.isvalidActiveVideoURL}
						brandColors={this.props?.brandColors}
						isWorkflow={this.props.isWorkflow}
						modules={this.props?.modules}
						module={this.props.module}
						activeWorkflowModuleId={this.props?.activeWorkflowModuleId}
						activeModuleId={this.props?.activeModuleId}
						previewType={this.state?.previewType}
						activeSectionID={this.state.activeSectionID}
						activeModuleSections={this.props?.activeModuleSections}
						handleFonts={(e, f) => this.handleFontsStyles(e, f)}
						getModuleSections={(e) => this.props?.getModuleSections(e)}
						setActiveImageSettings={(value) => this.setActiveImageSettings(value)}
						setActivePopupComponent={(value) => this?.setActivePopupComponent(value)}
						setModalRef={(e) => {
							this.setState({
								showImageModal: e,
							});
						}}
						handleCardPopupProps={this.handleCardPopupProps}
						isScheduler={true}
						allSchedules={this.props?.allSchedules}
						onSessionSelect={this.handleSessionSelect}
						handleScheduleStyles={(data) => this.props.handleScheduleStyles(data)}
						fonts={this.props?.fonts}
					/>
				)}

				{!showSummary || !client ? (
					<>
						<div className="appointment-card">
							<div className="service-header">
								<div
									className="service-title"
									style={{
										color: this.props?.section?.style?.cardColors?.fontColor,
										fontFamily: this.props?.section?.style?.fontFamily,
									}}
								>
									{this.state.section?.blocks?.[0]?.selectedSessionName}
								</div>

								<div className="service-time" ref={(el) => (this.box = el)}>
									{this.getSessionDurationText()}
								</div>
							</div>
						</div>

						{/* <div className="stylist-section">
								<div className="stylist-label">Your Stylist</div>
								<div className="stylist-options">
									{stylists.map((stylist) => (
										<div
											key={stylist.id}
											className={`stylist-option ${selectedStylist === stylist ? 'selected' : ''}`}
											onClick={() => this.handleStylistSelect(stylist)}
										>
											<img src={stylist.avatar} alt={stylist.name} className="stylist-avatar" />
											<span className="stylist-name">{stylist.name}</span>
										</div>
									))}
								</div>
							</div> */}

						<div className="booking-grid">
							<div className="calendar-container">
								<div className="calendar-header">
									<div className="calendar-month">
										{this.getMonthName(currentMonth)} {currentYear}
									</div>
									<div className="calendar-nav">
										<button
											className="calendar-nav-btn"
											onClick={() => this.navigateMonth('prev')}
											style={{
												backgroundColor: `${this.props?.section?.style?.cardColors?.accentColor}80`, // 80 is hex for 50% opacity
												color: this.props?.section?.style?.cardColors
													?.accentColor, // Adding text color
											}}
										>
											&lt;
										</button>
										<button
											className="calendar-nav-btn"
											onClick={() => this.navigateMonth('next')}
											style={{
												backgroundColor: `${this.props?.section?.style?.cardColors?.accentColor}80`, // 80 is hex for 50% opacity
												color: this.props?.section?.style?.cardColors
													?.accentColor, // Adding text color
											}}
										>
											&gt;
										</button>
									</div>
								</div>

								<div className="calendar-grid">
									{weekDays.map((day, index) => (
										<div key={index} className="calendar-day-header">
											{day}
										</div>
									))}

									{calendarDays.map((day, index) => {
										const isSelected =
											selectedDate &&
											day.day === selectedDate.getDate() &&
											day.month === selectedDate.getMonth() &&
											day.year === selectedDate.getFullYear();

										return (
											<div
												key={index}
												className={`calendar-day 
											${!day.isCurrentMonth ? 'other-month' : ''} 
											${isSelected ? 'selected' : ''} 
											${day.isToday ? 'today' : ''}`}
												onClick={() =>
													this.handleDateSelect(
														day.day,
														day.month,
														day.year,
													)
												}
												style={
													isSelected
														? {
																backgroundColor:
																	this.props?.section?.style
																		?.cardColors?.accentColor ||
																	'#8a9e67',
																color: 'white',
														  }
														: day.isToday
														? {
																border: `1px solid ${
																	this.props?.section?.style
																		?.cardColors?.accentColor ||
																	'#8a9e67'
																}`,
																color:
																	this.props?.section?.style
																		?.cardColors?.accentColor ||
																	'#8a9e67',
																backgroundColor: `${
																	this.props?.section?.style
																		?.cardColors?.accentColor ||
																	'#8a9e67'
																}20`, // 20 is hex for 12% opacity
														  }
														: {}
												}
											>
												{day.day}
											</div>
										);
									})}
								</div>
							</div>

							<div className="time-container">
								<select
									className="timezone-selector"
									value={selectedTimezone}
									onChange={this.handleTimezoneChange}
								>
									{timezones.map((timezone, index) => (
										<option key={index} value={timezone}>
											{timezone}
										</option>
									))}
								</select>

								{morningSlots.length > 0 && (
									<div className="time-section">
										<div className="time-section-label">AM</div>
										<div className="time-options">
											{morningSlots.map((time, index) => (
												<div
													key={index}
													className={`time-option ${
														selectedTime === time ? 'selected' : ''
													}`}
													onClick={() => this.handleTimeSelect(time)}
													style={{
														color: this.props?.section?.style
															?.cardColors?.accentColor,
													}}
												>
													{time}
												</div>
											))}
										</div>
									</div>
								)}

								{afternoonSlots.length > 0 && (
									<div className="time-section">
										<div className="time-section-label">PM</div>
										<div className="time-options">
											{afternoonSlots.map((time, index) => (
												<div
													key={index}
													className={`time-option ${
														selectedTime === time ? 'selected' : ''
													}`}
													onClick={() => this.handleTimeSelect(time)}
													style={{
														color: this.props?.section?.style
															?.cardColors?.accentColor,
													}}
												>
													{time}
												</div>
											))}
										</div>
									</div>
								)}

								{availableSlots.length === 0 && (
									<div className="no-slots-message">
										No available time slots for this date.
									</div>
								)}
							</div>
						</div>
					</>
				) : (
					client && (
						<div className="appointment-summary">
							<div className="summary-header">
								<div className="summary-title">Appointment Details:</div>
							</div>
							<div className="summary-content">
								<div
									className="service-name"
									style={{
										color: this.props?.section?.style?.cardColors?.fontColor,
										fontFamily: this.props?.section?.style?.fontFamily,
									}}
								>
									{this.props?.section?.selectedSessionName}
								</div>
								<div className="appointment-datetime">
									{selectedDate &&
										`${selectedDate.toLocaleDateString('en-US', {
											weekday: 'short',
											month: 'long',
											day: 'numeric',
											year: 'numeric',
										})} at ${selectedTime}`}
								</div>
								<div className="duration-cost">{this.getSessionDurationText()}</div>
								{selectedStylist && (
									<div className="stylist-info">
										<div className="stylist-label">Your Stylist</div>
										<div className="selected-stylist">
											<img
												src={selectedStylist.avatar}
												alt=""
												className="stylist-avatar-small"
											/>
											<span>{selectedStylist.name}</span>
										</div>
									</div>
								)}
								<div className="summary-actions">
									<button
										className="reschedule-btn"
										onClick={() => this.setState({ showSummary: false })}
									>
										Reschedule
									</button>
									<button
										className="confirm-btn"
										onClick={this.handleConfirmAppointment}
										disabled={isSubmitting}
										style={{
											backgroundColor:
												this.props?.section?.style?.cardColors?.accentColor,
										}}
									>
										{isSubmitting ? 'Processing...' : 'Confirm Appointment'}
									</button>
								</div>
							</div>

							{bookingError && (
								<div
									className="booking-error"
									style={{ color: 'red', marginTop: '10px' }}
								>
									{bookingError}
								</div>
							)}
						</div>
					)
				)}
			</div>
		);
	}
}

export default Scheduler;
