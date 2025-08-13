import { Component } from 'react';
import * as Action from './actions';
import Service from '../services/graphQlServices';
import _ from 'lodash';

class Proposals extends Component {
	reorderSections = (sections, type = null) => {
		if (!sections) {
			return [];
		}

		let sects = Array.isArray(sections) ? _.cloneDeep(sections) : [];

		let sect = _.sortBy(sects, ['order']);

		let newSections = sect.map((section, k) => ({
			...section,
			order: k + 1,
		}));

		return newSections;
	};
	getTemplate = async (id) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.getTemplate(workspaceId, id, userToken);
		if (response[0] == true) {
			let invoiceTables = [...this.state.invoiceTables];
			this.setState({
				isLoading: false,
				sections: this.reorderSections(response[1].sections),
				title: response[1].title,
				sectionVariables: response[1].variables ? response[1].variables : [],
				sectionTables: response[1].tables ? response[1].tables : [],
				module: response[1].module,
			});
			if (this.state.isWorkflow) {
				this.setState({
					invoiceTables: response[1].tables
						? this.state.invoiceTables.concat(response[1].tables)
						: this.state.invoiceTables,
				});
			}
		}
	};
	getTenantsData = async () => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.getTenantsData(workspaceId, userToken);
		if (response[0] == true) {
			this.setState(
				{
					tenantsData: {
						// ...response[1],
						CompanyAddress: _.has(response[1], 'address') ? response[1].address : null,
						CompanyName: _.has(response[1], 'businessName')
							? response[1].businessName
							: null,
						LinkedInProfile: _.has(response[1], 'linkedInProfile')
							? response[1].linkedInProfile
							: null,
						FacebookProfile: _.has(response[1], 'facebookProfile')
							? response[1].facebookProfile
							: null,
						CompanyEmail: _.has(response[1], 'email') ? response[1].email : null,
						CompanyPhoneNumber: _.has(response[1], 'phoneNumber')
							? response[1].phoneNumber
							: null,
						website: _.has(response[1], 'website') ? response[1].website : null,
					},
					socialMediaLinks: {
						Behance: _.has(response[1], 'behanceProfile')
							? response[1].behanceProfile
							: '',
						Facebook: _.has(response[1], 'facebookProfile')
							? response[1].facebookProfile
							: '',
						Insta: _.has(response[1], 'instagramProfile')
							? response[1].instagramProfile
							: '',
						Linkedin: _.has(response[1], 'linkedInProfile')
							? response[1].linkedInProfile
							: '',
						Pinterest: _.has(response[1], 'pinterestProfile')
							? response[1].pinterestProfile
							: '',
						Spotify: _.has(response[1], 'spotifyProfile')
							? response[1].spotifyProfile
							: '',
						Steam: _.has(response[1], 'steamProfile') ? response[1].steamProfile : '',
						Telegram: _.has(response[1], 'telegramProfile')
							? response[1].telegramProfile
							: '',
						Tiktok: _.has(response[1], 'tiktokProfile')
							? response[1].tiktokProfile
							: '',
						// Twitter: _.has(response[1], 'instagramProfile')
						// ? response[1].instagramProfile
						// : '',
						// X: _.has(response[1], 'instagramProfile')
						// ? response[1].instagramProfile
						// : '',
						Website: _.has(response[1], 'website') ? response[1].website : '',
						Youtube: _.has(response[1], 'youtubeProfile')
							? response[1].youtubeProfile
							: '',
						currency:
							response[1]?.defaultCurrency ||
							response[1]?.locationDetails?.userCurrency ||
							response[1]?.locationDetails?.currency ||
							'INR',
					},
					customDomain: _.has(response[1], 'customDomain')
						? response[1].customDomain
						: '',
					currency:
						response[1]?.defaultCurrency ||
						response[1]?.locationDetails?.userCurrency ||
						response[1]?.locationDetails?.currency ||
						'INR',
				},
				() => {
					// this.props.setTenantsData(this.state?.tenantsData);
				},
			);
		}
		return response;
	};

	getVariables = async (moduleId, moduleType = null, version = 0) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let module;
		let response;
		if (moduleId) {
			// module = moduleId;
			module = moduleId;
		} else {
			module = this.state.activeModuleId;
		}
		if (version === 1 || this.state.isWorkflow) {
			response = await Action.getSmartFileVariables(workspaceId, module, userToken);
		} else {
			response = await Action.getVariables(workspaceId, module, userToken);
		}

		if (response[0] == true) {
			let variables = { ...response[1] };

			if (
				_.has(response[1], 'custom') &&
				moduleType !== null &&
				(moduleType === 'proposal' || moduleType === '*')
			) {
				//variables = [...variables, ...response[1].custom];
				if (_.size(_.filter(response[1].custom, { displayName: 'Grand Total' })) == 0) {
					let json = {
						displayName: 'Grand Total',
						inputType: 'amount',
						defaultValue: '0',
						templateId: moduleId,
					};
					this.postVariables(json, moduleId);
				}
				if (
					_.size(_.filter(response[1].custom, { displayName: 'Grand Total In Words' })) ==
					0
				) {
					let json = {
						displayName: 'Grand Total In Words',
						inputType: 'amount',
						defaultValue: 'zero',
						templateId: moduleId,
					};
					this.postVariables(json, moduleId);
				}
			}
			this.setState({
				isVariabelsLoading: false,
				variables,
				fieldData: variables,
			});
		}
	};
	postVariables = async (json, moduleId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');

		let response = await Action.postVariables(json, workspaceId, moduleId, userToken);
		if (response[0] == true) {
			this.setState(
				{
					isVariabelsLoading: false,
				},
				() => {
					this.getVariables(this.props.params.templateID);
				},
			);
		}
	};

	postIndividulVariables = async (json, moduleId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		const params = new URLSearchParams(window.location.search);
		const stemplateId = params.get('templateId');

		let response = await Action.postVariables(
			json,
			workspaceId,
			stemplateId || moduleId,
			userToken,
		);
		if (response[0] == true) {
			this.setState(
				{
					isVariabelsLoading: false,
				},
				() => {
					if (_.has(this.state.template, 'version')) {
						this.getVariables(this.state.workflow_id, this.state.module, 1);
					} else {
						this.getVariables(
							stemplateId || this.props.params.templateID,
							this.state?.module,
						);
					}
				},
			);
		}
	};

	updateVariables = async (json, moduleId, variableId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.updateVariables(
			json,
			workspaceId,
			// moduleId,
			userToken,
			variableId,
		);
		if (response[0] == true) {
			this.setState(
				{
					isVariabelsLoading: false,
				},
				() => {
					// update the state variables
					// this.getVariables(this.props.params.templateID);
					let variableType = response[1].type;
					let updatedVariables = { ...this.state.variables };
					updatedVariables[variableType] = updatedVariables[variableType].map(
						(variable) => {
							if (variable._id === variableId) {
								return response[1];
							}
							return variable;
						},
					);
					this.setState({ variables: updatedVariables });
				},
			);
		}
	};
	deleteVariable = async (moduleId, variableId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');

		let response = await Action.deleteVariable(workspaceId, userToken, variableId);
		if (response[0] == true) {
			this.setState(
				{
					isVariabelsLoading: false,
				},
				() => {
					this.getVariables(moduleId);
				},
			);
		}
	};
	getFonts = async (
		workspaceId = localStorage.getItem('workspaceId'),
		userToken = localStorage.getItem('usertoken'),
	) => {
		let response = await Action.getFonts(workspaceId, userToken);
		if (response[0] == true) {
			this.setState({
				fonts: response[1],
				fontsLoading: false,
			});
		}
	};
	createLayout = async (json) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.createLayout(workspaceId, json, userToken);

		if (response[0] === true) {
		}
	};

	addServiceTableBlock = async (sectionID, order, services_style) => {
		let json;
		json = {
			sectionType: 'services',
			order,
		};
		let templateID = this.state.activeModuleId;
		let workspace = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.addServiceTableBlock(
			workspace,
			json,
			sectionID,
			templateID,
			userToken,
		);
		if (response[0] === true) {
			let invoiceTables = [...this.state.invoiceTables];
			const sections = [...(response?.[1]?.sections || [])];

			for (let i = 0; i < sections?.length; i++) {
				if (sections?.[i]?.type === 'services') {
					let servicesObj = { ...(sections?.[i] || {}) };
					let style = { ...(servicesObj?.style || {}) };
					style.services_style = services_style;
					servicesObj.style = style;
					sections.splice(i, 1, servicesObj);
					break;
				}
			}

			this.setState(
				{
					sections: this.reorderSections(sections),
					sectionVariables: response[1].variables ? response[1].variables : [],
					sectionTables: response[1].tables ? response[1].tables : [],
					module: response[1].module,
					activeBlock: _.filter(sections, { _id: sectionID })[0],
				},
				() => {
					if (this.state.isWorkflow) {
						this.setState({
							invoiceTables: response[1].tables
								? invoiceTables.concat(response[1].tables)
								: invoiceTables,
						});
					}
				},
			);
			//return true;
		}
	};

	addWorkflowServiceTableBlock = async (sectionID, order, services_style) => {
		let json;
		json = {
			sectionType: 'services',
			order,
		};
		let templateID = this.state.activeModuleId;
		let workspace = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.addWorkflowServiceTableBlock(
			workspace,
			json,
			sectionID,
			this.state.module,
			this.state.activeWorkflowModuleId,
			this.state.activeVersionId,
			userToken,
		);
		if (response[0] === true) {
			const sections = [...(response?.[1]?.versions?.[0]?.sections || [])];

			for (let i = 0; i < sections?.length; i++) {
				if (sections?.[i]?.type === 'services') {
					let servicesObj = { ...(sections?.[i] || {}) };
					let style = { ...(servicesObj?.style || {}) };
					style.services_style = services_style;
					servicesObj.style = style;
					sections.splice(i, 1, servicesObj);
					break;
				}
			}
			let invoiceTables = [...this.state.invoiceTables];
			this.setState(
				{
					sections: this.reorderSections(sections),
					sectionVariables: response[1].versions[0].variables
						? response[1].versions[0].variables
						: [],
					sectionTables: response[1].versions[0].tables
						? response[1].versions[0].tables
						: [],
					module: response[1].versions[0].module || this.state.module,
					activeBlock: _.filter(sections, { _id: sectionID })[0],
				},
				() => {
					if (this.state.isWorkflow) {
						this.setState({
							invoiceTables: response[1].versions[0].tables
								? invoiceTables.concat(response[1].versions[0].tables)
								: invoiceTables,
						});
					}
				},
			);
			//return true;
		}
	};
	duplicateSubBlock = async (json, blockId, sectionId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let templateID = this.state.activeModuleId;
		let response = await Action.duplicateSubBlock(
			workspaceId,
			json,
			templateID,
			sectionId,
			blockId,
			userToken,
		);
		if (response[0] === true) {
			this.setState({
				sections: this.reorderSections(response[1].sections),
				didChangedSomething:
					this.state?.previewType == 'm' ? this.state?.didChangedSomething : true,
			});
		}
	};
	duplicateWorkflowSubBlock = async (json, blockId, sectionId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let templateID = this.state.activeModuleId;
		let response = await Action.duplicateWorkflowSubBlock(
			json,
			workspaceId,
			this.state.module,
			this.state.activeWorkflowModuleId,
			this.state.activeVersionId,
			sectionId,
			blockId,
			userToken,
		);

		if (response[0] === true) {
			this.setState({
				sections: this.reorderSections(response[1].versions[0].sections),
				didChangedSomething:
					this.state?.previewType == 'm' ? this.state?.didChangedSomething : true,
			});
		}
	};
	duplicateWorkflowEventBlock = async (json, blockId, sectionId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let templateID = this.state.activeModuleId;
		let response = await Action.duplicateWorkflowEventBlock(
			json,
			workspaceId,
			this.state.module,
			this.state.activeWorkflowModuleId,
			this.state.activeVersionId,
			sectionId,
			blockId,
			userToken,
		);
		if (response[0] === true) {
			this.setState({
				sections: this.reorderSections(response?.[1]?.versions?.[0]?.sections),
			});
		}
	};
	addSection = async (
		workspaceId,
		json,
		templateID,
		userToken = localStorage.getItem('usertoken'),
	) => {
		let workspace = localStorage.getItem('workspaceId');
		let response = await Action.addSection(workspace, json, templateID, userToken);

		if (response[0] === true) {
			let invoiceTables = [...this.state.invoiceTables];
			this.setState(
				{
					showAddBlock: false,
					sections: this.reorderSections(response[1].sections),
					sectionTables: response[1].tables ? response[1].tables : [],
					order: null,
					nextOrder: null,
					prevOrder: null,
				},
				() => {
					if (this.state.isWorkflow) {
						this.setState({
							invoiceTables: response[1].tables
								? invoiceTables.concat(response[1].tables)
								: invoiceTables,
						});
					}

					let updatedSections = _.cloneDeep(this.state.sections);

					let Fulljson = {
						sections: updatedSections,
						tables: this.state.sectionTables,
						variables: this.state.sectionVariables,
					};

					// updating to all sections api bcx need to update the section order for proper placement
					this.putSections(Fulljson, null, null, null, null);
				},
			);
			//return true;
		}
	};
	addSubBlock = async (
		json,
		blockID,
		sectionID,
		templateID,
		userToken = localStorage.getItem('usertoken'),
	) => {
		let workspace = localStorage.getItem('workspaceId');
		let response;
		if (this.state.isWorkflow) {
			response = await Action.addWorkflowSubBlock(
				workspace,
				json,
				templateID,
				sectionID,
				blockID,
				userToken,
				this.state.module,
				this.state.activeWorkflowModuleId,
				this.state.activeVersionId,
			);
		} else {
			response = await Action.addSubBlock(
				workspace,
				json,
				templateID,
				sectionID,
				blockID,
				userToken,
			);
		}
		if (response[0] === true) {
			let resp;
			let respTables;
			if (this.state.isWorkflow) {
				resp = response[1].versions[0].sections;
				respTables = response[1].versions[0].tables || [];
			} else {
				resp = response[1].sections;
				respTables = response[1].tables || [];
			}
			this.setState(
				{
					showAddBlock: false,
					sections: this.reorderSections(resp),
					sectionTables: respTables,
					order: null,
					nextOrder: null,
					prevOrder: null,
					didChangedSomething:
						this.state?.previewType == 'm' ? this.state?.didChangedSomething : true,
				},
				() => {
					let invoiceTables = [...this.state.invoiceTables];
					let activeSection;
					activeSection = _.filter(this.state.sections, {
						_id: this.state.activeSectionID,
					})[0];
					this.setState({
						activeBlock: activeSection,
					});
					if (this.state.isWorkflow) {
						this.setState({
							invoiceTables: respTables
								? invoiceTables.concat(respTables)
								: invoiceTables,
						});
					}
				},
			);
			//return true;
		}
	};

	addServiceVariable = async (sectionID, sections, tables) => {
		// console.log('addServiceVariable======>karthikeya', sectionID, sections, tables);
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let servicesArray = sections.filter((section) => section.type === 'services');
		let key = [];
		_.map(servicesArray, (serv, k) => {
			if (serv._id == sectionID) {
				key.push(k);
			}
		});

		// console.log('key======>karthikeya', key);

		let json = {
			displayName: `serviceSubTotal${key[0] + 1}`,
			inputType: 'amount',
			defaultValue: '0',
			blockId: sectionID,
			templateId: this.state.activeModuleId,
		};

		if (this.state.isWorkflow) {
			json.workflowId = this.state.workflow_id;
		}

		let response = await Action.addServiceVariable(json, workspaceId, sectionID, userToken);
		if (response[0] == true) {
			let invoiceTables = [...this.state.invoiceTables];
			this.setState(
				{
					showAddBlock: false,
					sections: this.reorderSections(sections),
					sectionTables: tables,
					order: null,
					nextOrder: null,
					prevOrder: null,
				},
				() => {
					if (this.state.isWorkflow) {
						this.getVariables(this.state.workflow_id, this.state.module, 1);
					} else {
						this.getVariables(this.props.params.templateID);
					}
				},
			);
			if (this.state.isWorkflow) {
				this.setState({
					invoiceTables: tables ? invoiceTables.concat(tables) : invoiceTables,
				});
			}
		}
	};
	addLayout = async (
		workspaceId,
		json,
		templateID,
		isService = false,
		themes = null,
		userToken = localStorage.getItem('usertoken'),
	) => {
		let workspace = localStorage.getItem('workspaceId');
		let response = await Action.addLayout(workspace, json, templateID, userToken);
		// console.log('response======>karthikeya', response);

		if (response[0] === true) {
			let sections = [...response[1].sections];
			let updatedSectionId = response?.[1]?.sectionId;
			if (isService) {
				this.setState({
					sectionTables: response[1].tables ? response[1].tables : [],
					didChangedSomething:
						this.state?.previewType == 'm' ? this.state?.didChangedSomething : true,
				});
				this.addServiceVariable(
					_.filter(sections, { type: 'services', order: json.order })[0]._id,
					sections,
					response[1].tables ? response[1].tables : [],
				);
			} else {
				let invoiceTables = [...this.state.invoiceTables];
				sections = this.reorderSections(sections);
				this.setState({
					showAddBlock: false,
					sections,
					sectionTables: response[1].tables ? response[1].tables : [],
					order: null,
					nextOrder: null,
					prevOrder: null,
					didChangedSomething:
						this.state?.previewType == 'm' ? this.state?.didChangedSomething : true,
				});
				if (this.state.isWorkflow) {
					this.setState({
						invoiceTables: response[1].tables
							? invoiceTables.concat(response[1].tables)
							: invoiceTables,
					});
				}
			}

			if (themes) {
				this.setState({
					applyThemeLoader: true,
				});

				// updating to all sections api bcx need to update the section order for proper placement
				sections.forEach((section) => {
					if (section._id === response?.[1]?.sectionId) {
						section.style.sectionBackgroundColor = themes?.colors?.background;
					}
				});

				let json = {
					sections,
					tables: response[1].tables,
					variables: response[1].variables,
				};

				this.putSections(json, null, null, null, null);
			}
			//return true;
		}
	};

	addWorkflowLayout = async (workspaceId, json, isFluid, isService) => {
		let workspace = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.addWorkflowLayout(
			json,
			workspace,
			this.state.module,
			this.state.activeWorkflowModuleId,
			this.state.activeVersionId,
			userToken,
			isFluid,
		);

		if (response[0] === true) {
			let sections = [...response[1]?.versions?.[0]?.sections];

			if (isService) {
				this.setState({
					sectionTables: response[1]?.versions?.[0]?.tables
						? response[1]?.versions?.[0]?.tables
						: [],
					didChangedSomething:
						this.state?.previewType == 'm' ? this.state?.didChangedSomething : true,
				});
				this.addServiceVariable(
					_.filter(sections, { type: 'services', order: json.order })[0]._id,
					sections,
					response[1]?.versions?.[0]?.tables ? response[1]?.versions?.[0]?.tables : [],
				);
			} else {
				let invoiceTables = [...this.state.invoiceTables];
				this.setState(
					{
						showAddBlock: false,
						sections: this.reorderSections(response[1].versions[0].sections),
						sectionTables: response[1].versions[0].tables
							? response[1].versions[0].tables
							: [],
						order: null,
						nextOrder: null,
						prevOrder: null,
						didChangedSomething:
							this.state?.previewType == 'm' ? this.state?.didChangedSomething : true,
					},
					() => {
						if (this.state.isWorkflow) {
							this.setState({
								invoiceTables: response[1].versions[0].tables
									? invoiceTables.concat(response[1].versions[0].tables)
									: invoiceTables,
							});
						}
					},
				);
				//return true;
			}
		}
	};

	addQuestionForForm = async (sectionID, order) => {
		let json;
		json = {
			type: 'shortText',
			order,
			question: '<p><i>Your question goes here</i></p>',
		};
		let templateID = this.state.activeModuleId;
		let workspace = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.addServiceTableBlock(
			workspace,
			json,
			sectionID,
			templateID,
			userToken,
		);
		if (response[0] === true) {
			let invoiceTables = [...this.state.invoiceTables];
			this.setState(
				{
					sections: response[1]?.sections,
					sectionVariables: response[1]?.variables ? response[1].variables : [],
					sectionTables: response[1]?.tables ? response[1].tables : [],
					module: response[1]?.module,
				},
				() => {
					if (this.state.isWorkflow) {
						this.setState({
							invoiceTables: response[1].tables
								? invoiceTables.concat(response[1].tables)
								: invoiceTables,
						});
					}
				},
			);
			//return true;
		}
	};

	addWorkflowQuestionForForm = async (sectionID, order) => {
		let json;
		json = {
			type: 'shortText',
			order,
			question: '<p><i>Your question goes here</i></p>',
		};
		let workspace = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.addWorkflowServiceTableBlock(
			workspace,
			json,
			sectionID,
			this.state.module,
			this.state.activeWorkflowModuleId,
			this.state.activeVersionId,
			userToken,
		);
		if (response[0] === true) {
			let invoiceTables = [...this.state.invoiceTables];
			this.setState({
				sections: response[1]?.versions[0]?.sections,
				sectionVariables: response[1]?.versions[0]?.variables
					? response[1].versions[0].variables
					: [],
				sectionTables: response[1]?.versions[0]?.tables
					? response[1].versions[0].tables
					: [],
				module: response[1]?.versions[0]?.module || this.state.module,
			});
			if (this.state.isWorkflow) {
				this.setState({
					invoiceTables: response[1].versions[0].tables
						? invoiceTables.concat(response[1].versions[0].tables)
						: invoiceTables,
				});
			}
			//return true;
		}
	};

	deleteSectionItem = async (sectionID) => {
		let templateID = this.state?.activeModuleId;
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.deleteSection(
			templateID,
			sectionID,
			workspaceId,

			userToken,
		);
		let sections = [...this.state.sections];
		this.setState({
			saveProposalState: 'Saving...',
		});

		let variables = _.filter(this.state?.variables?.custom, { blockId: sectionID });

		if (_.size(variables) > 0) {
			await this.deleteVariable(this.state.activeModuleId, variables[0]._id);

			if (response[0] == true) {
				let invoiceTables = [...this.state.invoiceTables];
				this.setState(
					{
						sections: this.reorderSections(response[1].sections),
						sectionVariables: response[1].variables ? response[1].variables : [],
						sectionTables: response[1].tables ? response[1].tables : [],
						module: response[1].module,
						isAutoSaving: false,
					},
					() => {
						if (this.state.isWorkflow) {
							this.setState({
								invoiceTables: response[1].tables
									? invoiceTables.concat(response[1].tables)
									: invoiceTables,
							});
						}
					},
				);
			} else {
				return false;
			}
		}
	};

	deleteWorkflowSectionItem = async (sectionID) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.deleteWorkflowSection(
			sectionID,
			workspaceId,
			this.state.module,
			this.state.activeWorkflowModuleId,
			this.state.activeVersionId,
			userToken,
		);
		this.setState({
			saveProposalState: 'Saving...',
		});
		if (response[0] === true) {
			let invoiceTables = [...this.state.invoiceTables];
			this.setState({
				sections: this.reorderSections(response[1].versions[0].sections),
				sectionVariables: response[1].versions[0].variables
					? response[1].versions[0].variables
					: [],
				sectionTables: response[1].versions[0].tables ? response[1].versions[0].tables : [],
				module: response[1].versions[0].module || this.state.module,
				isAutoSaving: false,
			});
			if (this.state.isWorkflow) {
				this.setState({
					invoiceTables: response[1].versions[0].tables
						? invoiceTables.concat(response[1].versions[0].tables)
						: invoiceTables,
				});
			}
		} else {
			return false;
		}
	};

	handleDeleteBlock = async (blockID, sectionID) => {
		let templateID = this.state.activeModuleId;
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.deleteBlock(
			templateID,
			blockID,
			sectionID,
			workspaceId,

			userToken,
		);
		this.setState({
			saveProposalState: 'Saving...',
		});
		if (response[0] === true) {
			let invoiceTables = [...this.state.invoiceTables];
			this.setState({
				sections: this.reorderSections(response[1].sections),
				sectionVariables: response[1].variables ? response[1].variables : [],
				sectionTables: response[1].tables ? response[1].tables : [],
				module: response[1].module,
			});
			if (this.state.isWorkflow) {
				this.setState({
					invoiceTables: response[1].tables
						? invoiceTables.concat(response[1].tables)
						: invoiceTables,
				});
			}
		} else {
			return false;
		}
	};

	handleWorkflowDeleteBlock = async (blockID, sectionID) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.deleteWorkflowBlock(
			blockID,
			sectionID,
			workspaceId,
			this.state.module,
			this.state.activeWorkflowModuleId,
			this.state.activeVersionId,
			userToken,
		);
		this.setState({
			saveProposalState: 'Saving...',
		});
		if (response[0] === true) {
			let invoiceTables = [...this.state.invoiceTables];
			this.setState({
				sections: this.reorderSections(response[1].versions[0].sections),
				sectionVariables: response[1].versions[0].variables
					? response[1].versions[0].variables
					: [],
				sectionTables: response[1].versions[0].tables ? response[1].versions[0].tables : [],
				module: response[1].versions[0].module || this.state.module,
			});
			if (this.state.isWorkflow) {
				this.setState({
					invoiceTables: response[1].versions[0].tables
						? invoiceTables.concat(response[1].versions[0].tables)
						: invoiceTables,
				});
			}
		} else {
			return false;
		}
	};

	saveSubBlockContentAPI = async (content, sectionID, blockID, id) => {
		let templateID = this.state.activeModuleId;
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.saveSectionBlockSubBlockContent(
			templateID,
			sectionID,
			blockID,
			id,
			(content = { content }),
			workspaceId,
			userToken,
		);

		if (response[0] === true) {
			let invoiceTables = [...this.state.invoiceTables];
			this.setState({
				sections: this.reorderSections(response[1].sections),
				sectionVariables: response[1].variables ? response[1].variables : [],
				sectionTables: response[1].tables ? response[1].tables : [],
				module: response[1].module,
			});
			if (this.state.isWorkflow) {
				this.setState({
					invoiceTables: response[1].tables
						? invoiceTables.concat(response[1].tables)
						: invoiceTables,
				});
			}
		} else {
			return false;
		}
	};

	putSections = async (
		json,
		templateId = null,
		restrictState = null,
		generate = null,
		isSummary = null,
		actionBlockState = null,
	) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.putTemplate(
			json,
			workspaceId,
			templateId
				? templateId
				: isSummary == true
				? this.state.summaryModuleId
				: this.state.activeModuleId,
			userToken,
		);
		if (response[0] === true) {
			if (this.state.module === 'form' && this.state.isHeader) {
			} else {
				if (this.state.activeSectionID && this.state.activeSectionID !== null) {
					if (actionBlockState == true) {
					} else {
						this.setState({
							activeBlock: _.filter(
								this.reorderSections(response[1].sections, 'putSections'),
								{ _id: this.state.activeSectionID },
							)[0],
						});
					}
				}
			}
			let invoiceTables = [...this.state.invoiceTables];
			if (restrictState == null) {
				this.setState({
					isSaveLoading: false,
					sections: this.reorderSections(response[1].sections, 'putSections'),
					sectionVariables: response[1].variables ? response[1].variables : [],
					sectionTables: response[1].tables ? response[1].tables : [],
					//title: response[1].title,
					isGeneratePreview: false,
					//preview: false,
					//previewType: 'd',
					isAutoSaving: false,
					didChangedSomething:
						this.state?.previewType == 'm' ? this.state?.didChangedSomething : true,
				});
				if (this.state.isWorkflow) {
					this.setState({
						invoiceTables: response[1].tables
							? invoiceTables.concat(response[1].tables)
							: invoiceTables,
					});
				}
			} else {
				this.setState({
					isSaveLoading: false,

					//sectionTables: response[1].tables ? response[1].tables : [],
					isAutoSaving: false,
					callApi: true,
					didChangedSomething:
						this.state?.previewType == 'm' ? this.state?.didChangedSomething : true,
				});
			}

			if (templateId && generate == null) {
				window.location.href = `https://ve.ai/home`;
			}
		}
	};

	/**
	 * Update single block
	 *
	 * @param {Object} json - The JSON object containing the updated block data
	 * @param {string} sectionId - The ID of the section to update
	 * @param {string} templateId - The ID of the template to update
	 * @returns {Promise<Object>} The response from the API call
	 */
	putSingleBlockSection = async (json = {}, sectionId = null, templateId = null) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');

		let response = await Action.singleSectionEdit(
			workspaceId,
			json,
			templateId || this.state.activeModuleId,
			sectionId || this.state.activeSectionID,
			userToken,
		);
		if (response[0] == true) {
			this.setState({
				sections: this.reorderSections(response[1].sections),
				sectionVariables: response[1].variables ? response[1].variables : [],
				sectionTables: response[1].tables ? response[1].tables : [],
			});
		}

		return response;
	};

	//   Update single block in workflow true

	putSingleWorkflowBlockSection = async (json = {}, sectionId = null, templateId = null) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');

		let response = await Action.singleWorkflowSectionEdit(
			json,
			workspaceId,
			this.state.module,
			this.state.activeWorkflowModuleId,
			this.state.activeVersionId,
			sectionId || this.state.activeSectionID,
			userToken,
		);

		if (response[0] == true) {
			this.setState({
				sections: this.reorderSections(response[1].versions[0].sections),
			});
		}

		return response;
	};

	putWorkflowSections = async (json, templateId = null, restrictState = null) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');

		let response = await Action.putWorkflowTemplate(
			json,
			workspaceId,
			this.state.module === 'summary' ? 'proposal' : this.state.module,
			this.state.activeWorkflowModuleId,
			this.state.activeVersionId,
			userToken,
		);
		if (response[0] == true) {
			if (this.state.module === 'form' && this.state.isHeader) {
			} else {
				if (this.state.activeSectionID && this.state.activeSectionID !== null) {
					this.setState({
						activeBlock: _.filter(
							this.reorderSections(response[1].versions[0].sections, 'putSections'),
							{ _id: this.state.activeSectionID },
						)[0],
					});
				}
			}
			let invoiceTables = [...(this.state?.invoiceTables || [])];
			let sectionTables = response[1].versions[0].tables
				? response[1].versions[0].tables
				: [];

			let globalTables = this.state.globalTables.map((table) => {
				let isPageTableExist = _.find(sectionTables, { _id: table._id });
				if (isPageTableExist) {
					return isPageTableExist;
				}
				return table;
			});
			if (restrictState == null) {
				this.setState({
					isSaveLoading: false,
					sections: this.reorderSections(response[1].versions[0].sections, 'putSections'),
					sectionVariables: response[1].versions[0].variables
						? response[1].versions[0].variables
						: [],
					sectionTables,
					globalTables,
					title: response[1].title,
					isGeneratePreview: false,
					//preview: false,
					//previewType: 'd',
					isAutoSaving: false,
					didChangedSomething:
						this.state?.previewType == 'm' ? this.state?.didChangedSomething : true,
				});
				if (this.state.isWorkflow) {
					this.setState({
						invoiceTables: response[1].versions[0].tables
							? invoiceTables.concat(response[1].versions[0].tables)
							: invoiceTables,
					});
				}
			} else {
				this.setState({
					isSaveLoading: false,

					//sectionTables: response[1].tables ? response[1].tables : [],
					isAutoSaving: false,
				});
			}

			if (templateId) {
				window.location.href = `https://app.ve.ai/sales/${response[1]['_id']}`;
			}
		}
	};

	duplicateTemplate = async (json, payload) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.duplicateTemplate(
			json,
			workspaceId,
			this.state.activeModuleId,
			userToken,
		);
		if (response[0] == true) {
			await this.putSections(payload, response[1]['_id']);
		}
	};

	duplicateBlock = async (json, sectionId, templateId = null) => {
		let userToken = localStorage.getItem('usertoken');
		let workspaceId = localStorage.getItem('workspaceId');

		let response = await Action.duplicateBlock(
			json,
			sectionId,
			templateId ? templateId : this.state.activeModuleId,
			userToken,
			workspaceId,
		);
		if (response[0] === true) {
			let sections = [...response[1].sections];
			let invoiceTables = [...this.state.invoiceTables];
			let isService =
				_.filter(response[1].sections, { _id: sectionId })[0].type === 'services';
			if (isService) {
				this.addServiceVariable(
					_.filter(sections, { type: 'services', order: json.order })[0]._id,
					sections,
					response[1].tables ? response[1].tables : [],
				);
			}
			if (this.state.isWorkflow) {
				this.setState({
					invoiceTables: response[1].tables
						? invoiceTables.concat(response[1].tables)
						: invoiceTables,
				});
			}
			this.setState({
				sections: this.reorderSections(response[1].sections),
				sectionTables: response[1].tables ? response[1].tables : [],
			});
		}
	};

	duplicateWorkflowBlock = async (json, sectionId, templateId = null) => {
		let userToken = localStorage.getItem('usertoken');
		let workspaceId = localStorage.getItem('workspaceId');

		let response = await Action.duplicateWorkflowBlock(
			json,
			sectionId,
			workspaceId,
			this.state.module,
			this.state.activeWorkflowModuleId,
			this.state.activeVersionId,
			userToken,
		);
		if (response[0] === true) {
			this.setState({
				sections: this.reorderSections(response[1].versions[0].sections),
				sectionTables: response[1].versions[0].tables ? response[1].versions[0].tables : [],
			});
		}
	};

	duplicateServiceBlock = async (json, blockId, sectionId) => {
		let userToken = localStorage.getItem('usertoken');
		let workspaceId = localStorage.getItem('workspaceId');
		let response = await Action.duplicateServiceBlock(
			json,
			blockId,
			sectionId,
			this.state.activeModuleId,
			userToken,
			workspaceId,
		);
		if (response[0] === true) {
			this.setState({
				sections: this.reorderSections(response[1].sections),
				sectionTables: response[1].tables ? response[1].tables : [],
			});
		}
	};

	duplicateWorkflowServiceBlock = async (json, blockId, sectionId) => {
		let userToken = localStorage.getItem('usertoken');
		let workspaceId = localStorage.getItem('workspaceId');
		let response = await Action.duplicateWorkflowServiceBlock(
			json,
			blockId,
			sectionId,
			workspaceId,
			this.state.module,
			this.state.activeWorkflowModuleId,
			this.state.activeVersionId,
			userToken,
		);
		if (response[0] === true) {
			this.setState({
				sections: this.reorderSections(response[1].versions[0].sections),
				sectionTables: response[1].versions[0].tables ? response[1].versions[0].tables : [],
			});
		}
	};
	updateModules = async (
		query,
		variables,
		setState = false,
		type = null,
		isWorkflow = false,
		isSidebar = false,
	) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		let response = await Service.query(
			query,
			variables,
			workspaceId,
			this.props.params.templateID,
			usertoken,
		);

		if (response[0] == true) {
			if (setState == false) {
				return [true];
			} else {
				if (isSidebar) {
					if (response[0] == true) {
						this.setState({
							modules: response[1].data?.updateWorkflow?.modules,
							activeModule: response[1].data?.updateWorkflow?.modules.filter(
								(active) => active._id === this.state.activeModuleId,
							)[0],
						});
					}
				} else {
					let modules = isWorkflow
						? response[1].data[`${type}ModuleTemplate`].modules
						: response[1].data[`${type}ModuleTemplate`].moduleTemplates;
					this.setState({
						duplicateModules: modules,
						modules: modules,
					});
				}
			}
		} else {
			return [false];
		}
	};
	getTemplateList = async (query, variables, isWorkflow = false) => {
		let data = { ...this.state.templateList };
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, null, usertoken);

		if (response[0] == true) {
			let templates = isWorkflow ? response[1].data.workflows : response[1].data.templates;
			this.setState({
				templateList: {
					...data,
					data: templates,
				},
			});
		}
	};
	getWorkflowInfo = async (
		query,
		getModules = false,
		workflow = null,
		callVariableApi = true,
	) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let workflowID = workflow !== null ? workflow : this.props.params.templateID;
		let usertoken = localStorage.getItem('usertoken');
		let response = await Service.query(
			query,
			{ getDetailedTemplateInfoId: workflowID },
			workspaceId,
			workflowID,
			usertoken,
		);
		if (response[0] == true) {
			let template = response?.[1]?.data?.getDetailedTemplateInfo?.template?.[0];

			let modules = response?.[1]?.data?.getDetailedTemplateInfo?.moduleTemplates;
			let mobileViewLocked =
				response?.[1]?.data?.getDetailedTemplateInfo?.mobileViewLocked || false;
			const sortedObject = [...(modules || [])]
				.filter((module) => module?.hide !== true) // Exclude modules where hide is explicitly false
				.sort((a, b) => {
					return a?.isPublic === b?.isPublic ? 0 : a?.isPublic ? -1 : 1;
				});
			const duplicateModules = [...(modules || [])].sort((a, b) => {
				return a?.isPublic === b?.isPublic ? 0 : a?.isPublic ? -1 : 1;
			});
			if (workflow == null) {
				this.setState({
					isPromptLoading: false,
				});
			}
			this.setState(
				{
					template: response?.[1]?.data?.getDetailedTemplateInfo?.template?.[0],
					isLoading: false,
					sections: this?.reorderSections(template?.sections),
					headerSection: template?.header,
					isHeader: template?.isHeader,
					formBgColor: template?.backgroundColor,
					headerSectionId: template?.header?._id,
					sectionVariables: template?.variables ? template?.variables : [],
					isTheme: template?.isTheme,
					activeTheme: template?.theme,
					sectionVariablesClone: _.cloneDeep(template?.variables)
						? _.cloneDeep(template?.variables)
						: [],

					sectionTables: template?.tables ? template?.tables : [],
					module: template?.module,
					modules: sortedObject,

					title: response?.[1]?.data?.getDetailedTemplateInfo?.title,
					tenantLogo: response?.[1]?.data?.getDetailedTemplateInfo?.tenantLogo,
					activeModuleId: template?._id,
					duplicateModules,
					mobileViewLocked,
					activeModule: modules?.find((module) => module._id === template?._id),
					globalSummaryData: response?.[1]?.data?.getDetailedTemplateInfo?.summary,
					globalTables:
						response?.[1]?.data?.getDetailedTemplateInfo?.summary?.tables || [],
					navBar: response?.[1]?.data?.getDetailedTemplateInfo?.navBar,
					globalSections:
						response?.[1]?.data?.getDetailedTemplateInfo?.summary?.sections || [],
					themes: response?.[1]?.data?.getDetailedTemplateInfo?.themes || null,
					numOfDocuments: response?.[1]?.data?.getDetailedTemplateInfo?.workflows || 0,
					imageUrl: response?.[1]?.data?.getDetailedTemplateInfo?.imageUrl,
				},
				async () => {
					if (callVariableApi) {
						await this.getVariables(this.props.params.templateID, template?.module);
					}

					if (getModules === true) {
						this.getAllModules();
					}
				},
			);
		}
		return response;
	};
	duplicateWorkflow = async (query, variables, duplicateWorkflowQuery) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let workflowID = this.props.params.templateID;
		let usertoken = localStorage.getItem('usertoken');
		let response = await Service.query(
			query,
			variables,
			workspaceId,
			null,
			usertoken,
			'workflows',
		);
		if (response[0] == true) {
			this.setState(
				{
					workflowDuplicateID: response[1].data.duplicateWorkflowTemplate._id,
				},
				async () => {
					await this.getWorkflowInfo(
						duplicateWorkflowQuery,
						false,
						response[1].data.duplicateWorkflowTemplate._id,
					);
					await this.generateWorkflow(response[1].data.duplicateWorkflowTemplate._id);
				},
			);
		}
	};
	generateWorkflow = async (workflowID) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let json = {
			user_prompt: localStorage.getItem('prompt'),
			page_type: 'proposal',
		};
		let response = await Action.generateWorkflow(json, workspaceId, workflowID);
		if (response[0] == true) {
			localStorage.removeItem('title');
			this.setState({
				isPromptLoading: false,
			});
			this.props.navigate(`/builder/generate/templates/${workflowID}`);
		}
	};
	getIndividualTemplate = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, null, usertoken);
		if (response[0] == true) {
			let invoiceTables = [...this.state.invoiceTables];
			let version = response[1].data.getModuleTemplate;

			let previewModuleSections = this.state.previewModuleSections;

			previewModuleSections.push({
				module: version?.module,
				sections: version?.sections || [],
				id: version?._id,
				order: 1,
				variables: version?.variables,
				tables: version?.tables,
				isSectionLoaded: true,
				headerSection: version?.header,
				isHeader: version?.isHeader,
				formBgColor: version?.backgroundColor,
				headerSectionId: version?.header?._id,
			});

			this.setState({
				previewModuleSections,

				template: version,
				isLoading: false,
				sections: version?.sections || [],
				headerSection: version?.header,
				isHeader: version?.isHeader,
				formBgColor: version?.backgroundColor,
				headerSectionId: version?.header?._id,
				sectionVariables: version.variables ? version.variables : [],

				sectionVariablesClone: _.cloneDeep(version.variables)
					? _.cloneDeep(version.variables)
					: [],

				sectionTables: version.tables ? version.tables : [],
				module: version.module,
				activeModuleId: version._id,
				imageUrl: version?.imageUrl,
			});
			if (this.state.isWorkflow) {
				this.setState({
					invoiceTables: version.tables
						? invoiceTables.concat(version.tables)
						: invoiceTables,
				});
			}
		} else {
			return [false];
		}
	};
	getIndividualWorkflowInfo = async (query, getModules = false) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let workflowID = this.props.params.templateID;
		let usertoken = localStorage.getItem('usertoken');
		let response = await Service.query(
			query,
			{ getDetailedWorkflowInfoId: workflowID },
			workspaceId,
			workflowID,
			usertoken,
		);

		if (response[0] == true) {
			let version = response?.[1]?.data?.workflowInfo?.doc?.versions?.[0];
			let template = response?.[1]?.data?.workflowInfo?.template;
			let moduleVersion = response?.[1]?.data?.workflowInfo?.version || 0;
			let workflow_id = response?.[1]?.data?.workflowInfo?._id;
			let modules = [];
			const params = new URLSearchParams(window.location.search);
			const stemplateId = params.get('templateId');

			if (moduleVersion === 1) {
				await this.getVariables(workflow_id, template?.module, 1);
			} else {
				await this.getVariables(
					stemplateId || this.props.params.templateID,
					template.module,
				);
			}

			_.map(response[1].data.workflowInfo.modules, (mod, key) => {
				modules.push({
					module: mod.type,
					order: mod.order,
					isPublic: mod.isPublic,
					templateId: mod.templateId,
					hide: mod?.hide || false,
					_id: mod._id,
					label: mod.label,
					showAsSlide: mod.showAsSlide,
					showAsA4: mod.showAsA4 || false,
					showAsFull: mod.showAsFull || false,
					showType: mod.showType || 'full',
				});
			});
			const sortedObject = modules
				.filter((module) => module.hide !== true) // Exclude modules where hide is explicitly false
				.sort((a, b) => {
					return a?.isPublic === b?.isPublic ? 0 : a?.isPublic ? -1 : 1;
				});

			const duplicateModules = [...modules].sort((a, b) => {
				return a.isPublic === b.isPublic ? 0 : a.isPublic ? -1 : 1;
			});
			let invoiceTables = [...(this.state?.invoiceTables || [])];

			this.setState(
				{
					template: template,
					isLoading: false,
					sections: version?.sections,
					headerSection: version?.header,
					isHeader: version?.isHeader,
					formBgColor: version?.backgroundColor,
					headerSectionId: version?.header?._id,
					sectionVariables: version?.variables ? version?.variables : [],

					sectionVariablesClone: _.cloneDeep(template?.variables)
						? _.cloneDeep(version?.variables)
						: [],

					sectionTables: version?.tables ? version?.tables : [],
					module: template?.module,
					version: moduleVersion,
					modules: sortedObject,
					title: response?.[1]?.data?.workflowInfo?.title,
					tenantLogo: response?.[1]?.data?.workflowInfo?.tenantLogo,
					activeWorkflowModuleId: response?.[1]?.data?.workflowInfo?.doc?._id,
					activeVersionId: response?.[1]?.data?.workflowInfo?.doc?.activeVersion,
					duplicateModules,
					globalTables: response[1].data.workflowInfo.summary?.tables || [],
					globalSummaryData: response?.[1]?.data?.workflowInfo?.summary || {},
					invoiceDetails: {
						clientDetails: response?.[1]?.data?.workflowInfo?.clientDetails
							? response?.[1]?.data?.workflowInfo?.clientDetails.email
							: '-',
						clientDetailsName: response?.[1]?.data?.workflowInfo?.clientDetails
							? response?.[1]?.data?.workflowInfo?.clientDetails?.name
							: '-',
						createdAt: template?.createdAt,
					},
					activeModule: modules?.find((module) => module.templateId === template?._id),
					workflow_id: workflow_id,
					// template_ID: response?.[1]?.data?.workflowInfo?.template?.workflowTemplateDetails?.map((ele)=> ele._id)
					template_ID:
						response?.[1]?.data?.workflowInfo?.template?.workflowTemplateDetails?.[0]
							?._id,
					titleName: response?.[1]?.data?.workflowInfo?.template?.title,
					navBar: response?.[1]?.data?.workflowInfo?.navBar,
					themes: response?.[1]?.data?.workflowInfo?.themes || null,
					workflowTemplateID: response?.[1]?.data?.workflowInfo?.template?._id,
					invoiceSentDate: response[1]?.data?.workflowInfo?.sendAt,
					imageUrl: response?.[1]?.data?.workflowInfo?.imageUrl,
				},
				() => {
					if (getModules === true) {
						this.getAllModules();
					}
					if (this.state.isWorkflow) {
						this.setState({
							invoiceTables: version?.tables
								? invoiceTables.concat(version.tables)
								: invoiceTables,
						});
					}
				},
			);
		}

		return response;
	};
	updateWorkflowNavbar = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let workflowID = this.state.workflow_id;
		let usertoken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, workflowID, usertoken);
		if (response[0] == true) {
			this.setState({
				navBar: response[1]?.data?.updateWorkflow?.navBar,
				imageUrl: response[1]?.data?.updateWorkflow?.imageUrl,
			});
		}
	};

	getModuleTemplate = async (query, variables, activeModuleId = null, moduleOrder = null) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let workflowID = activeModuleId === null ? this.state.activeModuleId : activeModuleId;
		let usertoken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, workflowID, usertoken);

		if (response[0] == true) {
			let template = response[1].data.getModuleTemplate;
			let sects = template?.sections ? template?.sections : [];
			let sections = this.reorderSections(sects);
			if (response[1].data.getModuleTemplate.module === 'proposal') {
				await this.getVariables(this.props.params.templateID, template.module);
			}
			let invoiceTables = [...(this.state?.invoiceTables || [])];
			if (activeModuleId) {
				let previewModuleSections = this.state.previewModuleSections;

				previewModuleSections.push(
					{
						module: template?.module,
						sections,
						id: template?._id,
						order: moduleOrder,
						variables: template?.variables,
						tables: template?.tables,
						isSectionLoaded: true,
						// summary: {
						// 	summaryBg: template.summary?.summaryBg,
						// 	summaryFont: template.summary?.summaryFont,
						// 	summaryFontSize: template.summary?.summaryFontSize,
						// 	summaryFontColor: template.summary?.summaryFontColor,
						// },
					},
					// () => {
					// 	if (this.state.isWorkflow) {
					// 		this.setState({
					// 			invoiceTables: tables.tables
					// 				? invoiceTables.concat(tables.tables)
					// 				: invoiceTables,
					// 		});
					// 	}
					// },
				);
				this.setState({ previewModuleSections });
				if (this.state.isWorkflow) {
					this.setState({
						invoiceTables: template.tables
							? invoiceTables.concat(template.tables)
							: invoiceTables,
					});
				}
			} else {
				this.setState(
					{
						isLoading: false,
						sections,
						sectionVariables: template?.variables ? template.variables : [],

						sectionVariablesClone: _.cloneDeep(template?.variables)
							? _.cloneDeep(template.variables)
							: [],
						paymentSchedule: _.has(template, 'paymentSchedule')
							? template.paymentSchedule
							: [],

						sectionTables: template?.tables ? template.tables : [],
						module: template?.module,
						activeModuleId: template?._id,
						isAutoSaving: false,
						template: template,
						headerSection: template?.header,
						isHeader: template?.isHeader,
						formBgColor: template?.backgroundColor,
						isSectionLoaded: true,

						summaryBg: template?.summary?.summaryBg,
						summaryFont: template?.summary?.summaryFont,
						// activeFont:   template.summary?.summaryFont ,
						summaryFontSize: template?.summary?.summaryFontSize,
						summaryFontColor: template?.summary?.summaryFontColor,
						activeModule: this.state?.modules?.find(
							(module) => module._id === template?._id,
						),
						getModuleParams: {
							id: null,
							type: null,
						},
						previewMode: 'd',
						previewType: 'd',
						showSideBar: false,
						didChangedSomething: false,

						//title: response[1].data[`${type}Info`].title,
					},
					() => {
						if (this.state.isWorkflow) {
							this.setState({
								invoiceTables: template.tables
									? invoiceTables.concat(template.tables)
									: invoiceTables,
							});
						}
					},
				);
			}
		}
	};

	getWorkflowModuleTemplate = async (
		query,
		variables,
		activeModuleId = null,
		moduleOrder = null,
	) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let workflowID = activeModuleId === null ? this.state.activeModuleId : activeModuleId;
		let usertoken = localStorage.getItem('usertoken');

		let response = await Service.query(query, variables, workspaceId, workflowID, usertoken);

		if (response[0] == true) {
			let template = response[1].data.getWorkflowModule?.versions?.[0];

			let invoiceTables = [...this.state.invoiceTables];

			let ClientNameVariable =
				response?.[1]?.data?.getWorkflowModule?.versions?.[0]?.variables;

			if (ClientNameVariable) {
				this.setState({
					isClientVariable: true,
				});
			}
			ClientNameVariable =
				response[1]?.data?.getWorkflowModule?.versions?.[0]?.variables?.some((item) => {
					return item?._id === '619f75683f381fd66dac4b65';
				}) || false;

			if (ClientNameVariable) {
				this.setState({
					isClientVariable: true,
				});
			}

			if (activeModuleId) {
				let previewModuleSections = this.state.previewModuleSections;
				previewModuleSections.push(
					{
						module: variables.module,
						sections: template.sections ? template.sections : [],
						id: template._id,
						order: moduleOrder,
						variables: template.variables,
						tables: template.tables,
					},
					() => {
						if (this.state.isWorkflow) {
							this.setState({
								invoiceTables: template.tables
									? invoiceTables.concat(template.tables)
									: invoiceTables,
							});
						}
					},
				);
				this.setState({ previewModuleSections, isSectionLoaded: true });
			} else {
				this.setState(
					{
						isLoading: false,
						sections: template?.sections || [],
						sectionVariables: template?.variables || [],

						sectionVariablesClone: _.cloneDeep(template?.variables)
							? _.cloneDeep(template?.variables)
							: [],

						sectionTables: template?.tables || [],
						module: variables.module,
						activeWorkflowModuleId: variables.getWorkflowModuleId,
						// activeModuleId: template._id,
						activeVersionId: response[1].data.getWorkflowModule?.activeVersion,
						isAutoSaving: false,
						isSectionLoaded: true,
						//title: response[1].data[`${type}Info`].title,
						summaryBg: template?.summary?.summaryBg,
						summaryFont: template?.summary?.summaryFont,
						// activeFont:   template.summary?.summaryFont ,
						summaryFontSize: template?.summary?.summaryFontSize,
						summaryFontColor: template?.summary?.summaryFontColor,
						activeModule: this.state?.modules?.filter(
							(ele) => ele._id === this.state?.activeModuleId,
						)[0],
						getModuleParams: {
							id: null,
							type: null,
						},
						previewMode: 'd',
						previewType: 'd',
						showSideBar: false,
						didChangedSomething: false,
					},
					() => {
						if (this.state.isWorkflow && this.state.version === 0) {
							this.setState({
								invoiceTables: template?.tables
									? invoiceTables.concat(template?.tables)
									: invoiceTables,
							});
						}
					},
				);
			}
		}
	};

	publishWorkflow = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let workflowID = this.state.activeModuleId;
		let usertoken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, workflowID, usertoken);
		if (response[0] == true) {
			return [true];
		} else {
			return [false];
		}
	};

	updatepublishedWorkflow = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let workflowID = this.state.activeModuleId;
		let usertoken = localStorage.getItem('usertoken');
		try {
			let response = await Service.query(
				query,
				variables,
				workspaceId,
				workflowID,
				usertoken,
			);
			if (response[0] == true) {
				this.setState({
					title: response[1]?.data?.updateWorkflowTemplate?.title,
					mobileViewLocked: response[1]?.data?.updateWorkflow?.mobileViewLocked,
				});
				return [true];
			} else {
				return [false];
			}
		} catch (error) {
			console.error('Error while hitting api :', error);
		}
	};
	updatepublishedWorkflowPreview = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let workflowID = this.state.activeModuleId;
		let usertoken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, workflowID, usertoken);
		if (response[0] == true) {
			this.setState({
				title: response[1]?.data?.updateWorkflow?.title,
			});
			return [true];
		} else {
			return [false];
		}
	};

	// updateIndividualPublishedWorkflow = async (query, variables) => {
	// 	let workspaceId = localStorage.getItem('workspaceId');
	// 	let workflowID = this.state.activeModuleId;
	// 	let usertoken = localStorage.getItem('usertoken');
	// 	try {
	// 		let response = await Service.query(
	// 			query,
	// 			variables,
	// 			workspaceId,
	// 			workflowID,
	// 			usertoken,
	// 		);
	// 		if (response[0] == true) {
	// 			return response[1];
	// 		} else {
	// 			return [false];
	// 		}
	// 	} catch (error) {
	// 		console.error('Error while hitting api :', error);
	// 	}
	// };

	createLead = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, null, usertoken);
		if (response[0] == true) {
			const clientId = response?.[1]?.data?.createWorkflowFromTemplate?._id;

			return [true, clientId];
		} else {
			return [false];
		}
	};

	// for invoice
	getInvoiceNumber = async () => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.getInvoiceNumber(workspaceId, userToken);

		if (response[0] === true) {
			this.setState({ invoiceNumber: response[1].invoicePreferences[0] });
		}
	};
	putInvoiceNumber = async (invoiceNumber) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.putInvoiceNumber(invoiceNumber, workspaceId, userToken);

		if (response[0] === true) {
			// this.setState({invoiceNumber : invoiceNumber?.invoicePreferences[0]})
		}
	};
	generateAIText = async (json, type) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		let response = await Action.getAITextGeneration(workspaceId, type, json, usertoken);
		if (response[0] == true) {
			let generatedText;
			if (type === 'improve_text') {
				return {
					aiPromptLoading: false,
					generatedText: response[1]?.improved_text,
					textGenerated: true,
				};
			} else {
				return {
					aiPromptLoading: false,
					generatedText: response[1]?.generated_text,
					textGenerated: true,
				};
			}
		} else {
			return {
				aiPromptLoading: false,
				textGenerated: false,
				generatedText: 'Please try again !',
			};
		}
	};
	generateAIImages = async (json, type) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		let response = await Action.getAIImageGeneration(workspaceId, type, json, usertoken);
		if (response[0] == true) {
			return {
				aiPromptLoading: false,
				image_data: response[1]?.image_data,
				imagesGenerated: true,
			};
		} else {
			return {
				aiPromptLoading: false,
				imagesGenerated: false,
				image_data: null,
			};
		}
	};
	generateTemplate = async (variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		let response = await Action.generateTemplate(null, null, variables, null);

		if (response[0] == true) {
			this.setState(
				{
					json: response[1].page_structure,
				},
				async () => {
					await Promise.all(
						this.state.json.map((item, k) =>
							this.handleAddLayout(item.layoutId, k + 1, item.title),
						),
					);

					// Navigate only after all layouts have been added
					this.props.navigate(
						`/builder/generate/templates/${this.props.params.templateID}`,
					);
				},
			);
		}
	};
	getLayoutTextContent = async (json) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		let response = await Action.getLayoutTextContent(
			workspaceId,
			this.props.params.templateID,
			json,
			usertoken,
		);

		if (response[0] == true) {
			let sections = [...this.state.sections];
			let arr = [];
			_.map(sections, (section, key) => {
				if (section._id == json.sectionId) {
					section.blocks = response[1].updated_layout.blocks;
				}
				arr.push(section);
			});
			this.setState({
				sections: arr,
			});
		}
	};

	// putting tentant data

	putTenantData = async (json, templateId = null, restrictState = null) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.putTenantsData(workspaceId, json, userToken);
		if (response[0] == true) {
			return true;

			// 	this.setState({

			// 		socialMediaLinks:{
			//             Behance: _.has(response[1], 'behanceProfile')
			//             ? response[1].behanceProfile
			//             : '',
			// 			Facebook: _.has(response[1], 'facebookProfile')
			//             ? response[1].facebookProfile
			//             : '',
			// 			Insta: _.has(response[1], 'instagramProfile')
			//             ? response[1].instagramProfile
			//             : '',
			// 			Linkedin: _.has(response[1], 'linkedInProfile')
			//             ? response[1].linkedInProfile
			//             : '',
			// 			Pinterest: _.has(response[1], 'pinterestProfile')
			//             ? response[1].pinterestProfile
			//             : '',
			// 			Spotify: _.has(response[1], 'spotifyProfile')
			//             ? response[1].spotifyProfile
			//             : '',
			// 			Steam: _.has(response[1], 'steamProfile')
			//             ? response[1].steamProfile
			//             : '',
			// 			Telegram: _.has(response[1], 'telegramProfile')
			//             ? response[1].telegramProfile
			//             : '',
			// 			Tiktok: _.has(response[1], 'tiktokProfile')
			//             ? response[1].tiktokProfile
			//             : '',
			// 			// Twitter: _.has(response[1], 'instagramProfile')
			//             // ? response[1].instagramProfile
			//             // : '',
			// 			// X: _.has(response[1], 'instagramProfile')
			//             // ? response[1].instagramProfile
			//             // : '',
			// 			Website: _.has(response[1], 'website')
			//             ? response[1].website
			//             : '',
			// 			Youtube: _.has(response[1], 'youtubeProfile')
			//             ? response[1].youtubeProfile
			//             : '',
			//         },
			// 	},
			// 	()=>{
			// 		// this.props.setTenantsData(this.state?.tenantsData);
			// 	}
			// );
		} else {
			return false;
		}
	};

	// for brandcolor picker
	getBrandColors = async () => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.getBrandColors(workspaceId, userToken);

		if (response[0] === true) {
			this.setState({ brandColors: response[1]?.brandingThemes });
		}
	};
	putBrandColors = async (json) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.putBrandColors(json, workspaceId, userToken);

		if (response[0] === true) {
			this.setState({ brandColors: response[1]?.brandingThemes });

			// this.setState({invoiceNumber : invoiceNumber?.invoicePreferences[0]})
		}
	};

	addPaymentScheduleBlock = async (sectionID, order) => {
		let json;
		json = {
			sectionType: 'invoice-with-payment',
			order,
		};
		let templateID = this.state.activeModuleId;
		let workspace = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.addServiceTableBlock(
			workspace,
			json,
			sectionID,
			templateID,
			userToken,
		);

		if (response[0] === true) {
			const sections = [...(response?.[1]?.sections || [])];

			// for (let i = 0; i < sections?.length; i++) {
			// 	if (sections?.[i]?.type === 'invoice-with-payment') {

			// 		sections.splice(i, 1, sections?.[i]);
			// 		break;
			// 	}
			// }

			this.setState({
				sections: this.reorderSections(sections),
				sectionVariables: response[1].variables ? response[1].variables : [],
				sectionTables: response[1].tables ? response[1].tables : [],
				module: response[1].module,
				activeBlock: _.filter(sections, { _id: sectionID })[0],
			});
			//return true;
		}
	};

	addWorkflowPaymentScheduleBlock = async (sectionID, order) => {
		let json;
		json = {
			sectionType: 'invoice-with-payment',
			order,
		};
		let templateID = this.state.activeModuleId;
		let workspace = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.addWorkflowServiceTableBlock(
			workspace,
			json,
			sectionID,
			this.state.module,
			this.state.activeWorkflowModuleId,
			this.state.activeVersionId,
			userToken,
		);
		if (response[0] === true) {
			const sections = [...(response?.[1]?.versions?.[0]?.sections || [])];
			this.setState({
				sections: this.reorderSections(sections),
				sectionVariables: response[1].versions[0].variables
					? response[1].versions[0].variables
					: [],
				sectionTables: response[1].versions[0].tables ? response[1].versions[0].tables : [],
				module: response[1].versions[0].module || this.state.module,
				activeBlock: _.filter(sections, { _id: sectionID })[0],
			});
			//return true;
		}
	};

	getWorkflowWithModules = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, null, userToken);

		if (response[0] === true) {
			// let updateClientFlag = false;
			// let isClientDetails = response[1]?.data?.getWorkflowWithModules?.clientDetails?.name;
			// if (!isClientDetails) {
			// 	updateClientFlag = true;
			// }
			// this.setState(
			// 	{
			// 		updateClient: updateClientFlag,
			// 	},
			// 	async () => {
			// 		if (this.state.updateClient) {
			// 			await this.getClientNameList();
			// 		}
			// 	},
			// );
			this.setState({
				endUrl: response[1].data.getWorkflowWithModules?.slug,

				settingName: response[1].data.getWorkflowWithModules?.userIdentification?.name,

				settingEmail: response[1].data.getWorkflowWithModules?.userIdentification?.email,

				settingPhone: response[1].data.getWorkflowWithModules?.userIdentification?.phone,

				isEnable: response[1].data.getWorkflowWithModules?.access?.isEnabled,

				expiresAt: response[1].data.getWorkflowWithModules?.expiresAt || null,

				clientDetails: response[1].data.getWorkflowWithModules?.clientDetails || null,
			});

			if (response[1]?.data?.getWorkflowWithModules?.status === 'enquiry') {
				this.setState({ copyStatus: true });
			}
		}

		return response;
	};
	isSlugAvailable = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, null, userToken);
		if (response[0] === true) {
			return response[1].data.isSlugAvailable;
		} else {
			return false;
		}
	};
	updateSlug = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, null, userToken);
		if (response[0] === true) {
			return response[1].data.updateSlug;
		} else {
			return false;
		}
	};
	updateWorkflow = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, null, userToken);
		if (response[0] === true) {
			return response[1].data.updateWorkflow;
		} else {
			return false;
		}
	};
	copyStatus = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, null, userToken);
	};
	getClientName = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, null, userToken);
		if (response[0] === true) {
			this.setState({ clientListArray: response[1]?.data?.clientsList?.data });
		}
	};

	getTemplateModulesForLinkPage = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, null, userToken);
		if (response[0] === true) {
			return response[1]?.data?.getModuleTemplate?.sections;
		}
	};
	getModuleLinkPage = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, null, userToken);
		if (response[0] === true) {
			return response[1]?.data?.getWorkflowModule?.versions?.[0]?.sections;
		}
	};
	updateClientSmartFile = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, null, userToken);
		if (response[0] === true) {
			this.setState({
				updateClient: false,
				clientDetails: response[1]?.data?.addClientToSmartFile?.clientDetails,
			});
		}

		return response;
	};
	createClientDetails = async (query, variables, SmartFileClientUpdate) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, null, userToken);
		if (response[0] === true) {
			this.updateClientSmartFile(SmartFileClientUpdate, {
				addClientToSmartFileId: this.props.params.templateID,
				clientId: response[1]?.data?.createClient?._id,
			});
			this.setState({
				clientDetails: response[1]?.data?.createClient,
			});
		}
		return response;
	};

	addModuleBlankTemplate = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, null, userToken);
		if (response[0] === true) {
			let newModules = this.state.isWorkflow
				? response[1]?.data?.addModuleTemplate?.modules
				: response[1]?.data?.addModuleTemplate?.moduleTemplates;

			if (this.state.isWorkflow) {
				newModules = newModules.map((module) => ({
					...module,
					module: module.type,
				}));
			}
			this.setState((prevState) => ({
				duplicateModules: [...prevState.duplicateModules, newModules?.slice(-1)[0]],
				modules: [...prevState.duplicateModules, newModules?.slice(-1)[0]],
			}));
		}
		return response;
	};

	updateWorkflowTemplate = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, null, userToken);
		if (response[0] === true) {
			this.setState({
				navBar: response[1]?.data?.updateWorkflowTemplate?.navBar,
				imageUrl: response[1]?.data?.updateWorkflowTemplate?.imageUrl,
			});
		}
	};

	updateWorkflowThemeSettings = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let workflowID = this.state.activeModuleId;
		let usertoken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, workflowID, usertoken);
		if (response[0] == true) {
			this.setState({
				navBar: response[1]?.data?.updateWorkflow?.navBar,
				themes: response[1]?.data?.updateWorkflow?.themes,
			});

			return [true];
		} else {
			return [false];
		}
	};
	updateWorkflowThemeSettingsTemplate = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let workflowID = this.state.activeModuleId;
		let usertoken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, workflowID, usertoken);
		if (response[0] == true) {
			this.setState({
				navBar: response[1]?.data?.updateWorkflowTemplate?.navBar,
				themes: response[1]?.data?.updateWorkflowTemplate?.themes,
			});
			return [true];
		} else {
			return [false];
		}
	};

	getAllSchedules = async (s) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.getAllSchedules(workspaceId, userToken);
		this.setState({
			allSchedules: response[1]?.sessions,
		});
		return response;
	};
	getSessionDetails = async (sessionId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.getSessionDetails(workspaceId, userToken, sessionId);
		return response;
	};

	// for manual  invoice
	addManualInvoiceBlock = async (sectionID, order) => {
		let json;
		json = {
			sectionType: 'services',
			order,
		};
		let templateID = this.state.activeModuleId;
		let workspace = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await (this.state?.isWorkflow
			? Action.addWorkflowServiceTableBlock(
					workspace,
					json,
					sectionID,
					this.state.module,
					this.state.activeWorkflowModuleId,
					this.state.activeVersionId,
					userToken,
			  )
			: Action.addServiceTableBlock(workspace, json, sectionID, templateID, userToken));

		if (response[0] === true) {
			const sections = [
				...(this.state?.isWorkflow
					? response?.[1]?.versions?.[0]?.sections || []
					: response?.[1]?.sections || []),
			];
			const tables = [
				...(this.state?.isWorkflow ? response[1]?.versions[0].tables : response[1]?.tables),
			];
			const module = this.state?.isWorkflow
				? response[1].versions[0].module
				: response[1].module;

			this.setState({
				sections: this.reorderSections(sections),
				// sectionVariables: response[1].variables ? response[1].variables : [],
				sectionTables: tables ? tables : [],
				module: module ? module : this.state?.module,
				activeBlock: _.filter(sections, { _id: sectionID })[0],
			});
			//return true;
		}
	};

	handleDuplicateTemplateFunction = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, null, userToken);
		if (response[0] === true) {
			this.setState({
				template_ID: response[1].data.duplicateWorkflowTemplate._id,
				title: response[1].data.duplicateWorkflowTemplate.title,
			});
			return response;
		}
	};
	handleDeleteTemplateFunction = async (query, variables) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let userToken = localStorage.getItem('usertoken');
		let response = await Service.query(query, variables, workspaceId, null, userToken);
		if (response[0] === true) {
			return response;
		}
	};

	// function fro adding event Block
	// addWorkflowPaymentScheduleBlock = async (sectionID, order) => {
	// 	let json = {
	// 		sectionType: 'events',
	// 		order,
	// 	};
	// 	// let json = {
	// 	// 	subBlocks: [
	// 	// 		{
	// 	// 			addlServices: [],
	// 	// 			date: '',
	// 	// 			description: '',
	// 	// 			location: '',
	// 	// 			name: '',
	// 	// 			numberOfGuests: '',
	// 	// 			roles: [],
	// 	// 		},
	// 	// 	],
	// 	// 	order: data.length + 1,
	// 	// };
	// 	let templateID = this.state.activeModuleId;
	// 	let workspace = localStorage.getItem('workspaceId');
	// 	let userToken = localStorage.getItem('usertoken');
	// 	let response = await Action.addWorkflowServiceTableBlock(
	// 		workspace,
	// 		json,
	// 		sectionID,
	// 		this.state.module,
	// 		this.state.activeWorkflowModuleId,
	// 		this.state.activeVersionId,
	// 		userToken,
	// 	);
	// 	if (response[0] === true) {
	// 		const sections = [...(response?.[1]?.versions?.[0]?.sections || [])];
	// 		this.setState({
	// 			sections: this.reorderSections(sections),
	// 			sectionVariables: response[1].versions[0].variables
	// 				? response[1].versions[0].variables
	// 				: [],
	// 			sectionTables: response[1].versions[0].tables ? response[1].versions[0].tables : [],
	// 			module: response[1].versions[0].module || this.state.module,
	// 			activeBlock: _.filter(sections, { _id: sectionID })[0],
	// 		});
	// 		//return true;
	// 	}
	// };
	// duplicateWorkflowEventBlock = async (json, blockId, sectionId) => {
	// 	let workspaceId = localStorage.getItem('workspaceId');
	// 	let userToken = localStorage.getItem('usertoken');
	// 	let templateID = this.state.activeModuleId;
	// 	let response = await Action.duplicateWorkflowEventBlock(
	// 		json,
	// 		workspaceId,
	// 		this.state.module,
	// 		this.state.activeWorkflowModuleId,
	// 		this.state.activeVersionId,
	// 		sectionId,
	// 		blockId,
	// 		userToken,
	// 	);
	// 	if (response[0] === true) {
	// 		this.setState({
	// 			sections: this.reorderSections(response?.[1]?.versions?.[0]?.sections),
	// 		});
	// 	}
	// };
}

export default Proposals;
