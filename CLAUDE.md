# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ve AI Dashboard is a cross-platform Electron-based desktop application built with React and Vite. It serves as an intelligent AI assistant that helps users with task management, document handling, calendar integration, and real-time collaboration. The app features a modular architecture with dual source directories (`src/` and `builderSrc/`) for different application contexts.

## Development Commands

## Plan & Review

# Before starting work

-   Always in plan mode to make a plan
-   After get the plan, make sure you Write the plan to .qwen/tasks/TASK_NAME.md.
-   The plan should be a detailed implementation plan and the reasoning behind them, as well as tasks broken down.
-   If the task require external knowledge or certain package, also research to get latest knowledge (Use Task tool for research)
-   Don't over plan it, always think MVP.
-   Once you write the plan, firstly ask me to review it. Do not continue until I approve the plan.

### While implementing

-   You should update the plan as you work.
-   After you complete tasks in the plan, you should update and append detailed descriptions of the changes you made, so following tasks can be easily hand over to other engineers.

### Essential Commands

-   `npm run dev` - Start Vite development server
-   `npm start` - Launch Electron app (run after `npm run dev` in separate terminal)
-   `npm run build` - Build for production (use `NODE_ENV=production` flag)
-   `npm run package` - Build and package Electron app
-   `npm run clean:build` - Clean all build artifacts (`dist-electron`, `build`, `dist`)

### Platform-Specific Packaging

-   `npm run package:mac` - Package for macOS
-   `npm run package:win` - Package for Windows
-   `npm run package:linux` - Package for Linux

### Code Quality

-   `npm run format` - Format code with Prettier (required before commits)
-   Build verification: Always run `npm run build` before committing

## Architecture Overview

### Dual Source Structure

-   **`src/`** - Main application source code (primary desktop app)
-   **`builderSrc/`** - Builder/design tools source code (secondary context)
-   **`electron/`** - Electron main process and preload scripts
-   **`public/`** - Static assets and manifest files

### State Management Pattern

Uses Context API with modular reducer pattern:

-   **Global State**: `src/context/ContextStates.jsx` combines all context providers
-   **Module Pattern**: Each feature has its own context folder with:
    -   `state.js` - Initial state definition
    -   `reducer.js` - State update logic
    -   `actions.js` - Action creators
    -   `actionTypes.js` - Action type constants
    -   `graphQlFunctions.js` - API integration (where applicable)

### Key Context Modules

-   `auth/` - Authentication and user sessions
-   `Chat/` - Real-time messaging and AI interactions
-   `Calendar/` - Scheduling and event management
-   `contacts/` - Contact and client management
-   `tasks/` - Task tracking and automation
-   `Gallery/` - Media and file management
-   `Templates/` - Document templates and forms
-   `automationBuilder/` - Workflow automation tools

### Routing System

Dynamic route loading based on workspace mode:

-   **Public Routes**: Landing pages, auth flows (`/`, `/onboarding`, etc.)
-   **Workspace Routes**: Dynamically imported based on `workspaceMode`:
    -   `stable` → `stableRoutes.jsx`
    -   `beta` → `betaRoutes.jsx`
    -   `internal` → `internalRoutes.jsx`
    -   `suspended` → `suspendedRoute.jsx`
-   **Route Hook**: `useWorkspaceMode()` handles workspace detection and route selection

### Technology Stack Integration

-   **UI Framework**: React 18 with functional components and hooks
-   **Styling**: Sass/SCSS with modular component styles
-   **Component Library**: Ant Design (antd) for UI components
-   **Data Layer**: Apollo Client + GraphQL for API communication
-   **Build Tool**: Vite with optimized dependency bundling
-   **Testing**: Vitest with jsdom environment
-   **Desktop**: Electron with auto-updater functionality

### API and Services

-   **GraphQL**: Centralized in `src/services/graphQlServices.jsx`
-   **Configuration**: Environment-based config (`config.dev.js`, `config.live.js`)
-   **Error Handling**: Centralized error logging in `services/api/errorLogger.js`

## Clean Code Standards

### Core Principles

Following industry-leading practices from React, VS Code, Next.js, and other high-quality codebases:

