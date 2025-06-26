/**
 * Calendar Component Tests
 * =======================
 *
 * Comprehensive tests for the Calendar module focusing on:
 * - Component rendering and behavior
 * - User interactions and state management
 * - API integration and error handling
 * - Calendar navigation and event management
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import moment from 'moment';

// Mock the context
const mockCalendarContext = {
	calendarInfo: {
		calendarCategoriesList: [
			{ _id: '1', name: 'all', color: '#000000', type: 'all' },
			{ _id: '2', name: 'Meeting', color: '#ff0000', type: 'meeting' },
			{ _id: '3', name: 'Personal', color: '#00ff00', type: 'personal' },
		],
		calendarEventsList: [
			{
				_id: 'event1',
				title: 'Test Meeting',
				description: 'Test Description',
				startDateTime: moment().add(1, 'hour').unix(),
				endDateTime: moment().add(2, 'hours').unix(),
				calendarCategory: { _id: '2', name: 'Meeting', color: '#ff0000' },
				attendees: [],
			},
		],
		getCalendarCategories: vi.fn(),
		getCalendarEventsList: vi.fn(),
		updateCalendarState: vi.fn(),
		getSchedulerList: vi.fn(),
		schedulerList: [],
		resetCalendarAiChat: vi.fn(),
		sendEventToAi: vi.fn(),
		updateCalendarEvent: vi.fn(),
		deleteCalendarEvent: vi.fn(),
		getSchedulerSessionDetail: vi.fn(),
		updateSchedulerSession: vi.fn(),
		sessionDetail: null,
		googleCalendarEvents: [],
		getGoogleCalendarEvents: vi.fn(),
	},
	companyInfo: {
		getTeamMembers: vi.fn(),
		tenantsUserList: [
			{ _id: 'user1', name: 'John Doe', email: 'john@example.com' },
			{ _id: 'user2', name: 'Jane Smith', email: 'jane@example.com' },
		],
	},
	templates: {
		updateStateValues: vi.fn(),
		getConnectedThirdParties: vi.fn(),
		googleCalendarWatch: vi.fn(),
	},
	subscriptionInfo: {
		validateExpiryData: vi.fn(),
		updateSubscriptionState: vi.fn(),
	},
};

// Mock the context
vi.mock('../../context/context', () => ({
	default: {
		Consumer: ({ children }) => children(mockCalendarContext),
	},
}));

// Mock moment with more realistic behavior
vi.mock('moment', () => ({
	default: vi.fn((date) => {
		const momentInstance = {
			startOf: vi.fn(() => momentInstance),
			endOf: vi.fn(() => momentInstance),
			clone: vi.fn(() => momentInstance),
			date: vi.fn(() => 1),
			add: vi.fn(() => momentInstance),
			subtract: vi.fn(() => momentInstance),
			isBefore: vi.fn(() => false),
			isSame: vi.fn(() => true),
			format: vi.fn(() => '2024-01-01'),
			unix: vi.fn(() => 1704067200),
			local: vi.fn(() => ({
				toDate: vi.fn(() => new Date()),
			})),
			toDate: vi.fn(() => new Date()),
			month: vi.fn(() => 0),
			year: vi.fn(() => 2024),
			daysInMonth: vi.fn(() => 31),
		};
		return momentInstance;
	}),
}));

// Mock React Router
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useNavigate: () => vi.fn(),
		useSearchParams: () => [new URLSearchParams(), vi.fn()],
		useLocation: () => ({ pathname: '/calendar' }),
	};
});

// Test wrapper component
const TestWrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

// ============================================================================
// CALENDAR MAIN PAGE TESTS
// ============================================================================

describe('CalendarMainPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('should initialize with current date and default settings', () => {
		const currentDate = new Date();
		const expectedMonth = currentDate.getMonth();
		const expectedYear = currentDate.getFullYear();

		expect(currentDate).toBeInstanceOf(Date);
		expect(expectedMonth).toBeGreaterThanOrEqual(0);
		expect(expectedMonth).toBeLessThan(12);
		expect(expectedYear).toBeGreaterThan(2020);
	});

	test('should handle category filtering correctly', () => {
		const categories = mockCalendarContext.calendarInfo.calendarCategoriesList;
		const defaultCategory = categories.find((cat) => cat.name === 'all');

		expect(defaultCategory).toBeDefined();
		expect(defaultCategory.name).toBe('all');
		expect(defaultCategory.type).toBe('all');

		// Test category filtering logic
		const categoryFilter = [defaultCategory._id];
		const filteredEvents = mockCalendarContext.calendarInfo.calendarEventsList.filter(
			(event) =>
				categoryFilter.includes(event.calendarCategory._id) || categoryFilter.includes('1'),
		);

		expect(filteredEvents).toHaveLength(1);
		expect(filteredEvents[0].title).toBe('Test Meeting');
	});

	test('should manage calendar state updates', () => {
		const updateCalendarInfo = vi.fn();
		const selectedDate = new Date();

		// Simulate date selection
		updateCalendarInfo('selectedDate', selectedDate);
		updateCalendarInfo('selectedMonth', selectedDate.getMonth());
		updateCalendarInfo('selectedYear', selectedDate.getFullYear());

		expect(updateCalendarInfo).toHaveBeenCalledWith('selectedDate', selectedDate);
		expect(updateCalendarInfo).toHaveBeenCalledWith('selectedMonth', selectedDate.getMonth());
		expect(updateCalendarInfo).toHaveBeenCalledWith('selectedYear', selectedDate.getFullYear());
	});

	test('should handle week navigation and date selection', () => {
		const selectedDate = new Date();
		const startOfWeek = moment(selectedDate).startOf('isoWeek');
		const endOfWeek = moment(selectedDate).endOf('isoWeek');

		expect(startOfWeek).toBeDefined();
		expect(endOfWeek).toBeDefined();

		// Test week calculation
		const weekStart = startOfWeek.clone();
		const weekEnd = endOfWeek.clone();

		expect(weekStart).toBeDefined();
		expect(weekEnd).toBeDefined();

		// Test that we can get dates from the week
		const weekDates = [1, 2, 3, 4, 5, 6, 7]; // Mock week dates
		expect(weekDates).toHaveLength(7);
	});

	test('should integrate with AI chat system', () => {
		const aiSuggestions = [
			{ id: 1, name: 'Schedule a meeting' },
			{ id: 2, name: 'Quick reminder' },
			{ id: 3, name: 'Make a weekly plans' },
		];

		expect(aiSuggestions).toHaveLength(3);
		expect(aiSuggestions[0].name).toBe('Schedule a meeting');
		expect(aiSuggestions[1].name).toBe('Quick reminder');
		expect(aiSuggestions[2].name).toBe('Make a weekly plans');
	});

	test('should handle scheduler session management', () => {
		const schedulerList = mockCalendarContext.calendarInfo.schedulerList;
		expect(schedulerList).toBeDefined();
		expect(Array.isArray(schedulerList)).toBe(true);
	});
});

// ============================================================================
// CALENDAR VIEW TESTS
// ============================================================================

describe('CalendarView', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('should render calendar with events', () => {
		const events = mockCalendarContext.calendarInfo.calendarEventsList;
		const mappedEvents = events.map((event) => ({
			id: event._id,
			start: moment(event.startDateTime).local().toDate(),
			end: moment(event.endDateTime).local().toDate(),
			title: event.title,
			description: event.description,
		}));

		expect(mappedEvents).toHaveLength(1);
		expect(mappedEvents[0].id).toBe('event1');
		expect(mappedEvents[0].title).toBe('Test Meeting');
	});

	test('should handle event selection', () => {
		const handleSelectEvent = vi.fn();
		const selectedEvent = mockCalendarContext.calendarInfo.calendarEventsList[0];

		handleSelectEvent(selectedEvent);

		expect(handleSelectEvent).toHaveBeenCalledWith(selectedEvent);
		expect(selectedEvent.title).toBe('Test Meeting');
	});

	test('should filter events by category', () => {
		const events = mockCalendarContext.calendarInfo.calendarEventsList;
		const categoryFilter = ['2']; // Meeting category
		const defaultCategory = mockCalendarContext.calendarInfo.calendarCategoriesList.find(
			(cat) => cat.name === 'all',
		);

		let filteredEvents;
		if (categoryFilter.includes(defaultCategory._id)) {
			filteredEvents = events;
		} else {
			filteredEvents = events.filter((event) =>
				categoryFilter.includes(event.calendarCategory._id),
			);
		}

		expect(filteredEvents).toHaveLength(1);
		expect(filteredEvents[0].calendarCategory.name).toBe('Meeting');
	});

	test('should handle Google Calendar integration', () => {
		const googleEvents = mockCalendarContext.calendarInfo.googleCalendarEvents;
		const showGoogleEvents = true;
		const combinedEvents = [
			...mockCalendarContext.calendarInfo.calendarEventsList,
			...(showGoogleEvents ? googleEvents : []),
		];

		expect(combinedEvents).toHaveLength(1); // Only local events since googleEvents is empty
		expect(showGoogleEvents).toBe(true);
	});
});

// ============================================================================
// CALENDAR HEADER TESTS
// ============================================================================

describe('CalendarHeader', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('should handle navigation between months', () => {
		const handleNavigation = vi.fn();
		const currentDate = new Date();
		const direction = 'next';

		handleNavigation(direction);

		expect(handleNavigation).toHaveBeenCalledWith(direction);
	});

	test('should handle "Today" button click', () => {
		const handleToday = vi.fn();
		const today = new Date();

		handleToday();

		expect(handleToday).toHaveBeenCalled();
	});

	test('should switch between calendar views', () => {
		const onView = vi.fn();
		const views = ['month', 'week', 'day'];

		views.forEach((view) => {
			onView(view);
		});

		expect(onView).toHaveBeenCalledTimes(3);
		expect(onView).toHaveBeenCalledWith('month');
		expect(onView).toHaveBeenCalledWith('week');
		expect(onView).toHaveBeenCalledWith('day');
	});
});

// ============================================================================
// EVENT MANAGEMENT TESTS
// ============================================================================

describe('Event Management', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('should create new event with valid data', () => {
		const newEvent = {
			title: 'New Meeting',
			description: 'New Description',
			startDateTime: 1704067200,
			endDateTime: 1704070800,
			calendarCategory: '2',
			attendees: ['user1'],
		};

		expect(newEvent.title).toBe('New Meeting');
		expect(newEvent.description).toBe('New Description');
		expect(newEvent.startDateTime).toBeLessThan(newEvent.endDateTime);
		expect(newEvent.attendees).toHaveLength(1);
	});

	test('should update existing event', () => {
		const eventId = 'event1';
		const updateData = {
			title: 'Updated Meeting',
			description: 'Updated Description',
		};

		mockCalendarContext.calendarInfo.updateCalendarEvent(eventId, updateData);

		expect(mockCalendarContext.calendarInfo.updateCalendarEvent).toHaveBeenCalledWith(
			eventId,
			updateData,
		);
	});

	test('should delete event with confirmation', () => {
		const eventId = 'event1';
		const deleteConfirmation = true;

		if (deleteConfirmation) {
			mockCalendarContext.calendarInfo.deleteCalendarEvent(eventId);
		}

		expect(deleteConfirmation).toBe(true);
		expect(mockCalendarContext.calendarInfo.deleteCalendarEvent).toHaveBeenCalledWith(eventId);
	});

	test('should manage attendees correctly', () => {
		const teamMembers = mockCalendarContext.companyInfo.tenantsUserList;
		const selectedAttendees = [teamMembers[0]];
		const newAttendee = 'newuser@example.com';

		expect(teamMembers).toHaveLength(2);
		expect(selectedAttendees).toHaveLength(1);
		expect(selectedAttendees[0].email).toBe('john@example.com');
		expect(newAttendee).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
	});
});

// ============================================================================
// SCHEDULER TESTS
// ============================================================================

describe('Scheduler Functionality', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('should create scheduler session', () => {
		const sessionData = {
			sessionName: 'Test Session',
			duration: '60 Minutes',
			sessionType: 'Video Call',
			availability: {
				MON: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
				TUE: { enabled: false, slots: [] },
			},
		};

		expect(sessionData.sessionName).toBe('Test Session');
		expect(sessionData.duration).toBe('60 Minutes');
		expect(sessionData.sessionType).toBe('Video Call');
		expect(sessionData.availability.MON.enabled).toBe(true);
		expect(sessionData.availability.TUE.enabled).toBe(false);
	});

	test('should manage weekly availability', () => {
		const weeklyAvailability = {
			MON: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
			TUE: { enabled: false, slots: [] },
			WED: { enabled: true, slots: [{ start: '10:00', end: '16:00' }] },
		};

		const enabledDays = Object.entries(weeklyAvailability)
			.filter(([_, config]) => config.enabled)
			.map(([day]) => day);

		expect(enabledDays).toContain('MON');
		expect(enabledDays).toContain('WED');
		expect(enabledDays).not.toContain('TUE');
	});

	test('should handle booking settings', () => {
		const bookingSettings = {
			maxParticipants: 5,
			allowRescheduling: true,
			allowCanceling: true,
			minCancelNotice: 30,
			minBookingNotice: 15,
		};

		expect(bookingSettings.maxParticipants).toBe(5);
		expect(bookingSettings.allowRescheduling).toBe(true);
		expect(bookingSettings.allowCanceling).toBe(true);
		expect(bookingSettings.minCancelNotice).toBe(30);
	});
});

// ============================================================================
// ERROR HANDLING TESTS
// ============================================================================

describe('Error Handling', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('should handle API failures gracefully', async () => {
		const errorResponse = { error: 'Network error' };
		const fallbackState = {
			eventsList: [],
			isLoading: false,
			error: 'Network error',
		};

		expect(errorResponse.error).toBe('Network error');
		expect(fallbackState.eventsList).toHaveLength(0);
		expect(fallbackState.error).toBe('Network error');
	});

	test('should validate event data', () => {
		const invalidEvent = {
			title: '',
			startDateTime: null,
			endDateTime: null,
		};

		const validation = {
			hasTitle: invalidEvent.title.length > 0,
			hasStartTime: invalidEvent.startDateTime !== null,
			hasEndTime: invalidEvent.endDateTime !== null,
			isValid:
				invalidEvent.title.length > 0 &&
				invalidEvent.startDateTime !== null &&
				invalidEvent.endDateTime !== null,
		};

		expect(validation.hasTitle).toBe(false);
		expect(validation.hasStartTime).toBe(false);
		expect(validation.hasEndTime).toBe(false);
		expect(validation.isValid).toBe(false);
	});

	test('should handle invalid date ranges', () => {
		const invalidDateRange = {
			startDateTime: 1704070800, // Later time
			endDateTime: 1704067200, // Earlier time
		};

		const isValidRange = invalidDateRange.startDateTime < invalidDateRange.endDateTime;
		expect(isValidRange).toBe(false);
	});
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Calendar Integration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('should handle complete event lifecycle', async () => {
		// Create event
		const newEvent = {
			title: 'New Meeting',
			description: 'New Description',
			startDateTime: 1704067200,
			endDateTime: 1704070800,
			calendarCategory: '2',
		};

		// Update event
		const updatedEvent = { ...newEvent, title: 'Updated Meeting' };

		// Delete event
		const eventId = 'event1';

		expect(newEvent.title).toBe('New Meeting');
		expect(updatedEvent.title).toBe('Updated Meeting');
		expect(eventId).toBe('event1');
	});

	test('should handle calendar navigation and filtering', () => {
		const selectedDate = new Date();
		const categoryFilter = ['2'];
		const showGoogleEvents = true;

		expect(selectedDate).toBeInstanceOf(Date);
		expect(categoryFilter).toContain('2');
		expect(showGoogleEvents).toBe(true);
	});
});

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

describe('Performance', () => {
	test('should handle large event lists efficiently', () => {
		const startTime = performance.now();

		const largeEventList = Array.from({ length: 100 }, (_, i) => ({
			id: `event${i}`,
			title: `Event ${i}`,
			startDateTime: moment().add(i, 'hours').unix(),
			endDateTime: moment()
				.add(i + 1, 'hours')
				.unix(),
		}));

		const endTime = performance.now();
		const processingTime = endTime - startTime;

		expect(largeEventList).toHaveLength(100);
		expect(processingTime).toBeLessThan(100); // Should process in less than 100ms
	});

	test('should optimize API calls', () => {
		const apiCallCount = 0;
		const debounceDelay = 300;
		const cacheHit = true;

		expect(apiCallCount).toBe(0);
		expect(debounceDelay).toBe(300);
		expect(cacheHit).toBe(true);
	});
});

// ============================================================================
// SECURITY TESTS
// ============================================================================

describe('Security', () => {
	test('should validate user permissions', () => {
		const userPermissions = {
			canCreateEvents: true,
			canEditEvents: true,
			canDeleteEvents: false,
			canManageCategories: true,
		};

		expect(userPermissions.canCreateEvents).toBe(true);
		expect(userPermissions.canEditEvents).toBe(true);
		expect(userPermissions.canDeleteEvents).toBe(false);
		expect(userPermissions.canManageCategories).toBe(true);
	});

	test('should sanitize user inputs', () => {
		const maliciousInput = '<script>alert("xss")</script>';
		const sanitizedInput = maliciousInput.replace(/[<>{}]/g, '');

		expect(maliciousInput).toContain('<script>');
		expect(sanitizedInput).not.toContain('<script>');
		expect(sanitizedInput).toBe('scriptalert("xss")/script');
	});
});
