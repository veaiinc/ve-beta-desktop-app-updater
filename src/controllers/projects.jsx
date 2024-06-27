import React, { Component } from 'react';
import TenantUser from './tenantUser';
import * as ProjectsAction from './oldActions';
import _ from 'lodash';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';
// const Slugify = require('underscore.string/slugify');
const moment = require('moment');

class Projects extends TenantUser {
	getTenantUserProjectList = async (userID = null, isDetailed = false, actionType = null) => {
		let usertoken = localStorage.getItem('usertoken');
		let workspaceID = this.props.match.params.workspaceID;

		var decoded = await jwt_decode(usertoken);

		let sortingOrder = this.state.sortingOrder;
		let sortingField = this.state.sortingField;
		let filterValue = this.state.filterValue;
		let srlpos = null;

		if (new URLSearchParams(window.location.search).get('sort')) {
			sortingOrder =
				new URLSearchParams(window.location.search).get('sort')[0] === '-' ? false : true;
			sortingField = new URLSearchParams(window.location.search).get('sort');
			if (!sortingOrder) {
				sortingField = sortingField.substr(1);
			}
			this.setState({
				sortingOrder,
				sortingField,
			});
		} else if (
			localStorage.getItem(
				`${this.props.match.params.workspaceID}::${
					actionType === 'clientSubscriptions' ? 'clientSubscriptions' : 'galleries'
				}::sortType`,
			)
		) {
			sortingOrder =
				localStorage.getItem(
					`${this.props.match.params.workspaceID}::${
						actionType === 'clientSubscriptions' ? 'clientSubscriptions' : 'galleries'
					}::sortType`,
				)[0] === '-'
					? false
					: true;
			sortingField = localStorage.getItem(
				`${this.props.match.params.workspaceID}::${
					actionType === 'clientSubscriptions' ? 'clientSubscriptions' : 'galleries'
				}::sortType`,
			);
			if (!sortingOrder) {
				sortingField = sortingField.substr(1);
			}
		}

		if (new URLSearchParams(window.location.search).get('filter')) {
			filterValue = new URLSearchParams(window.location.search).get('filter');
		} else if (
			localStorage.getItem(
				`${this.props.match.params.workspaceID}::${
					actionType === 'clientSubscriptions' ? 'clientSubscriptions' : 'galleries'
				}::filter`,
			)
		) {
			filterValue = localStorage.getItem(
				`${this.props.match.params.workspaceID}::${
					actionType === 'clientSubscriptions' ? 'clientSubscriptions' : 'galleries'
				}::filter`,
			);
		}

		/* if (new URLSearchParams(window.location.search).get('srlpos')) {
			srlpos = new URLSearchParams(window.location.search).get('srlpos');
		} */

		var response = await ProjectsAction.getTenantUserProjectList(
			this.props.match.params.workspaceID,
			userID === null ? decoded.user_id : userID,
			isDetailed,
			usertoken,
			sortingOrder ? sortingField : `-${sortingField}`,
		);

		if (response[0] === true) {
			let tempProjectList = [];
			if (response[1].length > 0) {
				tempProjectList = _.map(response[1], (item, index) => {
					return { status: item.status, dueDateEpoch: item.dueDateEpoch, _id: item._id };
				});
				if (actionType === 'clientSubscriptions') {
					response[1] = _.filter(response[1], { status: 'client' });
				}
				response[1] = _.map(response[1], (item, index) => {
					if (item.dueDateEpoch < moment().format('X') && item.status === 'active') {
						item.status = 'closed';
					}
					return item;
				});
			}

			this.setState(
				{
					galleriesList: response[1].galleries,
					projectsList: response[1].galleries,
					computedProjectsList: response[1].galleries,
					isLoading: false,
				},
				async () => {
					if (_.size(response[1]) === 0) {
						this.setState({
							isLoading: false,
							signedURL: [],
						});
					} else {
						await this.listItemsFunction({ name: _.capitalize(filterValue) });
						await this.changeSortOptions(sortingField, sortingOrder);
					}
				},
			);

			let projectsFilter = this.state.projectsFilter;

			_.map(
				projectsFilter,
				(filter) => {
					if (filter.key === 'all') filter.length = _.size(response[1]);
					if (filter.key === 'active')
						filter.length = _.size(_.filter(response[1], { status: 'active' }));
					if (filter.key === 'closed')
						filter.length = _.size(_.filter(response[1], { status: 'closed' }));
				},
				() => {
					this.setState({ projectsFilter, isLoading: false });
				},
			);
		}
	};
	getGalleriesDefaultFilters = async () => {
		let usertoken = localStorage.getItem('usertoken');
		let workspaceID = this.props.match.params.workspaceID;

		var decoded = await jwt_decode(usertoken);
		var response = await ProjectsAction.getGalleriesDefaultFilters(
			workspaceID,
			decoded.user_id,
			usertoken,
		);

		if (response[0] == true) {
			let defaultFilters = {};
			_.map(response[1], (filter, key) => {
				defaultFilters.all = _.size(filter.all) > 0 ? filter.all[0].count : 0;
				defaultFilters.active = _.filter(filter.status, { status: 'active' })[0]?.count;

				defaultFilters.closed =
					_.size(_.filter(filter.status, { status: 'closed' })[0]) > 0
						? _.filter(filter.status, { status: 'closed' })[0].count
						: 0;
				defaultFilters.client = _.filter(filter.status, { status: 'client' })[0]?.count;
			});
			this.setState({
				defaultFilters: defaultFilters,
				isDefaultFiltersLoading: false,
			});
		}
	};
	getGalleriesList = async (page = 1, add = null, searchQuery = null) => {
		let usertoken = localStorage.getItem('usertoken');
		let workspaceID = this.props.match.params.workspaceID;

		var decoded = await jwt_decode(usertoken);

		let sortingOrder = this.state.sortingOrder;
		let sortingField = this.state.sortingField;
		let filterValue = this.state.filterValue;
		let srlpos = null;

		if (new URLSearchParams(window.location.search).get('sort')) {
			sortingOrder =
				new URLSearchParams(window.location.search).get('sort')[0] === '-' ? false : true;
			sortingField = new URLSearchParams(window.location.search).get('sort');
			if (!sortingOrder) {
				sortingField = sortingField.substr(1);
			}
			this.setState({
				sortingOrder,
				sortingField,
			});
		}

		if (new URLSearchParams(window.location.search).get('filter')) {
			filterValue = new URLSearchParams(window.location.search).get('filter');
		}
		var response = await ProjectsAction.getGalleriesList(
			this.props.match.params.workspaceID,
			decoded.user_id,
			false,
			usertoken,
			sortingOrder ? sortingField : `-${sortingField}`,
			page,
			searchQuery,
			filterValue,
		);

		if (response[0] === true) {
			this.setState({
				galleriesList:
					add == null
						? response[1].galleries
						: [...this.state.galleriesList, ...response[1].galleries],
				currentPage: response[1].currentPage,

				hasMoreGalleries: response[1].hasNextPage,
				isLoading: false,
				isPageLoading: false,
				// projectsList: response[1].galleries,
				// computedProjectsList: response[1].galleries,
			});
		}
	};

