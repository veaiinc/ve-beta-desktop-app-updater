import * as API from './oldActionTypes';
import service from '../services/index';
import _, { sortBy } from 'lodash';
import Service from '../services/graphQlServices';
import { getPageInfoApi } from '../context/Chat/graphQlFunctions';

/*
		----------------------------------------------------------------
					Login, Signin of User, Workspace Action				
		----------------------------------------------------------------
*/

export const verifyLoginWithPassword = async (payload) => {
	return await service.fetchPost(
		API.TENANT_USER_LOGIN_SIGNUP_API.loginWithPassword,
		payload,
		null,
		'tenant-users',
	);
};

export const accesibleWorkSpacesForUser = async (usertoken) => {
	return await service.fetchGet(API.TENANTS.accessibleTenants, usertoken, 'tenant-users');
};

export const loginIntoWorkSpace = async (tenantID, usertoken) => {
	return await service.fetchGet(API.TENANTS.url + tenantID + API.TENANTS.accesstoken, usertoken);
};
export const requestOTPToVerifyAccount = async (payload) => {
	return await service.fetchPost(
		API.TENANT_USER_LOGIN_SIGNUP_API.signup +
			API.TENANT_USER_LOGIN_SIGNUP_API.url +
			API.TENANT_USER_LOGIN_SIGNUP_API.requestOTP,
		payload,
	);
};

export const verifySignUpOTP = async (payload) => {
	return await service.fetchPost(
		API.TENANT_USER_LOGIN_SIGNUP_API.verifySignUpOTP,
		payload,
		null,
		'tenant-users',
	);
};

export const resendOTP = async (payload) => {
	return await service.fetchPost(
		API.TENANT_USER_LOGIN_SIGNUP_API.resendOTP,
		payload,
		null,
		'tenant-users',
	);
};

export const requestSignUp = async (payload) => {
	return await service.fetchPost(
		API.TENANT_USER_LOGIN_SIGNUP_API.signupRequest,
		payload,
		null,
		'tenant-users',
	);
};
export const requestInvitedSignUp = async (payload) => {
	return await service.fetchPost(
		API.TENANT_USER_LOGIN_SIGNUP_API.signupInvitedRequest,
		payload,
		null,
		'tenant-users',
	);
};
export const registerTenantUser = async (payload) => {
	return await service.fetchPost(
		API.TENANT_USER_LOGIN_SIGNUP_API.signup,
		payload,
		null,
		'tenant-users',
	);
};
export const verifyEmailAddress = async (payload) => {
	return await service.fetchPost(
		API.TENANT_USER_LOGIN_SIGNUP_API.verifyEmail,
		payload,
		null,
		'tenant-users',
	);
};
export const forgotPasswordEmail = async (payload) => {
	return await service.fetchPost(
		API.TENANT_USER_LOGIN_SIGNUP_API.forgotPassword,
		payload,
		null,
		'tenant-users',
	);
};
export const verifyAccountFromEmail = async (payload, path) => {
	return await service.fetchPost(
		path === '/user/reset-password'
			? API.TENANT_USER_LOGIN_SIGNUP_API.verifyResetPassword
			: API.TENANT_USER_LOGIN_SIGNUP_API.verifyAccount,
		payload,
		null,
		'tenant-users',
	);
};

export const updatePassword = async (payload, token) => {
	return await service.fetchPost(
		API.TENANT_USER_LOGIN_SIGNUP_API.updatePassword,
		payload,
		token,
		'tenant-users',
	);
};

export const set2FASettings = async (payload, token) => {
	return await service.fetchPut(
		API.TENANT_USER_LOGIN_SIGNUP_API.set2FASettings,
		payload,
		token,
		'tenant-users',
	);
};
export const get2FAStatus = async (email) => {
	return await service.fetchGet(
		API.TENANT_USER_LOGIN_SIGNUP_API.get2FAStatus + `?email=${email}`,
		null,
		'tenant-users',
	);
};
export const registerFor2FA = async (payload, token) => {
	return await service.fetchPost(
		API.TENANT_USER_LOGIN_SIGNUP_API.set2FASettings +
			API.TENANT_USER_LOGIN_SIGNUP_API.googleAuthenticator +
			'/authenticate',
		payload,
		token,
		'tenant-users',
	);
};

export const get2FAQrCode = async (token) => {
	return await service.fetchGet(
		API.TENANT_USER_LOGIN_SIGNUP_API.set2FASettings +
			API.TENANT_USER_LOGIN_SIGNUP_API.googleAuthenticator +
			API.TENANT_USER_LOGIN_SIGNUP_API.qrCode,

		token,
		'tenant-users',
	);
};

export const userDetails = async (usertoken) => {
	return await service.fetchGet(API.TENANTS.myProfile, usertoken, 'tenant-users');
};

export const updateUserDetails = async (payload, usertoken) => {
	return await service.fetchPut(API.TENANTS.myProfile, payload, usertoken, 'tenant-users');
};

//New Signup actions

export const signupLoveCoUserWithEmail = async (payload) => {
	return await service.fetchPost(
		API.LOVCO_TENANT_USER_LOGIN_SIGNUP_API.signup,
		payload,
		null,
		'tenant-users',
	);
};

