import * as TenantsAction from './oldActions';
import { Component } from 'react';
import _ from 'lodash';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
import moment from 'moment';
import axios from 'axios';

const cookies = new Cookies();
class Tenant extends Component {
	getTenantPreferences = async (workspaceID = null, screenName = null) => {
		let tenantID = workspaceID === null ? localStorage.getItem('workspaceId') : workspaceID;

		let usertoken = await localStorage.getItem('usertoken');
		let tenantInfo = await TenantsAction.getTenantPreferences(tenantID, usertoken);

		if (tenantInfo[0] === true) {
			let selectedthemeOption = tenantInfo[1].theme
				? tenantInfo[1].theme === 'dark'
					? { value: 'dark', label: 'Dark' }
					: { value: 'light', label: 'Light' }
				: { value: 'dark', label: 'Dark' };

			if (tenantInfo[1].watermarkPosition === 'northwest') {
				this.setState({
					tpos: 10,
					rpos: 'auto',
					bpos: 'auto',
					lpos: 10,
				});
			}
			if (tenantInfo[1].watermarkPosition === 'north') {
				this.setState({
					tpos: 10,
					rpos: 10,
					bpos: 'calc(50% - 45px)',
					lpos: 'auto',
				});
			}
			if (tenantInfo[1].watermarkPosition === 'northeast') {
				this.setState({
					tpos: 10,
					rpos: 10,
					bpos: 'auto',
					lpos: 'auto',
				});
			}
			if (tenantInfo[1].watermarkPosition === 'west') {
				this.setState({
					tpos: 'calc(50% - 20px)',
					rpos: 'auto',
					bpos: 'auto',
					lpos: 10,
				});
			}
			if (tenantInfo[1].watermarkPosition === 'center') {
				this.setState({
					tpos: 'calc(50% - 20px)',
					rpos: 'auto',
					bpos: 'auto',
					lpos: 'calc(50% - 45px)',
				});
			}
			if (tenantInfo[1].watermarkPosition === 'east') {
				this.setState({
					tpos: 'calc(50% - 20px)',
					rpos: '10',
					bpos: 'auto',
					lpos: 'auto',
				});
			}
			if (tenantInfo[1].watermarkPosition === 'southwest') {
				this.setState({
					tpos: 'auto',
					rpos: 'auto',
					bpos: 10,
					lpos: 10,
				});
			}
			if (tenantInfo[1].watermarkPosition === 'south') {
				this.setState({
					tpos: 'auto',
					rpos: 'auto',
					bpos: 10,
					lpos: 'calc(50% - 45px)',
				});
			}
			if (tenantInfo[1].watermarkPosition === 'southeast') {
				this.setState({
					tpos: 'auto',
					rpos: 10,
					bpos: 10,
					lpos: 'auto',
				});
			}
			this.setState({
				isLoading: false,
				selectedthemeOption,
				projectTheme: tenantInfo[1].theme,
				watermarkUrl: null,
				theme: !_.has(tenantInfo[1], 'theme') ? 'dark' : tenantInfo[1].theme,

				canClientDownloadOriginals: tenantInfo[1].canClientDownloadOriginals,
				canClientDownloadOptimized: tenantInfo[1].canClientDownloadOptimized,
				canClientReview: tenantInfo[1].canClientReview,
				canClientSuggestEdits: tenantInfo[1].canClientSuggestEdits,
				watermarkPosition: tenantInfo[1].watermarkPosition,
				ctaPreferences: tenantInfo[1].ctaPreferences,
				watermarkProfileId: _.has(tenantInfo[1], 'watermarkProfileId')
					? tenantInfo[1].watermarkProfileId
					: null,
				isWaterMarkApply: tenantInfo[1].watermarkProfileId ? true : false,
				galleryVisitorsForm: _.pickBy(tenantInfo[1], function (v, k) {
					return k === 'isEnabled' || k === 'accessibleTo';
				}),
				visitorAccessArray: _.has(tenantInfo[1], 'accessibleTo')
					? tenantInfo[1].accessibleTo
					: [],
				allowClientsToSubscribe: _.has(tenantInfo[1], 'allowClientsToSubscribe')
					? tenantInfo[1]['allowClientsToSubscribe']
					: true,
				galleryAICreditsLimit: _.has(tenantInfo[1], 'galleryAICreditsLimit')
					? tenantInfo[1].galleryAICreditsLimit
					: 2000,
				maxAICreditsAllowed: _.has(tenantInfo[1], 'galleryAICreditsLimit')
					? tenantInfo[1].galleryAICreditsLimit
					: 2000,
			});
		}
	};