	getSignedURLForProjects = async (projectsArray, actionType = null) => {
		let usertoken = localStorage.getItem('usertoken');
		let workspaceID = this.props.match.params.workspaceID;

		let json = {
			gallery_ids: projectsArray,
		};

		var response = await ProjectsAction.getSignedURLForProjects(workspaceID, json, usertoken);

		if (response[0] === true) {
			let computeSignedURL = {};
			let count = 0;

			_.map(response[1], async (projectSignedURL, key) => {
				computeSignedURL[projectSignedURL.project_id] = projectSignedURL.credentials;
				count++;
			});

			if (count === _.size(response[1])) {
				this.setState({
					signedURL: computeSignedURL,
					isLoading: false,
				});
			}
		}
	};

	getTeamMembers = async (param = null) => {
		let usertoken = await localStorage.getItem('usertoken');

		var decoded = jwt_decode(usertoken);

		let tenantTeam = await ProjectsAction.getTenantUsers(
			localStorage.getItem('workspaceId'),
			usertoken,
		);

		if (tenantTeam[0]) {
			if (param === 'detailed') {
				//let list = this.state.list;
				let mainFilterList = {
					all: [],
					active: [],
					deactivated: [],
					invited: [],
					admins: [],
					members: [],
					uninvited: [],
				};
				//list[1]['length'] = tenantTeam[1].length;
				let adminList = _.filter(tenantTeam[1], { role: 'admin' });

				let defaultList = _.filter(tenantTeam[1], { role: 'default' });

				let adminDefaultList = [...adminList, ...defaultList];
				let taggedList = _.map(adminDefaultList, (item, index) => {
					if (item.email !== null) {
						item.filterType = 'active';
					} else {
						item.filterType = 'uninvited'; // uninvited is 'custom' crew
					}
					if (item.role === 'admin' && item.email !== null) {
						item.memType = 'admin';
					} else if (item.role === 'default' && item.email !== null) {
						item.memType = 'member';
					} else if (item.email === null) {
						item.memType = 'uninvited'; // uninvited is 'custom' crew
					}
					if (item.firstName && item.lastName) {
						item.title = item.firstName + ' ' + item.lastName;
					} else if (item.firstName) {
						item.title = item.firstName;
					} else {
						item.title = '-';
					}
					return item;
				});

				_.forEach(taggedList, (item, index) => {
					mainFilterList.all.push(item);
					if (item.filterType === 'active') {
						mainFilterList.active.push(item);
					}
					if (item.filterType === 'uninvited') {
						mainFilterList.uninvited.push(item); // uninvited is 'custom' crew
					}
					if (item.memType === 'admin') {
						mainFilterList.admins.push(item);
					} else if (item.memType === 'member') {
						mainFilterList.members.push(item);
					}
				});
				this.setState(
					{
						tenantUser: taggedList,
						mainFilterList,
						//list: list,
						tempTenantUser: taggedList,
						adminList,
						defaultList,
					},
					() => {
						if (
							_.filter(tenantTeam[1], { _id: decoded.user_id })[0]['role'] === 'admin'
						) {
							this.getTenantInvitations();
						}
					},
				);
			} else if (param === 'users') {
				let tenantUser = _.map(tenantTeam[1], (item) => {
					item.hasFinanceAccess = false;
					if (_.size(item.accessControls) > 0 && item.email !== null) {
						let found = _.find(item.accessControls, {
							app: 'dataManagement',
							isEnabled: true,
						});
						if (found) {
							item.hasFinanceAccess = true;
						}
						return item;
					}

					return item;
				});
				this.setState({ tenantUser, isTenantListLoading: false });
			} else {
				let team = tenantTeam[1];

				let projectCreators = _.filter(team, { _id: decoded.user_id });

				let completeTeam = _.differenceWith(team, [decoded], function (arrValue, othValue) {
					return arrValue._id !== othValue.userId;
				});

				let collaboratoroptions = [];
				_.map(team, (member, index) => {
					if (decoded.user_id !== member._id) {
						let json = {
							value: member._id,
							role: 'collaborator',
							label:
								member.firstName + (member.lastName ? ` ${member.lastName}` : ''),
						};
						collaboratoroptions.push(json);
					}
				});

				if (_.size(collaboratoroptions) + 1 === _.size(team)) {
					let currentUser = projectCreators[0];
					let collaboratoroptionsnotify = _.cloneDeep(collaboratoroptions);
					this.setState({
						collaboratoroptions,
						collaboratoroptionsnotify,
						completeTeam,
						currentUser,
						projectCreators: [
							...this.state.projectCreators,
							{
								_id: projectCreators[0]._id,
								role: 'admin',
							},
						],
					});
				}
			}
		}
	};
	getInvitedTeamMembersList = async (body, isAdd = null) => {
		let usertoken = await localStorage.getItem('usertoken');

		var decoded = jwt_decode(usertoken);

		let tenantTeam = await ProjectsAction.getInvitedTenantUsers(
			localStorage.getItem('workspaceId'),
			usertoken,
			body,
		);

		if (tenantTeam[0]) {
			//let list = this.state.list;
			if (isAdd) {
				this.setState({
					tenantUser: [...this.state.tenantUser, ...tenantTeam[1].data],

					isTenantInvitedLoading: false,
				});
			} else {
				this.setState({
					tenantUser: tenantTeam[1].data,
					hasNextPage: tenantTeam[1].hasNextPage,
					isLoading: false,
				});
			}
		}
	};
	getTeamMembersFilters = async () => {
		let usertoken = await localStorage.getItem('usertoken');

		var decoded = jwt_decode(usertoken);

		let response = await ProjectsAction.getTeamMembersFilters(
			localStorage.getItem('workspaceId'),
			usertoken,
		);

		if (response[0]) {
			this.setState({
				tenantMembersFilters: response[1],
				isFiltersLoading: false,
			});
		}
	};
	getTeamMembersList = async (filters, add = null) => {
		let usertoken = localStorage.getItem('usertoken');

		var decoded = jwt_decode(usertoken);

		let response = await ProjectsAction.getTenantUsersList(
			localStorage.getItem('workspaceId'),
			usertoken,
			filters,
		);

		if (response[0]) {
			this.setState({
				tenantUser: add
					? [...this.state.tenantUser, ...response[1].data]
					: response[1].data,
				hasNextPage: response[1].hasNextPage,
				totalPages: response[1].totalPages,
				isLoading: false,
			});
		}
	};
	// checkSlugAvailability = async () => {
	// 	let usertoken = await localStorage.getItem('usertoken');
	// 	let slug = Slugify(this.state.projectName, '-');