export const verifyLoveCoAccountFromEmail = async (payload, path = null) => {
	return await service.fetchPost(
		API.LOVCO_TENANT_USER_LOGIN_SIGNUP_API.verifyEmail,
		/* path === '/loveco/user/reset-password'
			? API.TENANT_USER_LOGIN_SIGNUP_API.verifyResetPassword
			: API.TENANT_USER_LOGIN_SIGNUP_API.verifyEmail, */
		payload,
		null,
		'tenant-users',
	);
};

export const verifyLoveCoAccountFromLoginCode = async (payload) => {
	return await service.fetchPost(
		API.LOVCO_TENANT_USER_LOGIN_SIGNUP_API.verifyLoginCode,
		payload,
		null,
		'tenant-users',
	);
};

export const checkLoveCoEmailAccountExists = async (payload) => {
	return await service.fetchGet(
		API.LOVCO_TENANT_USER_LOGIN_SIGNUP_API.checkEmailAccountExists + `?email=${payload}`,
		null,
		'tenant-users',
	);
};

export const updateLoveCoProfile = async (payload, usertoken) => {
	return await service.fetchPut(
		API.LOVCO_TENANT_USER_LOGIN_SIGNUP_API.myProfile,
		payload,
		usertoken,
		'tenant-users',
	);
};
export const createTeamMemberAccount = async (payload) => {
	return await service.fetchPost(
		API.TENANT_USER_LOGIN_SIGNUP_API.signupInvitedUser,
		payload,
		null,
		'tenant-users',
	);
};

export const getLoveCoUserProfile = async (usertoken) => {
	return await service.fetchGet(
		API.LOVCO_TENANT_USER_LOGIN_SIGNUP_API.myProfile,
		usertoken,
		'tenant-users',
	);
};

export const registerLoveCoTenant = async (payload, usertoken) => {
	return await service.fetchPost(
		API.LOVCO_TENANT_USER_LOGIN_SIGNUP_API.registerTenant,
		payload,
		usertoken,
		'tenant',
	);
};

export const getLoveCoSubscriptionPlans = async (usertoken) => {
	return await service.fetchGet(
		API.LOVCO_TENANT_USER_LOGIN_SIGNUP_API.lovecoSubscriptionPlans,
		usertoken,
		'tenant',
	);
};

export const updateLoveCoBrandDetails = async (workspaceId, payload, usertoken) => {
	return await service.fetchPut(
		'/' + workspaceId + API.LOVECO_TENANTS.brandDetails,
		payload,
		usertoken,
		'tenant',
	);
};

export const checkLoveCoPhoneNumberAccountExists = async (payload, usertoken) => {
	return await service.fetchGet(
		API.LOVECO_TENANTS.accountWithPhoneNumber + `${payload}`,
		usertoken,
		'tenant-users',
	);
};

export const removeTenantUserToTeam = async (workspaceId, userId, usertoken) => {
	return await service.fetchDelete(
		`/${workspaceId}${API.TENANT_USER_LOGIN_SIGNUP_API.tenantUsers}/${userId}`,
		usertoken,
		null,
		'tenant',
	);
};

export const updateTenantUserRole = async (workspaceId, userId, payload, usertoken) => {
	return await service.fetchPut(
		`/${workspaceId}${API.TENANT_USER_LOGIN_SIGNUP_API.tenantUsers}/${userId}${API.TENANTS.role}`,
		payload,
		usertoken,
		'tenant',
	);
};

export const getTenantInvitations = async (workspaceId, usertoken) => {
	return await service.fetchGet(
		`/${workspaceId}${API.TENANTS.tenantInvitations}`,
		usertoken,
		'tenant',
	);
};

export const deleteTenantUserInvitation = async (workspaceId, invitationId, usertoken) => {
	return await service.fetchDelete(
		`/${workspaceId}${API.TENANTS.tenantInvitations}/${invitationId}`,
		usertoken,
		null,
		'tenant',
	);
};

export const requestStripeOrder = async (workspaceId, payload, token) => {
	return await service.fetchPost(
		`/${workspaceId}${API.TENANTS.subscriptions}`,
		payload,
		token,
		'tenant',
	);
};

export const getStripeBillingPortal = async (workspaceId, token) => {
	return await service.fetchGet(`/${workspaceId}${API.TENANTS.billing}`, token, 'tenant');
};

export const requestRazorPayOrder = async (workspaceId, subscriptionID, token) => {
	return await service.fetchPost(
		`/${workspaceId}${API.TENANTS.payments}/${subscriptionID}${API.TENANTS.requestRazorPayOrder}`,
		{},
		token,
		'tenant',
	);
};

export const requestLoveCoRazorPayOrder = async (payload, workspaceId, subscriptionID, token) => {
	return await service.fetchPost(
		`/loveco/${workspaceId}${API.LOVECO_TENANTS.payments}/${subscriptionID}${API.LOVECO_TENANTS.requestPaymentOrder}`,
		payload,
		token,
		'tenant',
	);
};

export const requestPaymentOrderForAICredits = async (workspaceId, payload, token) => {
	return await service.fetchPost(`/${workspaceId}/subscriptions`, payload, token, 'tenant');
};