#### Single Responsibility Principle

-   Each function/component should have one clear purpose
-   Maximum function length: 20 lines (excluding comments)
-   If a function does more than one thing, split it

#### Composition Over Inheritance

-   Prefer functional composition and hooks over class inheritance
-   Use Higher-Order Components (HOCs) and render props sparingly
-   Favor custom hooks for reusable stateful logic

### Function Design Standards

#### Parameter Management

```javascript
// ✅ Good: Use object destructuring for multiple parameters
function createUser({ name, email, role = 'user', permissions = [] }) {
	// Implementation
}

// ❌ Avoid: Too many individual parameters
function createUser(name, email, role, permissions, department, startDate) {}
```

#### Return Value Consistency

```javascript
// ✅ Good: Consistent return patterns
async function fetchUserData(id) {
	try {
		const user = await userApi.getUser(id);
		return { data: user, error: null };
	} catch (error) {
		logger.error('Failed to fetch user', { id, error });
		return { data: null, error };
	}
}
```

### Component Architecture Standards

#### Component Organization

```
src/
├── components/           # Shared UI components
│   └── Button/
│       ├── Button.tsx    # Component implementation
│       └── button.module.scss
├── features/             # Feature-specific components
│   └── auth/
│       ├── components/   # Feature components
│       ├── hooks/       # Feature hooks
│       ├── services/    # Feature services
│       ├── types/       # Feature types
│       └── utils/       # Feature utilities
```

#### Component Structure

```javascript
// ✅ Good: Clear component structure
import { memo, useCallback } from 'react';
import s from './button.module.scss';

const Button = memo(
	({ variant = 'primary', size = 'medium', disabled = false, children, onClick }) => {
		const handleClick = useCallback(() => {
			if (!disabled && onClick) {
				onClick();
			}
		}, [disabled, onClick]);

		return (
			<button
				className={`${s.button} ${s[`button--${variant}`]} ${s[`button--${size}`]}`}
				disabled={disabled}
				onClick={handleClick}
			>
				{children}
			</button>
		);
	},
);

Button.displayName = 'Button';

export default Button;
```

### File and Folder Organization

#### Naming Conventions

-   **Components**: PascalCase (`ChatBox.jsx`, `UserProfile.jsx`)
-   **Hooks**: camelCase with `use` prefix (`useWorkspaceMode.js`, `useAuthState.js`)
-   **Utilities**: camelCase (`dateUtils.js`, `apiHelpers.js`)
-   **Constants**: SCREAMING_SNAKE_CASE in dedicated files (`API_ENDPOINTS.js`)
-   **Services**: camelCase with service suffix (`userService.js`, `authService.js`)
-   **Context**: PascalCase with Context suffix (`UserContext.js`, `AuthContext.js`)

#### Directory Structure Rules

-   **Feature Isolation**: Features cannot import from other features directly
-   **Unidirectional Flow**: shared → features → app
-   **Colocation**: Keep related files close together
-   **Index Files**: Use index files for clean exports

### State Management Standards

#### Robust Context + Reducer Pattern (Redux-inspired)

Following patterns from Redux Toolkit, Zustand, and React's own documentation:

```javascript
// actionTypes.js - Centralized action constants
export const USER_ACTIONS = {
	FETCH_START: 'USER/FETCH_START',
	FETCH_SUCCESS: 'USER/FETCH_SUCCESS',
	FETCH_ERROR: 'USER/FETCH_ERROR',
	UPDATE_START: 'USER/UPDATE_START',
	UPDATE_SUCCESS: 'USER/UPDATE_SUCCESS',
	UPDATE_ERROR: 'USER/UPDATE_ERROR',
	RESET: 'USER/RESET',
};

// actions.js - Action creators with consistent patterns
export const userActions = {
	fetchStart: () => ({ type: USER_ACTIONS.FETCH_START }),
	fetchSuccess: (user) => ({ type: USER_ACTIONS.FETCH_SUCCESS, payload: user }),
	fetchError: (error) => ({ type: USER_ACTIONS.FETCH_ERROR, payload: error }),
	updateStart: () => ({ type: USER_ACTIONS.UPDATE_START }),
	updateSuccess: (user) => ({ type: USER_ACTIONS.UPDATE_SUCCESS, payload: user }),
	updateError: (error) => ({ type: USER_ACTIONS.UPDATE_ERROR, payload: error }),
	reset: () => ({ type: USER_ACTIONS.RESET }),
};
```