	getUserDetails = async () => {
		let usertoken = localStorage.getItem('usertoken');

		let response = await TenantsAction.userDetails(usertoken);

		if (response[0] === true) {
			this.setState({
				firstName: response[1].firstName,
				lastName: response[1].lastName,
				//phoneNumber: response[1].phoneNumber,
				email: response[1].email,
				is2FAConfigured: response[1].is2FAConfigured ? response[1].is2FAConfigured : false,
				is2FAEnabled: response[1].is2FAEnabled ? response[1].is2FAEnabled : false,
				currentFirstName: response[1].firstName,
				currentLastName: response[1].lastName,
				userId: response[1]._id,
				isUserDetailsLoading: false,
			});
		} else {
			localStorage.clear();
		}
	};
	getTenantUserUploadedPhotosGraph = async (workspaceId, userId, json) => {
		let usertoken = localStorage.getItem('usertoken');

		let response = await TenantsAction.getTenantUserUploadedPhotosGraph(
			workspaceId,
			userId,
			usertoken,
			json,
		);
		let months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		];
		if (response[0] == true) {
			let data = response[1];
			this.setState({
				chartData: {
					labels: data.map(
						(label) => `${months[label.month - 1]}${label.year}-week${label.week}`,
					),
					datasets: [
						{
							data: data.map((label) => label.count),
							borderColor: '#479a5f',
							backgroundColor: '#121212',
							label: 'Uploaded Photos',
						},
					],
				},
				isChartDataLoading: false,
			});
		}
	};
	getTenantUserProductivityPhotoUploadData = async (
		workspaceId,
		userId,
		dateRange = null,
		add = null,
	) => {
		let usertoken = localStorage.getItem('usertoken');

		let response = await TenantsAction.getTenantUserProductivityPhotoUploadData(
			workspaceId,
			userId,
			usertoken,
			dateRange,
		);

		if (response[0] === true) {
			this.setState(
				{
					uploadPhotosDetails:
						add == null
							? response[1].data
							: [...this.state.uploadPhotosDetails, ...response[1].data],
					tempUploadPhotosDetails:
						add == null
							? response[1].data
							: [...this.state.uploadPhotosDetails, ...response[1].data],
					hasNextPage: response[1].hasNextPage,
					totalPages: response[1].totalPages,
				},
				() => {
					this.computeSortChange();
				},
			);
		} else {
			console.log(response[0]);
		}
	};

	updateUserDetails = async (json) => {
		let usertoken = localStorage.getItem('usertoken');

		this.setState({ isLoading: true });

		toast.promise(
			new Promise(async (resolve, reject) => {
				let response = await TenantsAction.updateUserDetails(json, usertoken);
				if (response[0] === true) {
					this.setState({
						isLoading: false,
						isFormLoading: false,
						isDetailsSuccessMessage: true,
						firstName: response[1].firstName,
						lastName: response[1].lastName,
						//phoneNumber: response[1].phoneNumber,
						email: response[1].email,
						detailsSuccessMessage: 'Details Updated Successfully',
					});
					this.getUserDetails();
					resolve(true);
				} else {
					this.setState({ errorMessage: response[1].message, isFormLoading: false });
					reject(true);
				}
			}),
			{
				pending: 'Loading',
				success: 'Updated successfully',
				error: 'failed to update',
			},
			{
				theme: 'colored',
			},
		);
	};
	get2FAQrCode = async () => {
		let usertoken = localStorage.getItem('usertoken');
		let response = await TenantsAction.get2FAQrCode(usertoken);
		if (response[0] == true) {
			this.setState({
				qrCode: response[1].qrCode,
			});
		}
	};
	set2FASettings = async (is2FAEnabled) => {
		let usertoken = localStorage.getItem('usertoken');
		let json = {
			is2FAEnabled,
		};

		toast.promise(
			new Promise(async (resolve, reject) => {
				let response = await TenantsAction.set2FASettings(json, usertoken);
				if (response[0] === true) {
					this.setState({
						is2FAEnabled: response[1].is2FAEnabled,
						isSuccessMessage: true,
						successMessage: 'Two Factor Authentication Updated Successfully',
					});
					resolve(true);
				} else {
					this.setState({
						errorMessage: response[1].message,
						isPasswordLoading: false,
					});
					reject(true);
				}
			}),
			{
				pending: 'Loading',
				success: 'Two Factor Authentication Updated Successfully',
				error: 'Failed to Update Two Factor Authentication',
			},
			{
				theme: 'colored',
			},
		);
	};
	registerFor2FA = async () => {
		let usertoken = localStorage.getItem('usertoken');
		let json = {
			googleAuthCode: this.state.authenticatorAppPassword,
			password: this.state.accountPassword,
		};

		this.setState({
			isPasswordLoading: true,
		});
		let checkpasswordjson = {
			email: this.state.email.toLowerCase().trim(),
			password: this.state.accountPassword,
		};

		let passwordresponse = await TenantsAction.verifyLoginWithPassword(checkpasswordjson);
		if (passwordresponse[0] === true) {
			toast.promise(
				new Promise(async (resolve, reject) => {
					let response = await TenantsAction.registerFor2FA(json, usertoken);
					if (response[0] === true) {
						this.setState({
							qrCode: null,
							isPasswordLoading: false,
							isSuccessMessage: true,
							successMessage: 'Registered for 2FA Successfully',
						});

						resolve(true);
					} else {
						this.setState({
							errorMessage: response[1].message,
							isPasswordLoading: false,
						});
						reject(true);
					}
				}),
				{
					pending: 'Loading',
					success: 'Registered for 2FA Successfully',
					error: 'Failed toRegister for 2FA',
				},
				{
					theme: 'colored',
				},
			);
		} else {
			this.setState({
				isPasswordLoading: false,
				errorAccountPassword: true,
				errorAccountPasswordMessage: 'Incorrect Current Password',
			});
		}
	};
	updatePassword = async () => {
		let usertoken = localStorage.getItem('usertoken');
		let json = {
			password: this.state.newPassword,
		};
		this.setState({ isPasswordLoading: true });

		let checkpasswordjson = {
			email: this.state.email.toLowerCase().trim(),
			password: this.state.currentPassword,
		};

		let passwordresponse = await TenantsAction.verifyLoginWithPassword(checkpasswordjson);
		if (passwordresponse[0] === true) {
			toast.promise(
				new Promise(async (resolve, reject) => {
					let response = await TenantsAction.updatePassword(json, usertoken);
					if (response[0] === true) {
						this.setState({
							isPasswordLoading: false,
							isSuccessMessage: true,
							successMessage: 'Password Updated Successfully',
						});
						resolve(true);
					} else {
						this.setState({
							errorMessage: response[1].message,
							isPasswordLoading: false,
						});
						reject(true);
					}
				}),
				{
					pending: 'Loading',
					success: 'Password Updated Successfully',
					error: 'Failed to Update Password',
				},
				{
					theme: 'colored',
				},
			);
		} else {
			this.setState({
				isPasswordLoading: false,
				errorcurrentPassword: true,
				errorcurrentPasswordMessage: 'Incorrect Current Password',
			});
		}
	};

	submitAddTenantUser = async (json, isPage = null) => {
		let usertoken = localStorage.getItem('usertoken');
		toast.promise(
			new Promise(async (resolve, reject) => {
				let response = await TenantsAction.addTenantUser(
					this.props.match.params.workspaceID,
					json,
					usertoken,
				);
				if (response[0] === true) {
					this.setState(
						{
							isSubmitting: false,
							message: 'Invitation Sent',
							emailID: '',
						},
						() => {
							if (isPage) {
								this.props.history.push(
									`/${this.props.match.params.workspaceID}/users`,
								);
							} else {
								this.showAddTenantUserModal();
								this.getTeamMembers('detailed');
							}
							//this.getTenantInvitations();
						},
					);
					resolve(true);
				} else {
					this.setState({
						isSubmitting: false,
						errorMessage: response[1].message,
					});
					reject(true);
				}
			}),
			{
				pending: 'Loading',
				success: 'Invitation Sent',
				error: 'Failed to send Invite',
			},
			{
				theme: 'colored',
			},
		);
	};

	getTenantInvitations = async () => {
		let usertoken = localStorage.getItem('usertoken');

		let response = await TenantsAction.getTenantInvitations(
			this.props.match.params.workspaceID,
			usertoken,
		);

		if (response[0] === true) {
			//let list = this.state.list;
			let tenantUser = [];
			let mainFilterList = {
				all: [],
				active: [],
				deactivated: [],
				invited: [],
				admins: [],
				members: [],
				uninvited: [],
			};

			if (_.has(this.state, 'tenantUser')) {
				tenantUser = this.state.tenantUser;
				tenantUser = _.filter(tenantUser, (item, index) => {
					return item.filterType === 'active';
				});
			}

			//list[2]['length'] = response[1].length;
			response[1] = _.map(response[1], (item, indx) => {
				item.filterType = 'invited';
				item.memType = 'invited';
				item.title = item.inviteeEmail;
				return item;
			});

			if (_.has(this.state, 'mainFilterList')) {
				mainFilterList = this.state.mainFilterList;
				mainFilterList.all = _.filter(mainFilterList.all, (item) => {
					return item.memType !== 'uninvited';
				});
				mainFilterList.all = [
					...mainFilterList.all,
					...response[1],
					...mainFilterList.uninvited,
				];
				mainFilterList.invited = [...mainFilterList.invited, ...response[1]];
			}
			this.setState({
				mainFilterList,
				invitationDetails: response[1],
				tenantUser: [...tenantUser, ...response[1]],
				tempTenantUser: [...tenantUser, ...response[1]],
				isInvitationLoading: false,
				//list: list,
				//setList: false,
			});
		} else {
			this.setState({
				isInvitationLoading: false,
			});
		}
	};

	getTenantGalleryInsights = async (
		sort = null,
		category = null,
		role = null,
		firstName = null,
		timestamp = null,
		dateRange = null,
		isRefresh = true,
	) => {
		let usertoken = localStorage.getItem('usertoken');

		let response = await TenantsAction.getTenantGalleryInsights(
			this.props.match.params.workspaceID,
			usertoken,
			category,
			role,
			sort,
			firstName,
			timestamp,
			dateRange,
		);

		if (response[0] === true) {
			let List = [];
			if (isRefresh === false) {
				List = [...this.state.projInsightsFacesList, ...response[1][0].docs];
			} else {
				List = [...response[1][0].docs];
			}
			if (response[1][0].metadata.length === 0) {
				await this.setState({
					isVisitorListLoading: false,
					hasNextPage: false,
					lengthOfList: List.length === 0 ? 0 : this.state.lengthOfList,
					totalPages: List.length === 0 ? 0 : this.state.totalPages,
					projInsightsFacesList:
						List.length === 0 ? [] : this.state.projInsightsFacesList,
				});
			} else {
				let length =
					_.has(response[1][0].metadata[0], 'remainingDocs') === true
						? response[1][0].metadata[0].remainingDocs
						: this.state.lengthOfList;
				let totalPages = 1;

				totalPages = _.ceil(length / this.state.limit);

				await this.setState({
					page: isRefresh === true ? 1 : this.state.page + 1,
					isVisitorListLoading: false,
					projInsightsFacesList: List,
					lengthOfList: isRefresh === true ? length : this.state.lengthOfList,
					totalPages: isRefresh === true ? totalPages : this.state.totalPages,
				});
			}
			return true;
		} else {
			this.setState({
				isVisitorListLoading: false,
			});
			return false;
		}
	};

	getGalleryInsightsFacesListDownload = async (
		role = null,
		firstName = null,
		dateRange = null,
	) => {
		let usertoken = localStorage.getItem('usertoken');

		var response = await TenantsAction.getGalleryInsightsFacesListDownload(
			this.props.match.params.workspaceID,
			usertoken,
			role,
			firstName,
			dateRange,
		);

		if (response[0] === true) {
			response[1] = _.map(response[1], (item, index) => {
				return _.reduce(
					item,
					(result, value, key) => {
						if (key === 'lastName') {
							return { ...result, firstName: `${result.firstName} ${value}` };
						}
						if (key === 'category') {
							let temp =
								value === 'collection'
									? 'Selection view'
									: _.capitalize(value) + ' view';
							return { ...result, [key]: temp };
						}
						if (key === 'visitorRole') {
							let tempValue = value === 'master' ? 'client' : value;
							return { ...result, category: `${result.category};${tempValue}` };
						}
						return { ...result, [key]: value };
					},
					{},
				);
			});

			this.setState({ downloadList: response[1] });
			return response[1];
		} else {
			return false;
		}
	};

	getGalleryInsights = async () => {
		let usertoken = localStorage.getItem('usertoken');

		let response = await TenantsAction.getGalleryInsights(
			this.props.match.params.workspaceID,
			usertoken,
		);

		if (response[0] === true) {
			this.setState({
				projectDetails: response[1],
				isGalleryInsightsLoading: false,
			});
			return true;
		} else {
			return false;
		}
	};
	getClientGalleryVisitorListFilters = async () => {
		let usertoken = localStorage.getItem('usertoken');

		let response = await TenantsAction.getClientGalleryVisitorListFilters(
			this.props.match.params.workspaceID,
			usertoken,
		);

		if (response[0] === true) {
			let visitorListFilters = { all: 0, master: 0, guest: 0, face: 0 };
			_.map(response[1], (item, i) => {
				visitorListFilters[item.vistorRole] = item.count;
				visitorListFilters.all += item.count;
			});
			this.setState({
				visitorListFilters,
				isVisitorListFiltersLoading: false,
			});
			return true;
		}
		this.setState({
			isVisitorListFiltersLoading: false,
		});
		return false;
	};

	updateTenantUserRole = async (userID, role, details = true) => {
		let usertoken = await localStorage.getItem('usertoken');
		let json = {
			role: role,
		};

		toast.promise(
			new Promise(async (resolve, reject) => {
				let response = await TenantsAction.updateTenantUserRole(
					localStorage.getItem('workspaceId'),
					userID,
					json,
					usertoken,
				);
				if (response[0] === true) {
					// if (details === true) {
					// 	this.TeamMemberDetailsUpdated();
					// } else {
					// 	this.getTenantUserDetails(
					// 		this.props.match.params.userId,
					// 		this.props.match.params.workspaceID,
					// 	);
					// }
					this.getTeamMembersList(
						{
							page: 1,
							limit: 15 * this.state.currentViewPage,
						},
						null,
					);

					resolve(true);
					return true;
				} else {
					reject(true);
					return false;
				}
			}),
			{
				pending: 'Loading',
				success: 'team member role updated',
				error: 'failed to update role',
			},
			{
				theme: 'colored',
			},
		);
	};

	deleteTenantUserInvitation = async (invitationID, details = null) => {
		let usertoken = await localStorage.getItem('usertoken');

		toast.promise(
			new Promise(async (resolve, reject) => {
				let response = await TenantsAction.deleteTenantUserInvitation(
					this.props.match.params.workspaceID,
					invitationID,
					usertoken,
				);
				if (response[0] === true) {
					if (details === true) {
						this.props.history.push(`/${this.props.match.params.workspaceID}/users`);
					}

					resolve(true);
				} else {
					reject(true);
				}
			}),
			{
				pending: 'Loading',
				success: 'Invitation deleted',
				error: 'failed to delete invitation',
			},
			{
				theme: 'colored',
			},
		);
	};

	removeTenantUserFromTeam = async (userID) => {
		let usertoken = await localStorage.getItem('usertoken');

		let response = [];
		response[0] = false;
		await toast.promise(
			new Promise(async (resolve, reject) => {
				let response = await TenantsAction.removeTenantUserToTeam(
					this.props.match.params.workspaceID,
					userID,
					usertoken,
				);
				if (response[0] === true) {
					resolve(true);
				} else {
					reject(true);
				}
			}),
			{
				pending: 'Loading',
				success: 'User deleted successfully',
				error: 'Failed to Delete',
			},
			{
				theme: 'colored',
			},
		);

		if (response[0] === true) {
			return true;
		} else {
			return false;
		}
	};

	getTenantSettings = async (screenName = null) => {
		let usertoken = await localStorage.getItem('usertoken');
		let workspaceId = await localStorage.getItem('workspaceId');

		let tenantInfo = await TenantsAction.getTenantSettings(
			screenName === 'signup-subdomain' ? this.state.workspaceId : workspaceId,
			usertoken,
		);

		if (tenantInfo[0]) {
			if (screenName === 'pooling') {
				return tenantInfo[1];
			} else {
				if (screenName === 'signup-subdomain') {
					console.log(tenantInfo[1].businessName.toLowerCase().replace(/\s/g, ''));
					this.setState(
						{
							subdomain: tenantInfo[1].businessName.toLowerCase().replace(/\s/g, ''),
						},
						() => {
							document.getElementById('idOfSubdomain24efjdskj').style.width = `${
								_.size(this.state.subdomain) === 0
									? _.size(this.state.subdomain) * 8 + 0.1
									: _.size(this.state.subdomain) * 8
							}px`;
							this.validateInput('subdomain');
						},
					);
					return;
				}
				if (screenName === 'form-share') {
					let shareUrl =
						tenantInfo[1].metaLogoUrl && tenantInfo[1].metaLogoUrl !== null
							? tenantInfo[1].metaLogoUrl
							: tenantInfo[1].logoUrl;
					this.setState({ shareUrl, tempShareUrl: shareUrl, isShareUrlLoading: false });
					return;
				}
				let facebookProfile, facebookProfileO;
				let instagramProfile, instagramProfileO;
				let pinterestProfile, pinterestProfileO;
				let linkedInProfile, linkedInProfileO;
				let address, addressO;
				let phoneNumber, phoneNumberO;
				let email, emailO;
				let website, websiteO;
				let businessName, businessNameO;

				facebookProfile = facebookProfileO = _.has(tenantInfo[1], 'facebookProfile')
					? tenantInfo[1].facebookProfile.includes('facebook.com')
						? tenantInfo[1].facebookProfile
						: 'www.facebook.com/' + tenantInfo[1].facebookProfile
					: 'www.facebook.com/';
				instagramProfile = instagramProfileO = _.has(tenantInfo[1], 'instagramProfile')
					? tenantInfo[1].instagramProfile.includes('instagram.com')
						? tenantInfo[1].instagramProfile
						: 'www.instagram.com/' + tenantInfo[1].instagramProfile
					: 'www.instagram.com/';
				pinterestProfile = pinterestProfileO = _.has(tenantInfo[1], 'pinterestProfile')
					? tenantInfo[1].pinterestProfile.includes('pinterest.com')
						? tenantInfo[1].pinterestProfile
						: 'www.pinterest.com/' + tenantInfo[1].pinterestProfile
					: 'www.pinterest.com/';
				linkedInProfile = linkedInProfileO = _.has(tenantInfo[1], 'linkedInProfile')
					? tenantInfo[1].linkedInProfile.includes('linkedin.com')
						? tenantInfo[1].linkedInProfile
						: 'www.linkedin.com/in/' + tenantInfo[1].linkedInProfile
					: 'www.linkedin.com/in/';
				address = addressO = _.has(tenantInfo[1], 'address') ? tenantInfo[1].address : '';
				phoneNumber = phoneNumberO = _.has(tenantInfo[1], 'phoneNumber')
					? tenantInfo[1].phoneNumber
					: '';
				email = emailO = _.has(tenantInfo[1], 'email') ? tenantInfo[1].email : '';
				websiteO = website = tenantInfo[1].website === null ? '' : tenantInfo[1].website;
				businessName = businessNameO = tenantInfo[1].businessName;
				this.setState({
					isLoading: false,
					businessName,
					businessNameO,
					tenantId: tenantInfo[1].workspaceId,
					website,
					websiteO,
					logoUrl: tenantInfo[1].logoUrl,
					metaLogoUrl:
						tenantInfo[1].metaLogoUrl && tenantInfo[1].metaLogoUrl !== null
							? tenantInfo[1].metaLogoUrl
							: null,
					facebookProfile,
					facebookProfileO,
					instagramProfile,
					instagramProfileO,
					pinterestProfile,
					pinterestProfileO,
					linkedInProfile,
					linkedInProfileO,
					address,
					addressO,
					phoneNumber,
					phoneNumberO,
					email,
					emailO,
					logoName: tenantInfo[1].logo_s3_500w_key,
				});

				if (screenName === 'customization') {
					let posactive =
						_.findIndex(this.state.positionMapping, (item) => {
							return tenantInfo[1].watermarkPosition === item;
						}) + 1;

					if (posactive === 1) {
						this.setState({
							tpos: 10,
							rpos: 'auto',
							bpos: 'auto',
							lpos: 10,
						});
					}
					if (posactive === 2) {
						this.setState({
							tpos: 10,
							rpos: 'calc(50% - 45px)',
							bpos: 'auto',
							lpos: 'auto',
						});
					}
					if (posactive === 3) {
						this.setState({
							tpos: 10,
							rpos: 10,
							bpos: 'auto',
							lpos: 'auto',
						});
					}
					if (posactive === 4) {
						this.setState({
							tpos: 'calc(50% - 20px)',
							rpos: 'auto',
							bpos: 'auto',
							lpos: 10,
						});
					}
					if (posactive === 5) {
						this.setState({
							tpos: 'calc(50% - 20px)',
							rpos: 'auto',
							bpos: 'auto',
							lpos: 'calc(50% - 45px)',
						});
					}
					if (posactive === 6) {
						this.setState({
							tpos: 'calc(50% - 20px)',
							rpos: 10,
							bpos: 'auto',
							lpos: 'auto',
						});
					}
					if (posactive === 7) {
						this.setState({
							tpos: 'auto',
							rpos: 'auto',
							bpos: 10,
							lpos: 10,
						});
					}
					if (posactive === 8) {
						this.setState({
							tpos: 'auto',
							rpos: 'auto',
							bpos: 10,
							lpos: 'calc(50% - 45px)',
						});
					}
					if (posactive === 9) {
						this.setState({
							tpos: 'auto',
							rpos: 10,
							bpos: 10,
							lpos: 'auto',
						});
					}
					this.setState({
						posactive,
					});
				}
			}
		} else {
			if (_.has(tenantInfo[1], 'message')) {
				console.log('API Failed: ', tenantInfo[1].message);
			}
		}
	};

	updateTenantDetails = async (json) => {
		let usertoken = await localStorage.getItem('usertoken');

		this.setState({ isLoading: true });

		toast.promise(
			new Promise(async (resolve, reject) => {
				let response = await TenantsAction.updateTenantBusinessName(
					this.props.match.params.workspaceID,
					{ businessName: json.businessName },
					usertoken,
				);
				// let response2 = await TenantsAction.updateTenantWebsite(
				// 	this.props.match.params.workspaceID,
				// 	{ websiteUrl: json.website },
				// 	usertoken,
				// );

				if (response[0] === true) {
					this.getTenantSettings();
					resolve(true);
				}
				if (response[0] === true) {
					resolve(true);
				} else {
					reject(true);
					this.setState({
						errorMessage: response[1].message,
						isLoading: false,
					});
				}
			}),
			{
				pending: 'Loading',
				success: 'Business Name Updated',
				error: 'Failed to update',
			},
			{
				theme: 'colored',
			},
		);
	};
	updateTenantDetailsWebsite = async (json) => {
		let usertoken = await localStorage.getItem('usertoken');

		this.setState({ isLoading: true });

		toast.promise(
			new Promise(async (resolve, reject) => {
				let response = await TenantsAction.updateTenantWebsite(
					localStorage.getItem('workspaceId'),
					{ websiteUrl: json.website },
					usertoken,
				);

				if (response[0] === true) {
					this.getTenantSettings();
					resolve(true);
				}
				if (response[0] === true) {
					resolve(true);
				} else {
					reject(true);
					this.setState({
						errorMessage: response[1].message,
						isLoading: false,
					});
				}
			}),
			{
				pending: 'Loading',
				success: 'Website Updated SuccessFully!',
				error: 'Failed to update',
			},
			{
				theme: 'colored',
			},
		);
	};
	updateTenantSocialMediaProfile = async (json) => {
		let usertoken = localStorage.getItem('usertoken');
		this.setState({ isLoading: true });

		await toast.promise(
			new Promise(async (resolve, reject) => {
				let response = await TenantsAction.updateTenantSocialMediaProfile(
					localStorage.getItem('workspaceId'),
					json,
					usertoken,
				);

				if (response[0] === true) {
					resolve(true);
				} else {
					reject(true);
					this.setState({
						errorMessage: response[1].message,
						isLoading: false,
					});
				}
			}),
			{
				pending: 'Loading',
				success: 'Account Details Updated',
				error: 'Failed to update',
			},
			{
				theme: 'colored',
			},
		);
	};

	updateTenantContactDetails = async (json) => {
		let usertoken = await localStorage.getItem('usertoken');

		this.setState({ isLoading: true });

		await toast.promise(
			new Promise(async (resolve, reject) => {
				let response = await TenantsAction.updateTenantContactDetails(
					localStorage.getItem('workspaceId'),
					json,
					usertoken,
				);

				if (response[0] === true) {
					resolve(true);
				} else {
					reject(true);
					this.setState({
						errorMessage: response[1].message,
						isLoading: false,
					});
				}
			}),
			{
				pending: 'Loading',
				success: 'Social Media Profile Details Updated',
				error: 'Failed to update',
			},
			{
				theme: 'colored',
			},
		);
	};

	updateTenantAddress = async (json) => {
		let usertoken = await localStorage.getItem('usertoken');

		this.setState({ isLoading: true });

		await toast.promise(
			new Promise(async (resolve, reject) => {
				let response = await TenantsAction.updateTenantAddress(
					localStorage.getItem('workspaceId'),
					json,
					usertoken,
				);

				if (response[0] === true) {
					resolve(true);
				} else {
					reject(true);
					this.setState({
						errorMessage: response[1].message,
						isLoading: false,
					});
				}
			}),
			{
				pending: 'Loading',
				success: 'Address Updated',
				error: 'Failed to update',
			},
			{
				theme: 'colored',
			},
		);
	};

	pollingFunctionToCheckImageUpdatedorNot = (type, name) => {
		return new Promise(async (resolve, reject) => {
			const checkAndUpdate = async () => {
				let tenantDetails;
				try {
					tenantDetails =
						type === 'logo' || type === 'metalogo'
							? await this.getTenantSettings('pooling')
							: type === 'watermark'
							? await this.getWatermarkList(null, 'pooling')
							: null;

					if (type === 'logo' && tenantDetails['logo_s3_500w_key'] !== name) {
						console.log('Logo updated successfully.');
						resolve(true);
					} else if (
						(type === 'logo' && tenantDetails['logo_s3_500w_key'] === name) ||
						(type === 'watermark' && _.size(tenantDetails) === _.size(name)) ||
						(type === 'metalogo' &&
							tenantDetails['metaLogoUrl'] &&
							name &&
							tenantDetails['metaLogoUrl']
								.split('.png')[0]
								.split('https://ddgrv73n1zhiw.cloudfront.net/')[1] ===
								name
									.split('.png')[0]
									.split('https://ddgrv73n1zhiw.cloudfront.net/')[1])
					) {
						console.log('Waiting for logo to update...');
						setTimeout(checkAndUpdate, 5000);
					} else if (type === 'watermark' && _.size(tenantDetails) !== _.size(name)) {
						console.log('Watermark updated successfully.');
						resolve(true);
					} else if (
						type === 'metalogo' &&
						tenantDetails['metaLogoUrl'] &&
						name &&
						tenantDetails['metaLogoUrl']
							.split('.png')[0]
							.split('https://ddgrv73n1zhiw.cloudfront.net/')[1] !==
							name.split('.png')[0].split('https://ddgrv73n1zhiw.cloudfront.net/')[1]
					) {
						console.log('Meta Logo updated successfully.');
						resolve(true);
					}
				} catch (error) {
					console.error('Error fetching tenant settings:', error);
					reject(false); // Reject the promise on error
				}
			};
			checkAndUpdate();
		});
	};

	axiosPutCallToS3Bucket = async (image, uploadUrl) => {
		//console.log('axiosPutCallToS3Bucket');

		let options = {
			headers: {
				'Content-Type': image.type,
			},
		};

		let response = await axios.put(uploadUrl, image, options);
		if (response.status === 200) {
			return true;
		} else {
			return false;
		}
	};

	uploadTenantLogo = async (file) => {
		//let formData = new FormData();

		//formData.append('logo', files, files.name);

		let usertoken = await localStorage.getItem('usertoken');

		toast.promise(
			new Promise(async (resolve, reject) => {
				let response = await TenantsAction.uploadTenantLogo(
					localStorage.getItem('workspaceId'),
					{},
					usertoken,
				);
				if (response[0] === true) {
					let resp = await this.axiosPutCallToS3Bucket(file, response[1].signedUrl);
					if (resp) {
						let pollingResponse = await this.pollingFunctionToCheckImageUpdatedorNot(
							'logo',
							this.state.logoName,
						);
						console.log('pollingResponse = ', pollingResponse);
						if (pollingResponse) {
							//this.props.onLogoUpdated();
							//this.getTenantSettings();
							this.onLogoUpdated();
							resolve(true);
						}
					} else {
						reject(true);
					}
				} else {
					reject(true);
				}
			}),
			{
				pending: 'Loading',
				success: 'Logo Uploaded',
				error: 'Failed to Upload',
			},
			{
				theme: 'colored',
			},
		);
	};

	uploadShareLogo = async (file) => {
		// let formData = new FormData();

		// formData.append('logo', files, files.name);

		let usertoken = await localStorage.getItem('usertoken');

		toast.promise(
			new Promise(async (resolve, reject) => {
				let response = await TenantsAction.uploadShareLogo(
					this.props.match.params.workspaceID,
					{},
					usertoken,
				);
				if (response[0] === true) {
					let resp = await this.axiosPutCallToS3Bucket(file, response[1].signedUrl);
					if (resp) {
						let pollingResponse = await this.pollingFunctionToCheckImageUpdatedorNot(
							'metalogo',
							this.state.metaLogoUrl,
						);
						console.log('pollingResponse = ', pollingResponse);
						if (pollingResponse) {
							this.onLogoUpdated();
							resolve(true);
						}
					} else {
						reject(true);
					}
				} else {
					reject(true);
				}
			}),
			{
				pending: 'Loading',
				success: 'Share Thumbnail Uploaded',
				error: 'Failed to Upload Share Thumbnail',
			},
			{
				theme: 'colored',
			},
		);
	};

	uploadLoveCoTenantLogo = async (files, workspaceID) => {
		let formData = new FormData();

		formData.append('logo', files, files.name);
		formData.append('isLovecoUpload', true);

		let usertoken = localStorage.getItem('usertoken');

		let response = [false];
		try {
			response = await TenantsAction.uploadTenantLogo(workspaceID, formData, usertoken);
		} catch (e) {
			console.log(e);
			return false;
		}

		if (response[0] === true) {
			return true;
		} else {
			return false;
		}
	};

	uploadWaterMark = async (file) => {
		//let formData = new FormData();

		//formData.append('watermark', files, files.name);

		let usertoken = await localStorage.getItem('usertoken');

		toast.promise(
			new Promise(async (resolve, reject) => {
				let response = await TenantsAction.uploadWaterMark(
					this.props.match.params.workspaceID,
					{},
					usertoken,
				);
				if (response[0] === true) {
					let resp = await this.axiosPutCallToS3Bucket(file, response[1].signedUrl);
					if (resp) {
						let pollingResponse = await this.pollingFunctionToCheckImageUpdatedorNot(
							'watermark',
							this.state.watermarkList,
						);
						console.log('pollingResponse = ', pollingResponse);
						if (pollingResponse) {
							this.getWatermarkList();
							resolve(true);
						}
					} else {
						reject(true);
					}
				} else {
					this.props.close();
					reject(true);
				}
			}),
			{
				pending: 'Loading',
				success: 'Watermark Uploaded',
				error: 'Failed to Upload',
			},
			{
				theme: 'colored',
			},
		);
	};

	uploadLoveCoWaterMark = async (files, workspaceID) => {
		let formData = new FormData();

		formData.append('watermark', files, files.name);
		formData.append('isLovecoUpload', true);

		let usertoken = localStorage.getItem('usertoken');

		let response = [false];
		try {
			response = await TenantsAction.uploadWaterMark(workspaceID, formData, usertoken);
		} catch (e) {
			console.log(e);
			return false;
		}

		if (response[0] === true) {
			return true;
		} else {
			return false;
		}
	};

	getWatermarkList = async (workspaceID = null, screenName = null) => {
		let tenantID = workspaceID === null ? localStorage.getItem('workspaceId') : workspaceID;

		let usertoken = await localStorage.getItem('usertoken');
		let response = await TenantsAction.getWatermarkList(tenantID, usertoken);

		if (response[0] === true) {
			if (screenName === 'pooling') {
				return response[1];
			} else {
				this.setState({
					watermarkUrl: null,
					watermarkList: response[1],
					isWaterMarkLoading: false,
				});
			}
		}
	};
	deleteWatermark = async (workspaceID = null, profileId = null) => {
		let tenantID = workspaceID === null ? this.props.match.params.workspaceID : workspaceID;
		let usertoken = await localStorage.getItem('usertoken');

		toast.promise(
			new Promise(async (resolve, reject) => {
				let response = await TenantsAction.deleteWatermark(tenantID, usertoken, profileId);
				if (response[0] === true) {
					this.setState({
						watermarkProfileId: response[1].defaultWatermarkProfileId,
					});
					this.getWatermarkList();
					resolve(true);
				} else {
					this.setState({
						isSubmitting: false,
						errorMessage: response[1].message,
					});
					reject(true);
				}
			}),
			{
				pending: 'Loading',
				success: 'Deleted Successfully',
				error: 'Failed to Delete',
			},

			{
				theme: 'colored',
			},
		);
	};

	updateTenantSettings = async (json) => {
		let usertoken = await localStorage.getItem('usertoken');

		let response = toast.promise(
			new Promise(async (resolve, reject) => {
				let tenantInfo = await TenantsAction.updatePrefernces(
					localStorage.getItem('workspaceId'),
					json,
					usertoken,
				);
				if (tenantInfo[0] === true) {
					let selectedthemeOption = tenantInfo[1].theme
						? tenantInfo[1].theme === 'dark'
							? { value: 'dark', label: 'Dark' }
							: { value: 'light', label: 'Light' }
						: { value: 'dark', label: 'Dark' };

					if (tenantInfo[1].watermarkPosition === 'northwest') {
						this.setState({
							tpos: 10,
							rpos: 'auto',
							bpos: 'auto',
							lpos: 10,
						});
					}
					if (tenantInfo[1].watermarkPosition === 'north') {
						this.setState({
							tpos: 10,
							rpos: 'calc(50% - 45px)',
							bpos: 'auto',
							lpos: 'auto',
						});
					}
					if (tenantInfo[1].watermarkPosition === 'northeast') {
						this.setState({
							tpos: 10,
							rpos: 10,
							bpos: 'auto',
							lpos: 'auto',
						});
					}
					if (tenantInfo[1].watermarkPosition === 'west') {
						this.setState({
							tpos: 'calc(50% - 20px)',
							rpos: 'auto',
							bpos: 'auto',
							lpos: 10,
						});
					}
					if (tenantInfo[1].watermarkPosition === 'center') {
						this.setState({
							tpos: 'calc(50% - 20px)',
							rpos: 'auto',
							bpos: 'auto',
							lpos: 'calc(50% - 45px)',
						});
					}
					if (tenantInfo[1].watermarkPosition === 'east') {
						this.setState({
							tpos: 'calc(50% - 20px)',
							rpos: '10',
							bpos: 'auto',
							lpos: 'auto',
						});
					}
					if (tenantInfo[1].watermarkPosition === 'southwest') {
						this.setState({
							tpos: 'auto',
							rpos: 'auto',
							bpos: 10,
							lpos: 10,
						});
					}
					if (tenantInfo[1].watermarkPosition === 'south') {
						this.setState({
							tpos: 'auto',
							rpos: 'auto',
							bpos: 10,
							lpos: 'calc(50% - 45px)',
						});
					}
					if (tenantInfo[1].watermarkPosition === 'southeast') {
						this.setState({
							tpos: 'auto',
							rpos: 10,
							bpos: 10,
							lpos: 'auto',
						});
					}
					this.setState({
						isLoading: false,
						selectedthemeOption,
						projectTheme: tenantInfo[1].theme,
						watermarkUrl: null,
						theme: !_.has(tenantInfo[1], 'theme') ? 'dark' : tenantInfo[1].theme,

						canClientDownloadOriginals: tenantInfo[1].canClientDownloadOriginals,
						canClientReview: tenantInfo[1].canClientReview,
						ctaPreferences: tenantInfo[1].ctaPreferences,
						canClientSuggestEdits: tenantInfo[1].canClientSuggestEdits,
						watermarkPosition: tenantInfo[1].watermarkPosition,
						watermarkProfileId: _.has(tenantInfo[1], 'watermarkProfileId')
							? tenantInfo[1].watermarkProfileId
							: null,
						isWaterMarkApply: tenantInfo[1].watermarkProfileId ? true : false,
						galleryVisitorsForm: _.pickBy(tenantInfo[1], function (v, k) {
							return k === 'isEnabled' || k === 'accessibleTo';
						}),
						galleryAICreditsLimit: _.has(tenantInfo[1], 'galleryAICreditsLimit')
							? tenantInfo[1].galleryAICreditsLimit
							: 2000,
					});
					resolve(true);
					return true;
				} else {
					this.setState({ errorMessage: tenantInfo[1].message, isButtonLoading: false });

					reject(true);
					return false;
				}
			}),
			{
				pending: 'Loading',
				success: 'Updated Successfully',
				error: 'Failed to Update',
			},
			{
				theme: 'colored',
			},
		);
		return response;
	};

	getTenantSubscriptionDetails = async (workspaceId = null) => {
		let workspaceID;
		if (workspaceId !== null) {
			workspaceID = workspaceId;
		} else {
			workspaceID = localStorage.getItem('workspaceId');
		}

		let usertoken = await localStorage.getItem('usertoken');
		let response = await TenantsAction.getTenantSubscriptionDetails(workspaceID, usertoken);

		if (response[0] === true) {
			localStorage.setItem(`subscription::${workspaceID}`, JSON.stringify(response[1]));
			cookies.set('appVersion', response[1].appVersion ? response[1].appVersion : null, {
				domain:
					window.location.host.split('.')[1] === 'huemn'
						? '.huemn.com'
						: window.location.hostname,
				path: '/',
			});
			this.setState({
				subscriptionDetails: response[1],
				isActiveSubscription: moment().unix() > response[1].expiresAt ? false : true,
				isSubscriptionDetailsLoading: false,
			});
		}
	};

	getTenantUsageDetails = async (workspaceId = null) => {
		let workspaceID;
		if (workspaceId) {
			workspaceID = workspaceId;
		} else {
			workspaceID = localStorage.getItem('workspaceId');
		}
		let usertoken = await localStorage.getItem('usertoken');
		let response = await TenantsAction.getTenantUsageDetails(workspaceID, usertoken);

		if (response[0] === true) {
			let tenantUsageDetails = { ...this.state.tenantUsageDetails, ...response[1] };

			this.setState({
				isUsageDataLoading: false,
				tenantUsageDetails,
			});
		} else {
			this.setState({
				tenantUsageDetails: {
					totalStorageInBytes: 0,
					leftOverFreeAICredits: 0,
					leftOverPurchasedAICredits: 0,
					storageInGb: 0,
					b2Storage: 0,
				},
				isUsageDataLoading: false,
			});
		}
	};
	getImages = async (type, actionType = null, imageId = null) => {
		let workspaceID = this.props.match.params.workspaceID;
		let userToken = localStorage.getItem('usertoken');
		let response = await TenantsAction.getImages(workspaceID, userToken, type);
		if (response[0] === true) {
			if (actionType === 'form-share') {
				let shareUrl = null;
				let filtered = _.filter(response[1], (image, index) => {
					return image._id === imageId;
				});
				if (filtered) {
					shareUrl = `https://api.huemn.com/images/1.0/${this.props.match.params.workspaceID}/images/${filtered[0]._id}`;
				}
				this.setState({
					imagesList: response[1],
					shareUrl,
					tempShareUrl: shareUrl,
					isShareUrlLoading: false,
				});
				return true;
			}
			this.setState({
				imagesList: response[1],
			});
			return true;
		} else {
			return false;
		}
	};

	registerLoveCoTenant = async (json) => {
		let usertoken = localStorage.getItem('usertoken');

		this.setState({ isAPISubmitting: true });

		let response = await TenantsAction.registerLoveCoTenant(json, usertoken);
		if (response[0] === true) {
			localStorage.setItem('accessibleWorkspaces', response[1].workspaceId);

			this.props.history.push(`/user/subscription-plan-payment`);
		} else {
			this.setState({
				errorMessage: response[1].message,
				isAPISubmitting: false,
			});
		}
	};

	getLoveCoSubscriptionPlans = async (type = null) => {
		let usertoken = localStorage.getItem('usertoken');
		let response = await TenantsAction.getLoveCoSubscriptionPlans(usertoken);

		if (response[0] === true) {
			if (type === 'settings-page') {
				let subscriptionDataNew = [];
				if (_.size(response[1]) > 0) {
					subscriptionDataNew = _.sortBy(response[1], ['priceInRupee']);
				}
				this.setState({
					isSubscriptionNewLoading: false,
					subscriptionDataNew,
				});
			} else {
				let subscriptionData = [];
				if (_.size(response[1]) > 0) {
					subscriptionData = _.groupBy(_.sortBy(response[1], ['priceInRupee']), 'plan');
				}

				this.setState({
					isSubscriptionLoading: false,
					subscriptionData: subscriptionData,
				});
			}
		} else {
			if (type === 'settings-page') {
				this.setState({
					isSubscriptionNewLoading: false,
				});
			} else {
				this.setState({
					isSubscriptionLoading: false,
				});
			}
		}
	};

	requestLoveCoRazorPayOrder = async (payload, subscriptionID, workspaceID, type = null) => {
		let usertoken = localStorage.getItem('usertoken');

		let response = await TenantsAction.requestLoveCoRazorPayOrder(
			payload,
			workspaceID,
			subscriptionID,
			usertoken,
		);

		if (response[0] === true) {
			let razorPayData = response[1];

			const options = {
				key: razorPayData.key,
				currency: razorPayData.currency,
				amount: razorPayData.amount.toString(),
				order_id: razorPayData.id,
				name: this.state.selectedPlan.plan + ' - Loveco',
				description: 'Loveco Subscription Plan',
				notes: razorPayData.notes,
				handler: async (response) => {
					console.log(response, 'im here');
					let json = {
						payment_id: response.razorpay_payment_id,
						order_id: response.razorpay_order_id,
						signature: response.razorpay_signature,
						isLovecoPayment: true,
					};
					let paymentResponse = await TenantsAction.sendRazorPayResponse(
						workspaceID,
						razorPayData.receipt,
						json,
						usertoken,
					);

					if (paymentResponse[0]) {
						if (type === 'subscription-modal') {
							window.location.reload();
						} else {
							this.props.history.push(`/user/create-domain`);
						}
					}
				},
				prefill: {
					name:
						this.state.firstName +
						(this.state.lastName ? '  ' + this.state.lastName : ''),
					email: this.state.email,
				},
				modal: {
					escape: false,
					ondismiss: () => {
						this.setState({
							isRazorPayLoading: false,
						});
					},
				},
			};

			const paymentObject = new window.Razorpay(options);
			paymentObject.open();
		} else {
			toast.error(response[1].message, {
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: 'colored',
			});

			this.setState({
				isRazorPayLoading: false,
			});
		}
	};

	updateLoveCoBrandDetails = async (json, workspaceID) => {
		let usertoken = localStorage.getItem('usertoken');

		this.setState({ isAPISubmitting: true });

		let response = await TenantsAction.updateLoveCoBrandDetails(workspaceID, json, usertoken);
		if (response[0] === true) {
			localStorage.setItem('accessibleWorkspaces', response[1].workspaceId);

			this.props.history.push(`/user/default-preferences`);
		} else {
			this.setState({
				errorMessage: response[1].message,
				isAPISubmitting: false,
			});
		}
	};

	updateLoveCoTenantPreferences = async (json, workspaceID) => {
		this.setState({
			isAPISubmitting: true,
		});
		let usertoken = localStorage.getItem('usertoken');

		let response = await TenantsAction.updatePrefernces(workspaceID, json, usertoken);
		if (response[0] === true) {
			this.setState({
				isAPISubmitting: false,
			});
			if (localStorage.getItem('accessibleWorkspaces'))
				this.props.history.push(
					`/${localStorage.getItem('accessibleWorkspaces').split(',')[0]}/projects`,
				);
		} else {
			this.setState({
				errorMessage: response[1].message,
				isAPISubmitting: false,
			});
		}
	};
}
export default Tenant;