export const requestPaymentOrderForUSMonthly = async (workspaceId, payload, token) => {
	return await service.fetchPost(
		`/${workspaceId}/monthly-subscription`,
		payload,
		token,
		'tenant',
	);
};
export const sendRazorPayResponse = async (workspaceId, receiptID, payload, token) => {
	return await service.fetchPost(
		`/${workspaceId}${API.TENANTS.payments}/${receiptID}${API.TENANTS.verifyPayment}`,
		payload,
		token,
		'tenant',
	);
};

export const getVariables = async (workspaceID, userToken, type) => {
	return await service.fetchGet('/' + workspaceID + API.TENANTS.variables, userToken, type);
};

export const createCustomVariable = async (workspaceID, json, usertoken, type) => {
	return await service.fetchPost(
		'/' + workspaceID + API.TENANTS.variables,
		json,
		usertoken,
		type,
	);
};

export const uploadImage = async (workspaceID, json, usertoken, type) => {
	return await service.fetchPost(
		workspaceID + API.TENANTS.workspaceAssets,
		json,
		usertoken,
		type,
	);
};

export const getImages = async (workspaceID, usertoken, type) => {
	return await service.fetchGet('/' + workspaceID + API.TENANTS.workspaceAssets, usertoken, type);
};

export const getLastTransactionDetails = async (workspaceId, usertoken) => {
	return await service.fetchGet(
		`/${workspaceId}${API.TENANTS.paymentStatus}`,
		usertoken,
		'tenant',
	);
};

export const getTenantSubscriptionDetails = async (workspaceId, token) => {
	return await service.fetchGet(
		`/${workspaceId}${API.TENANTS.subscriptionDetails}`,
		token,
		'tenant',
	);
};

export const getTenantBillingDetails = async (workspaceId, token) => {
	return await service.fetchGet(`/${workspaceId}${API.TENANTS.billingDetails}`, token, 'tenant');
};

export const getTenantInvoicePreferences = async (workspaceId, token) => {
	return await service.fetchGet(
		`/${workspaceId}${API.TENANTS.invoicePreferences}`,
		token,
		'tenant',
	);
};

export const putTenantInvoicePreferences = async (workspaceId, token, payload) => {
	return await service.fetchPut(
		`/${workspaceId}${API.TENANTS.invoicePreferences}`,
		payload,
		token,
		'tenant',
	);
};

export const postTeamMemberResendInvitation = async (workspaceId, token, payload) => {
	return await service.fetchPost(
		`/${workspaceId}/${API.TENANTS.resendInvitation}/${payload}`,
		{},
		token,
		'tenant',
	);
};
export const deleteTeamMemberResendInvitation = async (workspaceId, token, payload) => {
	return await service.fetchDelete(
		`/${workspaceId}/${API.TENANTS.resendInvitation}/${payload}`,
		token,
		null,
		'tenant',
	);
};

export const getSubscriptionPlans = async (workspaceID, usertoken) => {
	return await service.fetchGet(
		`/${workspaceID}${API.GALLERIES.subscriptionPlans}`,
		usertoken,
		'tenant',
	);
};
export const getCouponCode = async (workspaceID, usertoken, body) => {
	return await service.fetchPost(
		`/${workspaceID}/coupons/get-coupon-code`,
		body,
		usertoken,
		'tenant',
	);
};

export const getAICreditsPlan = async (workspaceID, usertoken) => {
	return await service.fetchGet(
		`/${workspaceID}${API.GALLERIES.aiCreditsPlan}`,
		usertoken,
		'tenant',
	);
};

export const postAICreditsPlan = async (workspaceID, subscriptionId, usertoken) => {
	return await service.fetchPost(
		`/${workspaceID}${API.GALLERIES.aiCreditsPlan}/${subscriptionId}`,
		{},
		usertoken,
		'tenant',
	);
};
export const getTenantUserUploadedPhotosGraph = async (workspaceID, userId, token, json) => {
	return await service.fetchGet(
		`/${workspaceID}${API.GALLERIES.url}${API.TENANTS.productivityDataWeeklyData}/${userId}${
			'?startDate=' + json.startDate + '&endDate=' + json.endDate
		}`,

		token,
	);
};
export const getTenantUserProductivityPhotoUploadData = async (
	workspaceID,
	userId,
	token,
	dateRange = null,
) => {
	return await service.fetchGet(
		`/${workspaceID}${API.GALLERIES.url}${API.TENANTS.productivityData}/${userId}${
			dateRange === null
				? ''
				: API.Proposals.createdAt +
				  dateRange.endDate +
				  API.Proposals.createdAtGt +
				  dateRange.startDate +
				  '&page=' +
				  dateRange.page +
				  API.Proposals.limit +
				  dateRange.limit
		}`,
		token,
	);
};

export const getTenantSettings = async (tenantID, token) => {
	return await service.fetchGet('/' + tenantID, token, 'tenant');
};

export const updateTenantBusinessName = async (workspaceId, payload, usertoken) => {
	return await service.fetchPut(
		`/${workspaceId}${API.TENANTS.businessName}`,
		payload,
		usertoken,
		'tenant',
	);
};

export const updateTenantWebsite = async (workspaceId, payload, usertoken) => {
	return await service.fetchPut(
		`/${workspaceId}${API.TENANTS.websiteUrl}`,
		payload,
		usertoken,
		'tenant',
	);
};