#### State Structure and Reducer

```javascript
// state.js - Initial state with consistent shape
export const initialUserState = {
	data: null,
	loading: false,
	error: null,
	lastFetched: null,
};

// reducer.js - Pure reducer following Redux patterns
import { USER_ACTIONS } from './actionTypes';
import { initialUserState } from './state';

export const userReducer = (state, action) => {
	switch (action.type) {
		case USER_ACTIONS.FETCH_START:
		case USER_ACTIONS.UPDATE_START:
			return {
				...state,
				loading: true,
				error: null,
			};

		case USER_ACTIONS.FETCH_SUCCESS:
			return {
				...state,
				data: action.payload,
				loading: false,
				error: null,
				lastFetched: Date.now(),
			};

		case USER_ACTIONS.UPDATE_SUCCESS:
			return {
				...state,
				data: { ...state.data, ...action.payload },
				loading: false,
				error: null,
			};

		case USER_ACTIONS.FETCH_ERROR:
		case USER_ACTIONS.UPDATE_ERROR:
			return {
				...state,
				loading: false,
				error: action.payload,
			};

		case USER_ACTIONS.RESET:
			return initialUserState;

		default:
			return state;
	}
};
```

#### Context Provider with Actions

```javascript
// UserContext.js - Context with built-in actions
import { createContext, useContext, useReducer, useCallback } from 'react';
import { userReducer, initialUserState } from './reducer';
import { userActions } from './actions';
import { userService } from '../services/userService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [state, dispatch] = useReducer(userReducer, initialUserState);

	// Async actions with built-in error handling
	const fetchUser = useCallback(async (id) => {
		dispatch(userActions.fetchStart());
		try {
			const user = await userService.getUser(id);
			dispatch(userActions.fetchSuccess(user));
		} catch (error) {
			dispatch(userActions.fetchError(error.message));
		}
	}, []);

	const updateUser = useCallback(
		async (updates) => {
			dispatch(userActions.updateStart());
			try {
				const updatedUser = await userService.updateUser(state.data.id, updates);
				dispatch(userActions.updateSuccess(updatedUser));
			} catch (error) {
				dispatch(userActions.updateError(error.message));
			}
		},
		[state.data?.id],
	);

	const resetUser = useCallback(() => {
		dispatch(userActions.reset());
	}, []);

	const value = {
		...state,
		actions: {
			fetchUser,
			updateUser,
			resetUser,
		},
	};

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook with error handling
export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
};
```

#### Advanced State Management Patterns

```javascript
// ✅ Optimistic Updates Pattern (used in Apollo Client, React Query)
const useOptimisticUpdate = () => {
	const { state, actions } = useUser();

	const optimisticUpdate = useCallback(
		async (updates) => {
			// Immediately update UI
			const optimisticData = { ...state.data, ...updates };
			dispatch(userActions.updateSuccess(optimisticData));

			try {
				// Perform actual update
				const realData = await userService.updateUser(state.data.id, updates);
				dispatch(userActions.updateSuccess(realData));
			} catch (error) {
				// Revert on error
				dispatch(userActions.fetchSuccess(state.data));
				dispatch(userActions.updateError(error.message));
			}
		},
		[state.data],
	);

	return optimisticUpdate;
};

// ✅ Middleware Pattern (Redux DevTools compatible)
const createContextWithMiddleware = (reducer, initialState, middleware = []) => {
	return (props) => {
		const [state, baseDispatch] = useReducer(reducer, initialState);

		const dispatch = useCallback(
			(action) => {
				middleware.forEach((mw) => mw(action, state));
				return baseDispatch(action);
			},
			[state],
		);

		return { state, dispatch };
	};
};

// ✅ Selector Pattern (preventing unnecessary re-renders)
export const useUserSelector = (selector) => {
	const { state } = useUser();
	return useMemo(() => selector(state), [state, selector]);
};

// Usage:
const userName = useUserSelector((state) => state.data?.name);
const isLoading = useUserSelector((state) => state.loading);
```