	// 	let checkSlug = await ProjectsAction.checkSlugAvailability(
	// 		this.props.match.params.workspaceID,
	// 		usertoken,
	// 		slug,
	// 	);
	// 	if (checkSlug[0] === true) {
	// 		this.setState({
	// 			isSlugAvailable: checkSlug[1].isAvailable,
	// 		});
	// 		if (checkSlug[1].isAvailable === false) {
	// 			this.setState({
	// 				projectNameErrorMessage: 'already exists',
	// 				projectNameError: true,
	// 			});
	// 		}
	// 	} else {
	// 		this.setState({
	// 			errorMessage: checkSlug[1].message,
	// 		});
	// 	}
	// };
	submitCreateProjectForm = async (appVersion) => {
		let tenantUsers = _.map(this.state.selectedcollaboratorOption, (creator, key) => {
			return { _id: creator.value, role: creator.role };
		});

		let usertoken = await localStorage.getItem('usertoken');

		tenantUsers.unshift(...this.state.projectCreators);

		let json = {
			title: this.state.projectName,
			slug: this.state.galleryUrl,
			category: this.state.eventCategory,
			shotDuring: moment(this.state.galleryDate, 'dd MMM DD YYYY HH:mm:ss').format('YYYYMM'),
			dueDateEpoch: moment(this.state.galleryDueDate, 'dd MMM DD YYYY HH:mm:ss').unix(),
			//notes: this.state.galleryNotes,
			tenantUsers: tenantUsers,

			canClientReview: this.state.canClientReview,
			canClientSuggestEdits: this.state.canClientSuggestEdits,

			theme: this.state.projectTheme,

			visitorFormAccess: {
				accessibleTo: this.state.visitorAccessArray,
				isEnabled: _.size(this.state.visitorAccessArray) > 0 ? true : false,
			},
			canClientDownloadOriginals: this.state.canClientDownloadOriginals,
			canClientDownloadOptimized: this.state.canClientDownloadOptimized,
			ctaPreferences: this.state.ctaPreferences,
		};

		if (appVersion == false) {
			json = {
				...json,
				maxAICreditsAllowed: this.state.maxAICreditsAllowed,
				isAICreditRestrictionApplied: this.state.isAICreditRestrictionApplied,
			};
		} else {
			json = { ...json, canClientDownload: this.state.canClientDownload };
		}

		toast.promise(
			new Promise(async (resolve, reject) => {
				let response = await ProjectsAction.createNewProject(
					this.props.match.params.workspaceID,
					json,
					usertoken,
				);
				if (response[0] === true) {
					this.setState({ isSubmitting: false });

					let url =
						window.location.origin.split('//')[1].split('.')[0] === 'dev-app'
							? 'https://dev-galleries.huemn.com/' +
							  this.props.match.params.workspaceID +
							  '/' +
							  response[1]['slug']
							: window.location.origin.split('//')[1].split('.')[0] === 'app'
							? 'https://galleries.huemn.com/' +
							  this.props.match.params.workspaceID +
							  '/' +
							  response[1]['slug']
							: 'http://' +
							  window.location.hostname +
							  ':7001/' +
							  this.props.match.params.workspaceID +
							  '/' +
							  response[1]['slug'];

					this.props.projectDetailsUpdated(null, null, null, null);
					this.props.closeModalDirectly();
					window.location.href = url;
					//	window.open(url, '_blank');
					resolve(true);
				} else {
					this.setState({ isSubmitting: false, errorMessage: response[1].message });

					reject(true);
				}
			}),
			{
				pending: 'Loading',
				success: 'Gallery created',
				error: 'Failed to create gallery',
			},
			{
				theme: 'colored',
			},
		);

		// let response = await ProjectsAction.createNewProject(
		// 	this.props.match.params.workspaceID,
		// 	json,
		// 	usertoken,
		// );

		// if (response[0] === true) {
		// 	toast.success('Gallery created', {
		// 		theme: 'colored',
		// 	});
		// 	this.setState({ isSubmitting: false });

		// 	let url =
		// 		window.location.origin.split('//')[1].split('.')[0] === 'dev-app'
		// 			? 'https://dev-galleries.huemn.com/' +
		// 			  this.props.match.params.workspaceID +
		// 			  '/' +
		// 			  response[1]['slug']
		// 			: window.location.origin.split('//')[1].split('.')[0] === 'app'
		// 			? 'https://galleries.huemn.com/' +
		// 			  this.props.match.params.workspaceID +
		// 			  '/' +
		// 			  response[1]['slug']
		// 			: 'http://' +
		// 			  window.location.hostname +
		// 			  ':7001/' +
		// 			  this.props.match.params.workspaceID +
		// 			  '/' +
		// 			  response[1]['slug'];

		// 	window.open(url, '_blank');
		// 	this.props.close();
		// 	this.props.projectDetailsUpdated(null, null, null, null);
		// } else {
		// 	toast.error('Failed to create gallery', {
		// 		theme: 'colored',
		// 	});
		// 	this.setState({ isSubmitting: false, errorMessage: response[1].message });
		// }
	};

	getProjectLayoutSettings = async (projectID) => {
		let usertoken = await localStorage.getItem('usertoken');
		var response = await ProjectsAction.getProjectLayoutSettings(projectID, usertoken);

		if (response[0] === true) {
			this.setState({
				layoutSettings: response[1],
				colorChosen: response[1].customColor,
				isLayoutSettingsLoading: false,
			});
		}
	};
}
export default Projects;