export const uploadTenantLogo = async (workspaceId, payload, token) => {
	return await service.fetchPost(`/${workspaceId}${API.TENANTS.logos}`, payload, token, 'tenant');
};

export const uploadShareLogo = async (workspaceId, payload, token) => {
	return await service.fetchPostFiles(
		`/${workspaceId}${API.TENANTS.metaLogos}`,
		payload,
		token,
		'tenant',
	);
};

export const uploadWaterMark = async (workspaceId, payload, token) => {
	return await service.fetchPostFiles(
		`/${workspaceId}${API.TENANTS.watermarks}`,
		payload,
		token,
		'tenant',
	);
};

export const getWatermarkList = async (workspaceId, token) => {
	return await service.fetchGet(`/${workspaceId}${API.TENANTS.watermarks}`, token, 'tenant');
};

export const deleteWatermark = async (workspaceID, token, profileId) => {
	return await service.fetchDelete(
		`/${workspaceID}${API.TENANTS.watermarks}/${profileId}`,
		token,
		null,
		'tenant',
	);
};

export const updatePrefernces = async (workspaceId, payload, token) => {
	return await service.fetchPut(
		`/${workspaceId}${API.TENANTS.preferences}`,
		payload,
		token,
		'tenant',
	);
};

export const userDetailsForIntercom = async (workspaceId, usertoken) => {
	return await service.fetchGet(`/${workspaceId}${API.TENANTS.intercom}`, usertoken, 'tenant');
};

/*

    -------------------------------------
                Proposal Actions
    -------------------------------------
    
*/

export const getTemplatesList = async (workspaceID, token, queryString, appVersion = null) => {
	let url =
		appVersion === null
			? `/${workspaceID}${API.Proposals.templates}?${queryString}`
			: `/${workspaceID}${API.Proposals.templates}?appVersion=${encodeURIComponent(
					appVersion,
			  )}&${queryString}`;
	return await service.fetchGet(url, token, 'proposal');
};

export const getProposalsList = async (workspaceID, token, type, appVersion = null) => {
	let url =
		appVersion === null
			? `/${workspaceID}/${type}`
			: `/${workspaceID}/${type}?appVersion=${encodeURIComponent(appVersion)}`;
	return await service.fetchGet(url, token, 'proposal');
};

export const getProposalsListAllOptions = async (
	workspaceID,
	token,
	pagination,
	sort = null,
	dates = null,
	status = null,
	title = null,
	dateRange = null,
) => {
	return await service.fetchGet(
		'/' +
			workspaceID +
			API.Proposals.url +
			(API.Proposals.page + pagination.page + API.Proposals.limit + pagination.limit) +
			(sort === null
				? ''
				: API.Proposals.sortBy + sort.sortBy + API.Proposals.sortType + sort.sortType) +
			(dates === null
				? ''
				: API.Proposals.startDate +
				  dates.startDate +
				  API.Proposals.endDate +
				  dates.endDate) +
			(status === null ? '' : API.Proposals.status + status) +
			(title === null ? '' : '&title=' + title) +
			(dateRange === null
				? ''
				: API.Proposals.createdAtGt +
				  dateRange.startDate +
				  API.Proposals.createdAtLt +
				  dateRange.endDate),
		token,
		'proposal',
	);
};

export const getProductivityProposalsListAllOptions = async (
	userID,
	workspaceID,
	token,
	sort,
	status = null,
	title = null,
	timestamp = null,
	dateRange = null,
) => {
	return await service.fetchGet(
		'/' +
			workspaceID +
			API.Proposals.url +
			API.TENANTS.productivityData +
			'/' +
			userID +
			API.Proposals.sort +
			sort +
			(status === null ? '' : API.Proposals.status + status) +
			(title === null ? '' : API.Proposals.search + title) +
			(timestamp === null
				? ''
				: sort === '-createdAt'
				? API.Proposals.createdAtLt + timestamp
				: sort === 'createdAt'
				? API.Proposals.createdAtGt + timestamp
				: sort === '-title'
				? API.Proposals.titleLt + timestamp
				: API.Proposals.titleGt + timestamp) +
			(dateRange === null
				? ''
				: API.Proposals.createdAtGt +
				  dateRange.startDate +
				  API.Proposals.createdAtLt +
				  dateRange.endDate +
				  '&page=' +
				  dateRange.page +
				  '&limit=' +
				  dateRange.limit),
		token,
		'proposal',
	);
};

export const getProposalInsights = async (workspaceID, token, dateRange = null, title = null) => {
	return await service.fetchGet(
		'/' + workspaceID + API.Proposals.insights + (title === null ? '' : '?title=' + title),
		// +
		// `${
		// 	dateRange === null
		// 		? ''
		// 		: '?createdAt>=' + dateRange.startDate + '&createdAt<=' + dateRange.endDate
		// }`,
		token,
		'proposal',
	);
};
export const getProductivityProposalInsights = async (
	userID,
	workspaceID,
	token,
	dateRange = null,
) => {
	return await service.fetchGet(
		'/' +
			workspaceID +
			API.Proposals.url +
			'/' +
			API.TENANTS.productivityInsights +
			'/' +
			userID +
			`${
				dateRange === null
					? ''
					: '?startDate=' + dateRange.startDate + '&endDate=' + dateRange.endDate
			}`,
		token,
		'proposal',
	);
};
export const getProposalsListWithTitle = async (workspaceID, token, type, query) => {
	return await service.fetchGet(
		`/${workspaceID}/${type}?${API.Proposals.title}${query}&appVersion=1.2`,
		token,
		'proposal',
	);
};