### Performance Standards

#### Code Splitting

```javascript
// ✅ Good: Route-based code splitting
import { lazy } from 'react';

const UserProfile = lazy(() => import('../features/user/UserProfile'));
const Dashboard = lazy(() => import('../features/dashboard/Dashboard'));

// Component-based splitting for expensive components
const Chart = lazy(() => import('../components/Chart'));
```

#### Memory Management

```javascript
// ✅ Good: Proper cleanup in useEffect
import { useEffect } from 'react';

useEffect(() => {
	const controller = new AbortController();

	fetchData(controller.signal).then(setData).catch(handleError);

	return () => {
		controller.abort();
	};
}, []);
```

### Security Standards

#### Input Validation

```javascript
// ✅ Good: Robust validation patterns used in high-quality codebases
const ValidationError = class extends Error {
	constructor(field, message) {
		super(`${field}: ${message}`);
		this.name = 'ValidationError';
		this.field = field;
	}
};

// Validation utilities (inspired by Yup, Joi patterns)
const validators = {
	required: (value, field) => {
		if (value === null || value === undefined || value === '') {
			throw new ValidationError(field, 'is required');
		}
	},

	string: (value, field) => {
		if (typeof value !== 'string') {
			throw new ValidationError(field, 'must be a string');
		}
	},

	email: (value, field) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(value)) {
			throw new ValidationError(field, 'must be a valid email');
		}
	},

	minLength: (min) => (value, field) => {
		if (value.length < min) {
			throw new ValidationError(field, `must be at least ${min} characters`);
		}
	},

	maxLength: (max) => (value, field) => {
		if (value.length > max) {
			throw new ValidationError(field, `must be at most ${max} characters`);
		}
	},

	number: (value, field) => {
		if (typeof value !== 'number' || isNaN(value)) {
			throw new ValidationError(field, 'must be a valid number');
		}
	},

	integer: (value, field) => {
		if (!Number.isInteger(value)) {
			throw new ValidationError(field, 'must be an integer');
		}
	},

	range: (min, max) => (value, field) => {
		if (value < min || value > max) {
			throw new ValidationError(field, `must be between ${min} and ${max}`);
		}
	},
};

// Schema-based validation (inspired by Yup)
const userSchema = {
	name: [
		validators.required,
		validators.string,
		validators.minLength(1),
		validators.maxLength(100),
	],
	email: [validators.required, validators.string, validators.email],
	age: [validators.number, validators.integer, validators.range(0, 150)],
};

function validateSchema(data, schema) {
	const errors = [];

	Object.entries(schema).forEach(([field, fieldValidators]) => {
		const value = data[field];

		fieldValidators.forEach((validator) => {
			try {
				validator(value, field);
			} catch (error) {
				if (error instanceof ValidationError) {
					errors.push(error);
				}
			}
		});
	});

	if (errors.length > 0) {
		const errorMessage = errors.map((e) => e.message).join(', ');
		throw new Error(`Validation failed: ${errorMessage}`);
	}

	return data;
}

// Usage
function createUser(userData) {
	const validatedData = validateSchema(userData, userSchema);
	return new User(validatedData);
}
```

#### Environment Variable Management

```javascript
// ✅ Good: Validate required environment variables
const config = {
	apiUrl: process.env.REACT_APP_API_URL,
	apiKey: process.env.REACT_APP_API_KEY,
};

// Validate at startup
Object.entries(config).forEach(([key, value]) => {
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
});
```

### Testing Standards

#### Test Organization

```javascript
// ✅ Good: Comprehensive test structure
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import UserProfile from '../UserProfile';

describe('UserProfile Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Rendering', () => {
		it('renders user information correctly', () => {
			// Arrange
			const mockUser = { name: 'John Doe', email: 'john@example.com' };

			// Act
			render(<UserProfile user={mockUser} />);

			// Assert
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});
	});

	describe('Interactions', () => {
		it('calls onEdit when edit button is clicked', async () => {
			const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
			const onEdit = vi.fn();

			render(<UserProfile user={mockUser} onEdit={onEdit} />);

			await userEvent.click(screen.getByRole('button', { name: /edit/i }));

			expect(onEdit).toHaveBeenCalledWith(mockUser.id);
		});
	});
});
```

