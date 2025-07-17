// Tests for the AuthState custom hook, which manages authentication logic such as account existence, verification, Google OAuth, and workspace creation.

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Cookies from 'js-cookie';
import { AuthState } from '../../context/auth/state';

// Mock the service module
vi.mock('../../services/', () => ({
	default: {
		fetchGet: vi.fn(),
		fetchPost: vi.fn(),
		fetchPut: vi.fn(),
	},
}));

// Mock helpers module
vi.mock('../../helpers', async () => {
	const actual = await vi.importActual('../../helpers');
	return {
		...actual,
		fetchDomainName: () => 've.ai',
	};
});

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock Cookies
vi.mock('js-cookie', () => ({
	default: {
		set: vi.fn(),
		get: vi.fn(),
		remove: vi.fn(),
	},
}));

// Mock window.location
const mockLocation = {
	href: '',
	hostname: 've.ai',
	replace: vi.fn(),
	reload: vi.fn(),
};
Object.defineProperty(window, 'location', {
	writable: true,
	value: mockLocation,
});

// Mock React Router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
	useNavigate: () => mockNavigate,
}));

const service = (await import('../../services')).default;

describe('AuthState hook', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockLocation.href = '';
		localStorageMock.getItem.mockReturnValue(null);
		Cookies.get.mockReturnValue(null);
	});

	// Tests for checking if an account exists using an email address.
	describe('checkAccountExistsUsingEmail', () => {
		it('returns account not exists when isAccountExist is false', async () => {
			service.fetchGet.mockResolvedValue([true, { isAccountExist: false }]);
			const { result } = renderHook(() => AuthState());

			const response = await act(() =>
				result.current.checkAccountExistsUsingEmail('test@example.com'),
			);

			expect(service.fetchGet).toHaveBeenCalledWith('/account-with-email', null, 'auth', {
				email: 'test@example.com',
			});
			expect(response).toEqual([true, { accountExists: false }]);
		});

		it('returns account exists and email verified when both are true', async () => {
			service.fetchGet.mockResolvedValue([
				true,
				{ isAccountExist: true, isEmailVerified: true },
			]);
			service.fetchPost.mockResolvedValue([true]);

			const { result } = renderHook(() => AuthState());

			const response = await act(() =>
				result.current.checkAccountExistsUsingEmail('test@example.com'),
			);

			expect(service.fetchGet).toHaveBeenCalledWith('/account-with-email', null, 'auth', {
				email: 'test@example.com',
			});
			expect(service.fetchPost).toHaveBeenCalledWith(
				'/request-login-otp',
				{ email: 'test@example.com' },
				null,
				'auth',
			);
			expect(response).toEqual([true, { accountExists: true, emailVerified: true }]);
		});

		it('returns account exists but email not verified', async () => {
			service.fetchGet.mockResolvedValue([
				true,
				{ isAccountExist: true, isEmailVerified: false },
			]);
			service.fetchPost.mockResolvedValue([true]);

			const { result } = renderHook(() => AuthState());

			const response = await act(() =>
				result.current.checkAccountExistsUsingEmail('test@example.com'),
			);

			expect(service.fetchPost).toHaveBeenCalledWith(
				'/email-verification-code',
				{ email: 'test@example.com' },
				null,
				'auth',
			);
			expect(response).toEqual([true, { accountExists: true, emailVerified: false }]);
		});

		it('handles API error gracefully', async () => {
			service.fetchGet.mockResolvedValue([false, { message: 'API Error' }]);

			const { result } = renderHook(() => AuthState());

			const response = await act(() =>
				result.current.checkAccountExistsUsingEmail('test@example.com'),
			);

			expect(response).toEqual([
				false,
				{ message: 'An unexpected error occurred. Please try again!' },
			]);
		});
	});

	// Tests for verifying the email verification code during signup or login.
	describe('verifyEmailVerificationCode', () => {
		it('stores tokens and workspace info on successful login', async () => {
			const mockResponse = {
				accessToken: 'token123',
				accessibleWorkspaces: [{ workspaceId: 'w1', isOnboard: true }],
				region: 'ap-south-1',
			};
			service.fetchPost.mockResolvedValue([true, mockResponse]);

			const { result } = renderHook(() => AuthState());

			const response = await act(() =>
				result.current.verifyEmailVerificationCode('test@example.com', '123456', true),
			);

			expect(service.fetchPost).toHaveBeenCalledWith(
				'/login-with-otp',
				{ email: 'test@example.com', otp: '123456' },
				null,
				'auth',
			);
			expect(localStorageMock.setItem).toHaveBeenCalledWith('usertoken', 'token123');
			expect(localStorageMock.setItem).toHaveBeenCalledWith('region', 'ap-south-1');
			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				'accessibleWorkspaces',
				JSON.stringify([{ workspaceId: 'w1', isOnboard: true }]),
			);
			expect(localStorageMock.setItem).toHaveBeenCalledWith('workspaceId', 'w1');
			expect(Cookies.set).toHaveBeenCalledWith('usertoken', 'token123', {
				sameSite: 'lax',
				domain: 've.ai',
			});
			expect(response[0]).toBe(true);
			expect(response[1]).toEqual({
				hasWorkspaces: true,
				isOnboard: true,
				workspaceId: 'w1',
			});
		});

		it('handles case when no workspaces are available', async () => {
			const mockResponse = {
				accessToken: 'token123',
				accessibleWorkspaces: [],
				region: 'ap-south-1',
			};
			service.fetchPost.mockResolvedValue([true, mockResponse]);

			const { result } = renderHook(() => AuthState());

			const response = await act(() =>
				result.current.verifyEmailVerificationCode('test@example.com', '123456', false),
			);

			expect(service.fetchPost).toHaveBeenCalledWith(
				'/verify-signup-email',
				{ email: 'test@example.com', verificationCode: '123456' },
				null,
				'auth',
			);
			expect(localStorageMock.setItem).toHaveBeenCalledWith('isOnboard', false);
			expect(response[0]).toBe(true);
			expect(response[1]).toEqual({
				hasWorkspaces: false,
				isOnboard: false,
			});
		});

		it('handles API error with custom message', async () => {
			service.fetchPost.mockResolvedValue([false, { message: 'Invalid OTP' }]);

			const { result } = renderHook(() => AuthState());

			const response = await act(() =>
				result.current.verifyEmailVerificationCode('test@example.com', '123456', true),
			);

			expect(response).toEqual([false, { message: 'Invalid OTP. Please try again!' }]);
		});
	});

	// Tests for Google OAuth redirection logic.
	describe('continueWithGoogle', () => {
		it('redirects to oauth url with location details when no user_id', async () => {
			localStorageMock.getItem.mockReturnValue(null);

			const { result } = renderHook(() => AuthState());

			await act(() => {
				result.current.continueWithGoogle({ country: 'IN' });
			});

			const encoded = encodeURIComponent(
				encodeURIComponent(JSON.stringify({ country: 'IN' })),
			);
			expect(mockLocation.href).toContain(`locationDetails=${encoded}`);
		});

		it('redirects to oauth url with referral code', async () => {
			localStorageMock.getItem.mockReturnValue(null);

			const { result } = renderHook(() => AuthState());

			await act(() => {
				result.current.continueWithGoogle({ country: 'US' }, 'REF123');
			});

			const encodedLocation = encodeURIComponent(
				encodeURIComponent(JSON.stringify({ country: 'US' })),
			);
			const encodedReferral = encodeURIComponent('REF123');
			expect(mockLocation.href).toContain(`locationDetails=${encodedLocation}`);
			expect(mockLocation.href).toContain(`referralCode=${encodedReferral}`);
		});

		it('redirects with visitor params when user_id exists', async () => {
			localStorageMock.getItem.mockReturnValue('user123');

			const { result } = renderHook(() => AuthState());

			await act(() => {
				result.current.continueWithGoogle({ country: 'IN' });
			});

			expect(mockLocation.href).toContain('isVisitor=true');
			expect(mockLocation.href).toContain('userId=user123');
		});
	});

	// Tests for creating an account using email.
	describe('createAccountUsingEmail', () => {
		it('creates account successfully for new user', async () => {
			service.fetchPost.mockResolvedValue([true]);

			const { result } = renderHook(() => AuthState());
			const locationDetails = { country: 'IN' };

			const response = await act(() =>
				result.current.createAccountUsingEmail('test@example.com', locationDetails),
			);

			expect(service.fetchPost).toHaveBeenCalledWith(
				'/signup',
				{ email: 'test@example.com', locationDetails },
				null,
				'auth',
			);
			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				'locationDetails',
				JSON.stringify(locationDetails),
			);
			expect(response).toEqual([true, { accountExists: true, emailVerified: false }]);
		});

		it('creates visitor account when user_id exists', async () => {
			localStorageMock.getItem.mockReturnValue('user123');
			service.fetchPost.mockResolvedValue([true]);

			const { result } = renderHook(() => AuthState());
			const locationDetails = { country: 'IN' };

			const response = await act(() =>
				result.current.createAccountUsingEmail('test@example.com', locationDetails),
			);

			expect(service.fetchPost).toHaveBeenCalledWith(
				'/visitor-signup',
				{ email: 'test@example.com', userId: 'user123' },
				null,
				'auth',
			);
			expect(response[0]).toBe(true);
		});
	});

	// Tests for workspace functionality.
	describe('workspace operations', () => {
		it('checks workspace handle availability', async () => {
			service.fetchGet.mockResolvedValue([true, { isAvailable: true }]);

			const { result } = renderHook(() => AuthState());

			const response = await act(() =>
				result.current.checkWorkspaceHandleAvailability('test-workspace'),
			);

			expect(service.fetchGet).toHaveBeenCalledWith(
				'/tenant/workspaceId-availability',
				null,
				'auth',
				{ workspaceId: 'test-workspace' },
			);
			expect(response).toEqual([true, { available: true }]);
		});

		it('creates workspace successfully', async () => {
			localStorageMock.getItem.mockReturnValue('token123');
			service.fetchPost.mockResolvedValue([
				true,
				{
					isOnboard: true,
					workspaceId: 'new-workspace',
					region: 'ap-south-1',
				},
			]);

			const { result } = renderHook(() => AuthState());

			const response = await act(() =>
				result.current.createWorkspace({
					workspaceHandle: 'new-workspace',
					workspaceType: 'business',
					businessName: 'Test Business',
				}),
			);

			expect(service.fetchPost).toHaveBeenCalledWith(
				'/tenant/create-workspace',
				{
					workspaceId: 'new-workspace',
					businessType: 'business',
					businessName: 'Test Business',
				},
				'token123',
				'auth',
			);
			expect(localStorageMock.setItem).toHaveBeenCalledWith('isOnboard', 'true');
			expect(localStorageMock.setItem).toHaveBeenCalledWith('workspaceId', 'new-workspace');
			expect(response[0]).toBe(true);
		});
	});

	// Tests for logout functionality.
	describe('logout functionality', () => {
		it('clears all authentication data from localStorage', () => {
			act(() => {
				localStorageMock.clear();
			});

			expect(localStorageMock.clear).toHaveBeenCalled();
		});

		it('removes authentication cookies', () => {
			act(() => {
				Cookies.remove('usertoken');
				Cookies.remove('workspaceId');
				Cookies.remove('region');
			});

			expect(Cookies.remove).toHaveBeenCalledWith('usertoken');
			expect(Cookies.remove).toHaveBeenCalledWith('workspaceId');
			expect(Cookies.remove).toHaveBeenCalledWith('region');
		});
	});

	// Tests for protected route authentication.
	describe('protected route authentication', () => {
		it('allows access when user has valid token and workspace', () => {
			localStorageMock.getItem
				.mockReturnValueOnce('valid-token')
				.mockReturnValueOnce('workspace-123');

			const isAuthenticated = () => {
				const usertoken = localStorageMock.getItem('usertoken');
				const workspaceId = localStorageMock.getItem('workspaceId');
				return !!(usertoken && workspaceId);
			};

			expect(isAuthenticated()).toBe(true);
		});

		it('denies access when user has no token', () => {
			localStorageMock.getItem.mockReturnValueOnce(null).mockReturnValueOnce('workspace-123');

			const isAuthenticated = () => {
				const usertoken = localStorageMock.getItem('usertoken');
				const workspaceId = localStorageMock.getItem('workspaceId');
				return !!(usertoken && workspaceId);
			};

			expect(isAuthenticated()).toBe(false);
		});

		it('redirects unauthenticated users to home page', () => {
			localStorageMock.getItem.mockReturnValue(null);

			const checkAuth = () => {
				if (!localStorageMock.getItem('usertoken')) {
					mockLocation.replace('/');
				}
			};

			act(() => {
				checkAuth();
			});

			expect(mockLocation.replace).toHaveBeenCalledWith('/');
		});
	});

	// Tests for token validation and expiry.
	describe('token validation and expiry', () => {
		it('detects expired token', () => {
			const payload = {
				exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
				sub: 'user123',
			};

			const mockToken = `header.${btoa(JSON.stringify(payload))}.signature`;

			const isTokenExpired = (token) => {
				try {
					const payload = JSON.parse(atob(token.split('.')[1]));
					const now = Math.floor(Date.now() / 1000);
					return payload.exp < now;
				} catch (error) {
					return true;
				}
			};

			expect(isTokenExpired(mockToken)).toBe(true);
		});

		it('detects valid token', () => {
			const payload = {
				exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
				sub: 'user123',
			};

			const mockToken = `header.${btoa(JSON.stringify(payload))}.signature`;

			const isTokenExpired = (token) => {
				try {
					const payload = JSON.parse(atob(token.split('.')[1]));
					const now = Math.floor(Date.now() / 1000);
					return payload.exp < now;
				} catch (error) {
					return true;
				}
			};

			expect(isTokenExpired(mockToken)).toBe(false);
		});

		it('handles invalid token format', () => {
			const invalidToken = 'invalid-token-format';

			const isTokenExpired = (token) => {
				try {
					const payload = JSON.parse(atob(token.split('.')[1]));
					const now = Math.floor(Date.now() / 1000);
					return payload.exp < now;
				} catch (error) {
					return true;
				}
			};

			expect(isTokenExpired(invalidToken)).toBe(true);
		});
	});

	// Tests for incorrect credentials handling.
	describe('incorrect credentials handling', () => {
		it('blocks login with invalid verification code', async () => {
			service.fetchPost.mockResolvedValue([false, { message: 'Invalid verification code' }]);

			const { result } = renderHook(() => AuthState());

			const response = await act(() =>
				result.current.verifyEmailVerificationCode('test@example.com', '000000', true),
			);

			expect(response).toEqual([
				false,
				{ message: 'Invalid verification code. Please try again!' },
			]);
			expect(localStorageMock.setItem).not.toHaveBeenCalledWith(
				'usertoken',
				expect.any(String),
			);
		});

		it('blocks login with expired verification code', async () => {
			service.fetchPost.mockResolvedValue([false, { message: 'Code expired' }]);

			const { result } = renderHook(() => AuthState());

			const response = await act(() =>
				result.current.verifyEmailVerificationCode('test@example.com', '123456', true),
			);

			expect(response).toEqual([false, { message: 'Code expired. Please try again!' }]);
		});
	});

	// Tests for token refresh functionality.
	describe('token refresh handling', () => {
		it('refreshes expired token automatically', async () => {
			const expiredToken = 'expired-token';
			localStorageMock.getItem.mockReturnValue(expiredToken);

			service.fetchPost.mockResolvedValue([true, { accessToken: 'new-token-123' }]);

			const { result } = renderHook(() => AuthState());

			const refreshToken = async () => {
				const response = await service.fetchPost(
					'/refresh-token',
					{},
					expiredToken,
					'auth',
				);
				if (response[0]) {
					localStorageMock.setItem('usertoken', response[1].accessToken);
					Cookies.set('usertoken', response[1].accessToken, {
						sameSite: 'lax',
						domain: 've.ai',
					});
				}
				return response;
			};

			const response = await act(() => refreshToken());

			expect(service.fetchPost).toHaveBeenCalledWith(
				'/refresh-token',
				{},
				expiredToken,
				'auth',
			);
			expect(localStorageMock.setItem).toHaveBeenCalledWith('usertoken', 'new-token-123');
			expect(Cookies.set).toHaveBeenCalledWith('usertoken', 'new-token-123', {
				sameSite: 'lax',
				domain: 've.ai',
			});
			expect(response[0]).toBe(true);
		});

		it('handles refresh token failure', async () => {
			const expiredToken = 'expired-token';
			localStorageMock.getItem.mockReturnValue(expiredToken);

			service.fetchPost.mockResolvedValue([false, { message: 'Refresh token invalid' }]);

			const { result } = renderHook(() => AuthState());

			const refreshToken = async () => {
				const response = await service.fetchPost(
					'/refresh-token',
					{},
					expiredToken,
					'auth',
				);
				if (!response[0]) {
					localStorageMock.clear();
					Cookies.remove('usertoken');
					mockLocation.replace('/');
				}
				return response;
			};

			const response = await act(() => refreshToken());

			expect(response[0]).toBe(false);
			expect(localStorageMock.clear).toHaveBeenCalled();
			expect(Cookies.remove).toHaveBeenCalledWith('usertoken');
			expect(mockLocation.replace).toHaveBeenCalledWith('/');
		});
	});

	// Tests for session persistence.
	describe('session persistence', () => {
		it('maintains login state after page refresh', () => {
			localStorageMock.getItem
				.mockReturnValueOnce('valid-token')
				.mockReturnValueOnce('workspace-123')
				.mockReturnValueOnce('ap-south-1');

			Cookies.get.mockReturnValue('valid-token');

			const checkSessionPersistence = () => {
				const token = localStorageMock.getItem('usertoken');
				const workspaceId = localStorageMock.getItem('workspaceId');
				const region = localStorageMock.getItem('region');
				const cookieToken = Cookies.get('usertoken');

				return !!(token && workspaceId && region && cookieToken);
			};

			expect(checkSessionPersistence()).toBe(true);
		});

		it('redirects to login when session data is incomplete', () => {
			localStorageMock.getItem
				.mockReturnValueOnce('valid-token')
				.mockReturnValueOnce(null)
				.mockReturnValueOnce('ap-south-1');

			const checkSessionPersistence = () => {
				const token = localStorageMock.getItem('usertoken');
				const workspaceId = localStorageMock.getItem('workspaceId');
				const region = localStorageMock.getItem('region');

				if (!token || !workspaceId || !region) {
					mockLocation.replace('/');
					return false;
				}
				return true;
			};

			expect(checkSessionPersistence()).toBe(false);
			expect(mockLocation.replace).toHaveBeenCalledWith('/');
		});
	});

	// Tests for essential edge cases.
	describe('essential edge cases', () => {
		it('handles network failure during API call', async () => {
			service.fetchGet.mockRejectedValue(new Error('Network error'));

			const { result } = renderHook(() => AuthState());

			await expect(
				act(() => result.current.checkAccountExistsUsingEmail('test@example.com')),
			).rejects.toThrow('Network error');
		});

		it('handles malformed API response', async () => {
			service.fetchGet.mockResolvedValue([true, null]);

			const { result } = renderHook(() => AuthState());

			const response = await act(() =>
				result.current.checkAccountExistsUsingEmail('test@example.com'),
			);

			expect(response).toEqual([true, { accountExists: false }]);
		});

		it('handles missing workspace data gracefully', async () => {
			const mockResponse = {
				accessToken: 'token123',
				accessibleWorkspaces: null,
				region: 'ap-south-1',
			};
			service.fetchPost.mockResolvedValue([true, mockResponse]);

			const { result } = renderHook(() => AuthState());

			const response = await act(() =>
				result.current.verifyEmailVerificationCode('test@example.com', '123456', true),
			);

			expect(localStorageMock.setItem).toHaveBeenCalledWith('isOnboard', false);
			expect(response[0]).toBe(true);
			expect(response[1]).toEqual({
				hasWorkspaces: false,
				isOnboard: false,
			});
		});
	});
});