export const getProposalsListWithTitleAndStatus = async (
	workspaceID,
	token,
	type,
	timestamp = null,
	query,
	status,
) => {
	return await service.fetchGet(
		'/' +
			workspaceID +
			API.Proposals.urlParam +
			type +
			API.Proposals.createdAt +
			timestamp +
			API.Proposals.title +
			query +
			API.Proposals.status +
			status,
		token,
		'proposal',
	);
};

export const updateProposalNote = async (workspaceID, proposalID, json, token) => {
	return await service.fetchPut(
		'/' + workspaceID + API.Proposals.url + '/' + proposalID,
		json,
		token,
		'proposal',
	);
};

export const unmarkProposalStatus = async (workspaceID, proposalID, versionID, token) => {
	return await service.fetchPost(
		'/' +
			workspaceID +
			API.Proposals.url +
			'/' +
			proposalID +
			API.Proposals.versions +
			'/' +
			versionID +
			API.Proposals.unmarkStatus,
		{},
		token,
		'proposal',
	);
};

export const markProposalAsExpiry = async (workspaceID, proposalID, versionID, token) => {
	return await service.fetchPost(
		'/' + workspaceID + API.Proposals.url + '/' + proposalID + API.Proposals.expiry,
		{},
		token,
		'proposal',
	);
};

export const republishProposalExpiry = async (workspaceID, proposalID, versionID, json, token) => {
	return await service.fetchPut(
		'/' +
			workspaceID +
			API.Proposals.url +
			'/' +
			proposalID +
			API.Proposals.versions +
			'/' +
			versionID,
		json,
		token,
		'proposal',
	);
};

export const shareProposalViaEmail = async (workspaceID, proposalID, json, token) => {
	return await service.fetchPost(
		'/' + workspaceID + API.Proposals.url + '/' + proposalID + API.Proposals.shareViaEmail,
		json,
		token,
		'proposal',
	);
};

export const acceptRejectProposal = async (
	workspaceID,
	proposalID,
	versionID,
	type,
	json,
	token,
) => {
	return await service.fetchPost(
		'/' +
			workspaceID +
			API.Proposals.url +
			'/' +
			proposalID +
			API.Proposals.versions +
			'/' +
			versionID +
			(type === 'accept' ? API.Proposals.accept : API.Proposals.reject),
		json,
		token,
		'proposal',
	);
};

export const duplicateProposal = async (workspaceID, proposalID, type, json, token) => {
	return await service.fetchPost(
		'/' + workspaceID + '/' + type + '/' + proposalID + API.Proposals.duplicateProposal,
		json,
		token,
		'proposal',
	);
};
export const deleteProposal = async (proposalID, workspaceID, type, token) => {
	return await service.fetchDelete(
		'/' + workspaceID + '/' + type + '/' + proposalID,
		token,
		null,
		'proposal',
	);
};

export const createProposalWithTemplate = async (json, workspaceID, templateID, token) => {
	return await service.fetchPost(
		'/' + workspaceID + API.Templates.url + '/' + templateID + API.Templates.createProposal,
		json,
		token,
		'proposal',
	);
};
export const createBlankProposal = async (json, workspaceID, token, type) => {
	return await service.fetchPost('/' + workspaceID + '/' + type, json, token, 'proposal');
};

export const setTemplateStatus = async (json, templateID, workspaceID, token) => {
	return await service.fetchPut(
		'/' + workspaceID + API.Proposals.templates + '/' + templateID + '/status',
		json,
		token,
		'proposal',
	);
};

export const getProposalDetails = async (workspaceID, token, proposalID, versionID) => {
	return await service.fetchGet(
		`/${workspaceID}${API.Proposals.url}/${proposalID}`,
		token,
		'proposal',
	);
};

export const getProposalLogs = async (workspaceID, token, proposalID, versionID) => {
	return await service.fetchGet(
		`/${workspaceID}${API.Proposals.url}/${proposalID}${API.Proposals.versions}/${versionID}`,
		token,
		'proposal',
	);
};

export const getProposalVersionDetails = async (workspaceID, token, proposalID, versionID) => {
	return await service.fetchGet(
		`/${workspaceID}${API.Proposals.url}/${proposalID}${API.Proposals.versions}/${versionID}`,
		token,
		'proposal',
	);
};
export const getProposalsWeddingSummary = async (workspaceID, token, startDate, endDate) => {
	return await service.fetchPost(
		`/${workspaceID}${API.Proposals.url}/${API.Proposals.weddingSummary}`,
		{ startDate: startDate, endDate: endDate },
		token,
		'proposal',
	);
};
export const getProposalsSummary = async (workspaceID, token, startDate, endDate) => {
	return await service.fetchPost(
		`/${workspaceID}${API.Proposals.url}/${API.Proposals.summary}`,
		{ startDate: startDate, endDate: endDate },
		token,
		'proposal',
	);
};
export const getProposalsEventsSummary = async (workspaceID, token, startDate, endDate) => {
	return await service.fetchPost(
		`/${workspaceID}${API.Proposals.url}/${API.Proposals.eventDateSummary}`,
		{ startDate: startDate, endDate: endDate },
		token,
		'proposal',
	);
};

