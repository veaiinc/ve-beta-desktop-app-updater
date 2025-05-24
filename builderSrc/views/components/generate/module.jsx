import React, { Component } from 'react';
import { gql, useMutation } from '@apollo/client';
import Proposals from '../../../controllers/proposals';
import Builder from '../library/builder';
import _ from 'lodash';

const moduleQuery = gql`
	query Query($getModuleTemplateId: ID!, $module: String) {
		getModuleTemplate(id: $getModuleTemplateId, module: $module)
	}
`;
class GenerateModule extends Proposals {
	constructor(props) {
		super(props);
		this.state = {
			sections: [],
			sectionTables: [],
			isLoading: true,
			module: props?.module,
			//sections: props?.sections,
			moduleId: props?.moduleId,
			callApi: props?.callApi,
		};
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.module !== nextProps.module) {
			this.setState(
				{
					module: nextProps?.module,
					moduleId: nextProps?.moduleId,
				},
				async () => {
					await this.getModuleTemplate(moduleQuery, {
						getModuleTemplateId: this.state?.moduleId,
						module: this.state?.module,
					});
				},
			);
		}
		if (this.state.callApi !== nextProps.callApi) {
			this.setState(
				{
					callApi: nextProps.callApi,
				},
				async () => {
					if (this.state.callApi) {
						await this.getModuleTemplate(moduleQuery, {
							getModuleTemplateId: this.state?.moduleId,
							module: this.state?.module,
						});
					}
				},
			);
		}
		// if (
		// 	this.state.sections !== nextProps.sections &&
		// 	nextProps.sections.length > 0 &&
		// 	this.state.module === nextProps.module
		// ) {
		// 	this.setState({
		// 		sections: nextProps.sections,
		// 	});
		// }
		// if (this.state.sections !== nextProps.sections) {
		// 	this.setState({
		// 		sections: nextProps?.sections,
		// 	});
		// }
	};
	componentDidMount = async () => {
		await this.getModuleTemplate(moduleQuery, {
			getModuleTemplateId: this.state?.moduleId,
			module: this.state?.module,
		});
	};
	render() {
		if (this.state?.module === 'proposal') {
		}
		return (
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					overflow: 'hidden',
					zoom: this.props?.zoom,
				}}
				className="module-class"
			>
				{this.state.isLoading ? (
					''
				) : (
					<Builder
						module={this.state.module}
						sections={this.state.sections}
						client={true}
						preview={true}
						previewType={_.has(this.props, 'previewType') ? 'd' : 'm'}
						tables={this.state.sectionTables}
						isHeader={this.state.isHeader}
						variables={this.props?.variables}
						setIsValidURL={(e) => {
							this.setState({
								isValidURL: e,
							});
						}}
						tenantLogo={this.props?.tenantLogo}
						headerSection={this.state.headerSection}
						formBgColor={this.state.formBgColor}
						setIsValidBgVideoURL={(e) => {
							this.setState({
								isValidBgVideoURL: e,
							});
						}}
						activeSectionID={this.state.activeSectionID}
						handleUpdateSectionData={''}
					/>
				)}
			</div>
		);
	}
}

export default GenerateModule;