### Documentation Standards

#### Code Documentation

```javascript
/**
 * Calculates the final price including tax and applicable discounts
 *
 * @param {number} basePrice - The original price before any modifications
 * @param {number} taxRate - Tax rate as decimal (e.g., 0.1 for 10%)
 * @param {string} [discountCode] - Optional discount code for price reduction
 * @returns {number} The calculated final price after tax and discounts
 *
 * @example
 * const price = calculatePrice(100, 0.08, 'SAVE10');
 * console.log(price); // 97.2 (100 * 0.9 * 1.08)
 */
export function calculatePrice(basePrice, taxRate, discountCode) {
	// Implementation details
}
```

#### README and Component Documentation

-   **Purpose**: Clear explanation of what the component/module does
-   **Props/Parameters**: Document all inputs with types and examples
-   **Usage Examples**: Show common use cases
-   **Migration Notes**: Document breaking changes and migration paths

## Code Conventions

### Prettier Configuration (from package.json)

-   Print width: 100 characters
-   Tab width: 4 spaces (using tabs)
-   Trailing commas: always
-   Semicolons: required
-   Quotes: single quotes
-   **Important**: Always run `npm run format` before committing

### File Naming

-   React components: PascalCase (e.g., `ChatBox.jsx`)
-   Hooks: camelCase with `use` prefix (e.g., `useWorkspaceMode.js`)
-   Context files: camelCase with descriptive names
-   SCSS files: kebab-case matching component names

### Component Structure

-   Use functional components with hooks
-   Prefer `memo()` for performance optimization where needed
-   Custom hooks for reusable logic
-   Context for cross-component state management

## Build Configuration Notes

### Vite Configuration

-   Base path: `'./'` for Electron compatibility
-   Build output: `build/` directory
-   Electron output: `dist-electron/` directory
-   Bundle analysis available via `npm run build:analyze`
-   Optimized dependencies include React, Ant Design, lodash, axios, and BlockNote

### Electron Builder

-   App ID: `com.veai.dashboard`
-   Multi-platform builds supported (macOS, Windows, Linux)
-   Auto-updater integration with GitHub releases
-   Hardened runtime enabled for macOS with entitlements

## Testing Setup

-   Vitest with jsdom environment
-   Setup files: `src/setupTests.js` and `src/tests/setup.js`
-   MSW (Mock Service Worker) for API mocking
-   Coverage reports with v8 provider

## Important Notes

-   Never commit `build/`, `dist/`, or `dist-electron/` directories
-   The app uses HashRouter for Electron compatibility
-   Workspace mode determines available features and routing
-   Auto-updater checks for updates on app launch
-   Both source directories (`src/` and `builderSrc/`) may need consideration for features spanning contexts

## Code Review Checklist

Before submitting code, ensure:

### ✅ Code Quality

-   [ ] Functions follow single responsibility principle
-   [ ] No functions exceed 20 lines (excluding comments)
-   [ ] All TypeScript types are properly defined
-   [ ] Error handling is comprehensive and consistent
-   [ ] Performance patterns are applied (memoization, lazy loading)

### ✅ Security

-   [ ] All user inputs are validated
-   [ ] No sensitive data in logs or error messages
-   [ ] Environment variables are properly managed
-   [ ] XSS protection is in place for dynamic content

### ✅ Testing

-   [ ] Unit tests cover all new functionality
-   [ ] Integration tests cover user workflows
-   [ ] Tests follow Arrange-Act-Assert pattern
-   [ ] Mock external dependencies properly

### ✅ Documentation

-   [ ] Complex functions have JSDoc comments
-   [ ] Public APIs are documented with examples
-   [ ] README is updated if needed
-   [ ] Breaking changes are noted

### ✅ Architecture

-   [ ] Feature isolation is maintained
-   [ ] Import rules are followed (no cross-feature imports)
-   [ ] Components are properly organized
-   [ ] State management follows established patterns