export const getProposalsAllEventsSummary = async (workspaceID, token, startDate, endDate) => {
	return await service.fetchPost(
		`/${workspaceID}${API.Proposals.url}/${API.Proposals.eventsSummary}`,
		{ startDate: startDate, endDate: endDate },
		token,
		'proposal',
	);
};
/*
-------------------------------------
                Project Actions
    -------------------------------------
*/

export const getTenantUserProjectList = async (
	tenantID,
	userID,
	isDetailed,
	usertoken,
	sortingField,
) => {
	return await service.fetchGet(
		'/' +
			tenantID +
			API.GALLERIES.url +
			API.GALLERIES.userID +
			userID +
			API.GALLERIES.detailed +
			isDetailed +
			API.GALLERIES.sortingField +
			sortingField +
			API.GALLERIES.pagination +
			false,
		usertoken,
	);
};

export const getGalleriesDefaultFilters = async (
	tenantID,
	userID,

	usertoken,
) => {
	return await service.fetchGet(
		'/' + tenantID + API.GALLERIES.url + '/galleriesDefaultFilters',
		usertoken,
	);
};
export const getGalleriesList = async (
	tenantID,
	userID,
	isDetailed,
	usertoken,
	sortingField,
	page,
	searchQuery,
	filterValue,
) => {
	return await service.fetchGet(
		'/' +
			tenantID +
			API.GALLERIES.url +
			API.GALLERIES.userID +
			userID +
			API.GALLERIES.detailed +
			isDetailed +
			API.GALLERIES.sortingField +
			sortingField +
			'&page=' +
			page +
			`${filterValue !== 'all' ? `&status=${filterValue}` : ''}` +
			`${searchQuery !== null ? `&title=${searchQuery}` : ''}`,
		usertoken,
	);
};

export const getSignedURLForProjects = async (tenantID, payload, usertoken) => {
	return await service.fetchPost(
		'/' + tenantID + API.PROJECTS.contentDistribution,
		payload,
		usertoken,
	);
};

export const editProject = async (tenantID, projectID, payload, token) => {
	return await service.fetchPut(
		'/' + tenantID + API.GALLERIES.galleryUrlWithSlash + projectID,
		payload,
		token,
	);
};

export const checkSlugAvailability = async (tenantID, usertoken, slug) => {
	return await service.fetchGet(
		'/' + tenantID + API.GALLERIES.url + API.GALLERIES.slug + slug,
		usertoken,
	);
};

export const createNewProject = async (tenantID, payload, token) => {
	return await service.fetchPost('/' + tenantID + API.GALLERIES.url, payload, token);
};

/*
------------------------------------------
Tenant User Action					
------------------------------------------
*/

export const getTeamMembersFilters = async (tenantID, usertoken, body) => {
	return await service.fetchGet(
		'/' + tenantID + API.TENANT_USER_LOGIN_SIGNUP_API.teamMembersFilters,
		usertoken,
		'tenant',
	);
};
export const getTenantUsers = async (tenantID, usertoken, body) => {
	return await service.fetchGet(
		'/' + tenantID + API.TENANT_USER_LOGIN_SIGNUP_API.tenantUsers,
		usertoken,
		'tenant',
	);
};
export const addTenantUsers = async (workspaceId, json, usertoken) => {
	return await service.fetchPost(
		'/' + workspaceId + API.TENANT_USER_LOGIN_SIGNUP_API.tenantUsers,
		json,
		usertoken,
		'tenant',
	);
};
export const getInvitedTenantUsers = async (tenantID, usertoken, body) => {
	return await service.fetchPost(
		'/' + tenantID + '/tenant-invitations-list',
		body,
		usertoken,
		'tenant',
	);
};

export const getTenantUsersList = async (tenantID, usertoken, json) => {
	return await service.fetchPost(
		'/' + tenantID + API.TENANT_USER_LOGIN_SIGNUP_API.tenantUsersList,
		json,
		usertoken,
		'tenant',
	);
};

export const getTenantGalleryInsights = async (
	tenantID,
	usertoken,
	category = null,
	role = null,
	sort = null,
	firstName = null,
	timestamp = null,
	dateRange = null,
) => {
	return await service.fetchGet(
		'/' +
			tenantID +
			API.GALLERIES.clientGalleryVisitors +
			API.GALLERIES.sortType +
			sort +
			(category && role
				? `&${API.GALLERIES.category}${category}&${API.GALLERIES.visitorRole}${role}`
				: category
				? `&${API.GALLERIES.category}${category}`
				: role
				? `&${API.GALLERIES.visitorRole}${role}`
				: '') +
			(firstName === null ? '' : API.GALLERIES.search + firstName) +
			(timestamp === null
				? ''
				: sort === '-createdAt'
				? API.GALLERIES.createdAtLt + timestamp
				: API.GALLERIES.createdAtGt + timestamp) +
			(dateRange === null || timestamp !== null
				? ''
				: API.GALLERIES.createdAtGt +
				  dateRange.startDate +
				  API.GALLERIES.createdAtLt +
				  dateRange.endDate),

		usertoken,
		'tenant',
	);
};

