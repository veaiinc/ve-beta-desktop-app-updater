import React, { Component } from 'react';
import '../../assets/scss/generate.scss';
import { ReactComponent as Up } from '../../assets/svg/up.svg';
import { ReactComponent as Preview } from '../../assets/svg/preview.svg';
import { ReactComponent as Shuffle } from '../../assets/svg/shuffle.svg';
import { ReactComponent as Loader } from '../../assets/svg/generate-loader.svg';
import { withRouter } from '../../services/withRouter';
import Proposals from '../../controllers/proposals';
import { gql, useMutation } from '@apollo/client';
const query = gql`
	query Query($getDetailedTemplateInfoId: ID!) {
		getDetailedTemplateInfo(id: $getDetailedTemplateInfoId)
	}
`;
const photographyPrompts = [
	'Design an elegant wedding photography proposal with soft pastels, clear sections for team, awards, and portfolio. Use a clean, minimal layout with floral accents.',
	'Create a sleek commercial photography portfolio template with bold typography, grids for product shots, and professional team photos. Include an awards section.',
	'Design a stylish fashion photography lookbook with high-contrast black, white, and metallic accents. Use large image grids and clean text sections for the team and awards.',
	'Create a modern real estate photography proposal with sleek, professional layouts. Include large property images, team introduction, and a section for client testimonials.',
	'Design a nature photography portfolio template with earthy tones and large, high-quality image displays. Include sections for awards, about the photographer, and team intro.',
	'Design a vibrant event photography proposal with dynamic layouts. Include sections for portfolio (event highlights), team, and awards. Use colorful accents to match event energy.',
	'Create a high-energy sports photography portfolio with action-packed images and bold typography. Include a section for awards, about the photographer, and team.',
	'Design a portrait photography proposal with soft lighting effects and warm tones. Include sections for team bios, portfolio (headshots), and awards in a clean, structured format.',
	'Create a product photography proposal with a minimalist design, white background, and sharp product image grids. Include sections for team, awards, and client feedback.',
	'Design a travel photography portfolio with a global theme. Use large, vibrant travel shots and sections for awards, team introduction, and client recommendations.',
];

class Prompt extends Proposals {
	constructor() {
		super();
		this.state = {
			command: '',
			workflowLoading: false,
			templateID: '6718e0d11fdbc145c1aa71e6',
			modules: [],
			workflowDuplicateID: null,
			json: [],
			visiblePrompts: [],
		};
	}
	componentDidMount = async () => {
		await this.getWorkflowInfo(query);
		this.getRandomPrompts();
	};
	handleAddLayout = async (layoutId, key, title) => {
		let jso = {
			layoutId: layoutId,
			order: key,
			title: title,
		};

		try {
			await this.addLayout(
				this.props.params.workspaceId,
				jso,
				_.filter(this.state.modules, { module: 'proposal' })[0]._id,
			);
		} catch (error) {
			console.error('Error adding layout:', error);
			// Handle error (e.g., show an error message to the user)
		}
	};
	handleGenerateWorkflow = async (e) => {
		localStorage.setItem('prompt', this.state.command);
		localStorage.setItem('title', this.state.title);
		this.setState({ workflowLoading: false }, () => {
			this.props.navigate(`/builder/generate/templates/${this.props.params.templateID}`);
		});
		// 	this.setState({ workflowLoading: true });
		// 	await this.duplicateWorkflow(duplicateWorkflowQuery,{
		// 		"templateId": this.props.params.templateID,
		// 		"title": this.state.title
		// 	  })
		// 	  if(this.state.workflowDuplicateID){
		// 	 async () => {
		// 		await this.generateTemplate({ user_prompt: this.state.command, page_type: 'proposal' });
		// 	};
		// }
		// if (this.state.json !== null) {
		// 	try {
		// 		// Use Promise.all to wait for all handleAddLayout calls to complete
		// 		await Promise.all(
		// 			this.state.json.map((item, k) => this.handleAddLayout(item.layoutId, k + 1,item.title)),
		// 		);

		// 		// Navigate only after all layouts have been added
		// 		this.props.navigate(`/builder/generate/templates/${this.props.params.templateID}`);
		// 	} catch (error) {
		// 		console.error('Error generating workflow:', error);
		// 		// Handle error (e.g., show an error message to the user)
		// 	} finally {
		// 		this.setState({ workflowLoading: false });
		// 	}
		// }
		// }
	};
	getRandomPrompts = () => {
		const shuffled = [...photographyPrompts].sort(() => 0.5 - Math.random());
		const selected = shuffled.slice(0, 4);
		this.setState({
			visiblePrompts: selected,
		});
	};
	handleShuffle = () => {
		this.getRandomPrompts();
	};
	render() {
		return (
			<div className="generate-wrapper">
				<div className="generate-container">
					<div className="gw-top">
						<h1>Generate</h1>
						<h5>What would you like to create today?</h5>
					</div>
					<div className="gw-input">
						<textarea
							value={this.state.command}
							onChange={(e) => this.setState({ command: e.target.value })}
						/>
						{this.state.workflowLoading ? (
							<label>
								<Loader />
							</label>
						) : (
							<a
								className={this.state.command !== '' ? 'active' : ''}
								onClick={(e) =>
									this.state.command !== '' ? this.handleGenerateWorkflow(e) : ''
								}
							>
								<Up />
							</a>
						)}
					</div>
					<div
						className="gw-prompt"
						style={{ opacity: this.state.workflowLoading ? 0 : 1 }}
					>
						<div className="gwp-line"></div>
						<h5>Prompts</h5>
					</div>
					<div
						className="gw-prompts-cards"
						style={{ opacity: this.state.workflowLoading ? 0 : 1 }}
					>
						{_.map(this.state.visiblePrompts, (prompt, k) => {
							return (
								<a
									key={k}
									onClick={() => this.setState({ command: prompt })}
									style={{ cursor: 'pointer' }}
								>
									<Preview />
									{prompt}
								</a>
							);
						})}
					</div>
					<div
						className="shuffle-btn"
						style={{ opacity: this.state.workflowLoading ? 0 : 1 }}
					>
						<a onClick={this.handleShuffle} style={{ cursor: 'pointer' }}>
							<Shuffle /> Shuffle
						</a>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(Prompt);
