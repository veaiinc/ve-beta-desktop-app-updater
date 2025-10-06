/**
 * Helper functions for workspace-related operations
 */

/**
 * Checks if the current workspace is onboarded
 * @param {Array} userWorkSpaceList - List of user workspaces
 * @param {string} workspaceId - Current workspace ID
 * @returns {boolean} - True if workspace is onboarded, false otherwise
 */
export const isCurrentWorkspaceOnboarded = (userWorkSpaceList, workspaceId) => {
	if (!userWorkSpaceList || !workspaceId) {
		return false;
	}

	const currentWorkspaceData = userWorkSpaceList.filter(
		(workspace) => workspace?.activeWorkspaceId === workspaceId,
	);

	return currentWorkspaceData.length > 0 ? currentWorkspaceData[0]?.isOnboard : false;
};

/**
 * Checks if API calls should be made based on authentication and workspace onboard status
 * @param {string} usertoken - User authentication token
 * @param {Array} userWorkSpaceList - List of user workspaces (optional for onboarded check)
 * @param {string} workspaceId - Current workspace ID (optional for onboarded check)
 * @param {boolean} requireOnboarded - Whether to require workspace to be onboarded (default: true)
 * @returns {boolean} - True if API calls should be made, false otherwise
 */
export const shouldMakeApiCalls = (
	usertoken,
	userWorkSpaceList = null,
	workspaceId = null,
	requireOnboarded = true,
) => {
	// First check if user is authenticated
	if (!usertoken || usertoken.trim() === '') {
		return false;
	}

	// If we don't require onboarded status, just check authentication
	if (!requireOnboarded) {
		return true;
	}

	// If we require onboarded status but don't have workspace data yet, don't make calls
	if (!userWorkSpaceList || !workspaceId) {
		return false;
	}

	// Check if current workspace is onboarded
	return isCurrentWorkspaceOnboarded(userWorkSpaceList, workspaceId);
};

/**
 * Gets the current workspace ID from localStorage
 * @returns {string|null} - Current workspace ID or null if not found
 */
export const getCurrentWorkspaceId = () => {
	return localStorage.getItem('workspaceId');
};

/**
 * Gets the current user token from localStorage
 * @returns {string|null} - Current user token or null if not found
 */
export const getCurrentUserToken = () => {
	return localStorage.getItem('usertoken');
};