export const getGalleryInsightsFacesListDownload = async (
	tenantID,
	usertoken,
	role = null,
	firstName = null,
	dateRange = null,
) => {
	return await service.fetchGet(
		'/' +
			tenantID +
			API.GALLERIES.clientGalleryVisitors +
			API.GALLERIES.download +
			(dateRange === null
				? ''
				: `?${API.GALLERIES.createdAtGt}` +
				  dateRange.startDate +
				  API.GALLERIES.createdAtLt +
				  dateRange.endDate) +
			(role ? `&${API.GALLERIES.visitorRole}${role}` : '') +
			(firstName === null ? '' : API.GALLERIES.search + firstName),
		usertoken,
		'tenant',
	);
};

export const getClientGalleryVisitorListFilters = async (tenantID, usertoken) => {
	return await service.fetchGet(
		'/' + tenantID + API.GALLERIES.clientGalleryFilters,
		usertoken,
		'tenant',
	);
};

export const getGalleryInsights = async (tenantID, usertoken) => {
	return await service.fetchGet(
		'/' + tenantID + API.GALLERIES.galleryInsights,
		usertoken,
		'tenant',
	);
};

export const getTenantUserDetails = async (tenantUserId, workspaceId, usertoken) => {
	return await service.fetchGet(
		'/' + workspaceId + API.TENANTS.tenantUsers + '/' + tenantUserId,
		usertoken,
		'tenant',
	);
};

export const getTenantInviteDetails = async (inviteId, workspaceId, usertoken) => {
	return await service.fetchGet(
		'/' + workspaceId + API.TENANTS.tenantInvitations + '/' + inviteId,
		usertoken,
		'tenant',
	);
};

export const updateTenantUserAccessControls = async (
	tenantUserId,
	workspaceID,
	userToken,
	json,
) => {
	return await service.fetchPut(
		'/' +
			workspaceID +
			API.TENANTS.tenantUsers +
			'/' +
			tenantUserId +
			API.TENANTS.accessControls,
		json,
		userToken,
		'tenant',
	);
};
export const updateTenantUserDetails = async (tenantUserId, workspaceID, userToken, json) => {
	return await service.fetchPut(
		'/' + tenantUserId + API.TENANTS.updateTenant,
		json,
		userToken,
		'tenant-users',
	);
};

export const updateTenantInviteAccessControls = async (inviteId, workspaceId, usertoken, json) => {
	return await service.fetchPut(
		'/' + workspaceId + API.TENANTS.tenantInvitations + '/' + inviteId,
		json,
		usertoken,
		'tenant',
	);
};

export const resendTenantInvite = async (inviteId, workspaceId, usertoken) => {
	return await service.fetchPost(
		'/' + workspaceId + API.TENANTS.tenantInvitations + '/' + inviteId,
		{},
		usertoken,
		'tenant',
	);
};

export const getTenantPreferences = async (tenantID, token) => {
	return await service.fetchGet('/' + tenantID + API.TENANTS.preferences, token, 'tenant');
};

export const getTenantSubscriptionRecords = async (tenantID, token) => {
	return await service.fetchGet(
		'/' + tenantID + API.TENANTS.subscriptionRecords,
		token,
		'tenant',
	);
};

export const addTenantUser = async (tenantID, payload, token) => {
	return await service.fetchPost(
		'/' + tenantID + API.TENANTS.tenantUsers,
		payload,
		token,
		'tenant',
	);
};

export const checkTenantAvailability = async (payload, usertoken) => {
	return await service.fetchGet(
		API.TENANT_USER_LOGIN_SIGNUP_API.subdomainAwail + payload,
		usertoken,
		'tenant',
	);
};

export const createWorkspace = async (payload, usertoken) => {
	return await service.fetchPost(API.TENANTS.createWorkspace, payload, usertoken, 'tenant');
};

export const updateTenantSocialMediaProfile = async (workspaceID, payload, usertoken) => {
	return await service.fetchPut(
		'/' + workspaceID + API.TENANTS.socialMediaProfile,
		payload,
		usertoken,
		'tenant',
	);
};

export const updateTenantAddress = async (workspaceID, payload, usertoken) => {
	return await service.fetchPut(
		'/' + workspaceID + API.TENANTS.address,
		payload,
		usertoken,
		'tenant',
	);
};

export const updateTenantContactDetails = async (workspaceID, payload, usertoken) => {
	return await service.fetchPut(
		'/' + workspaceID + API.TENANTS.contactDetails,
		payload,
		usertoken,
		'tenant',
	);
};

export const getUserWorkspaceNotifications = async (workspaceID, usertoken, pageNumber) => {
	return await service.fetchGet(
		'/' + workspaceID + API.TENANTS.tenantUser + API.TENANTS.page + pageNumber,
		usertoken,
		'notifications',
	);
};

export const readAllNotifications = async (workspaceID, usertoken) => {
	return await service.fetchPut(
		'/' + workspaceID + API.TENANTS.tenantUser + API.TENANTS.markRead,
		{},
		usertoken,
		'notifications',
	);
};

export const getNotificationDetails = async (workspaceID, notificationID, usertoken) => {
	return await service.fetchGet(
		'/' + workspaceID + API.TENANTS.tenantUser + '/' + notificationID,
		usertoken,
		'notifications',
	);
};

export const getTenantUsageDetails = async (workspaceID, usertoken) => {
	return await service.fetchGet(
		`/${workspaceID}${API.TENANTS.usageDetails}`,
		usertoken,
		'tenant',
	);
};

export const getProjectLayoutSettings = async (projectID, usertoken) => {
	return await service.fetchGet(
		API.GALLERIES.galleryUrlWithSlash + projectID + API.PROJECTS.layoutSettings,
		usertoken,
	);
};

export const updateDefaultWorkspace = async (workspaceID, payload, usertoken) => {
	return await service.fetchPost(`/update-tenants-order`, payload, usertoken, 'tenant-users');
};

/*
------------------------------------------
FORMS Action					
------------------------------------------
*/

export const createForm = async (json, workspaceID, usertoken) => {
	return await service.fetchPost(
		'/' + workspaceID + API.TENANTS.tenantUser,
		json,
		usertoken,
		'form',
	);
};

export const getFormsList = async (
	workspaceID,
	usertoken,
	pagination = null,
	sort = null,
	search = null,
) => {
	return await service.fetchGet(
		'/' +
			workspaceID +
			API.TENANTS.tenantUser +
			(pagination !== null
				? API.FORMS.page + pagination.page + API.FORMS.limit + pagination.limit
				: '') +
			(pagination === null && sort !== null
				? API.GALLERIES.sortType + sort
				: sort !== null
				? API.GALLERIES.sortingField + sort
				: '') +
			(pagination === null && sort === null && search !== null
				? API.FORMS.title + search
				: search !== null
				? API.Proposals.title + search
				: ''),
		usertoken,
		'form',
	);
};

export const markFormStatus = async (formID, workspaceID, usertoken, status = null) => {
	return await service.fetchPut(
		'/' +
			workspaceID +
			API.TENANTS.tenantUser +
			'/' +
			formID +
			`${status === 'active' ? API.FORMS.markActive : API.FORMS.markInactive}`,
		{},
		usertoken,
		'form',
	);
};

export const makeFormDuplicate = async (formID, workspaceID, usertoken) => {
	return await service.fetchPost(
		'/' + workspaceID + API.TENANTS.tenantUser + '/' + formID + API.FORMS.duplicate,
		{},
		usertoken,
		'form',
	);
};

export const deleteForm = async (formID, workspaceID, usertoken) => {
	return await service.fetchDelete(
		'/' + workspaceID + API.TENANTS.tenantUser + '/' + formID,
		usertoken,
		{},
		'form',
	);
};

export const getSingleForm = async (formId, workspaceID, usertoken) => {
	return await service.fetchGet(
		'/' + workspaceID + API.TENANTS.tenantUser + '/' + formId,
		usertoken,
		'form',
	);
};
export const unlinkFormResponseFromProposal = async (formId, workspaceID, usertoken) => {
	return await service.fetchPut(
		'/' + workspaceID + API.Proposals.url + '/' + formId + API.Proposals.unlinkForm,
		{},
		usertoken,
		'proposal',
	);
};

export const getResponseStats = async (formId, json, workspaceID, usertoken) => {
	return await service.fetchGet(
		'/' +
			workspaceID +
			API.TENANTS.tenantUser +
			'/' +
			formId +
			API.FORMS.responses +
			API.FORMS.responsesStats +
			'?startDate=' +
			json.startDate +
			'&endDate=' +
			json.endDate +
			'&isActive=' +
			json.isActive,
		usertoken,
		'form',
	);
};

export const getResponseList = async (formId, json, pagination = null, workspaceID, usertoken) => {
	return await service.fetchGet(
		'/' +
			workspaceID +
			API.TENANTS.tenantUser +
			'/' +
			formId +
			API.FORMS.responses +
			'?startDate=' +
			json.startDate +
			'&endDate=' +
			json.endDate +
			'&isActive=' +
			json.isActive +
			'&sort=' +
			'-createdAt' +
			(pagination !== null
				? API.FORMS.andPage + pagination.page + API.FORMS.limit + pagination.limit
				: ''),
		usertoken,
		'form',
	);
};

export const deleteResponses = async (formID, json, workspaceID, usertoken) => {
	return await service.fetchDelete(
		'/' + workspaceID + API.TENANTS.tenantUser + '/' + formID + API.FORMS.responses,
		usertoken,
		json,
		'form',
	);
};

export const downloadResponses = async (formId, workspaceID, usertoken) => {
	return await service.fetchGet(
		'/' +
			workspaceID +
			API.TENANTS.tenantUser +
			'/' +
			formId +
			API.FORMS.responses +
			API.PROJECTS.download,
		usertoken,
		'form',
	);
};

/*
		----------------------------------------------------------------
					Notifications			
		----------------------------------------------------------------
*/

export const getNotifications = async (payload, workspaceId, token) => {
	return await service.fetchPost(
		`/${workspaceId}${API.NOTIFICATIONS.url}`,
		payload,
		token,
		'tenant',
	);
};

//VE conversations
export const getMetaIntegInfo = async (json) => {
	const workspaceId = localStorage.getItem('workspaceId');
	const usertoken = localStorage.getItem('usertoken');
	return await Service.query(
		getPageInfoApi,
		json,
		workspaceId,
		usertoken,
		've_conversations_api',
	);
};
