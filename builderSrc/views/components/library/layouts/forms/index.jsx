import React, { Component } from 'react';
import './forms.scss';
import FormElement from './formElement';
// import Button from '../../elements/button';
import _ from 'lodash';
const padding = ['0px', '20px', '40px', '60px', '80px'];
class Form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			client:props.client,
			sections: props.sections,
			isDragging: false,
			actionType: props.actionType,
			actionValue: props.actionValue,
			preview: props.preview,
			previewType: props.previewType,
			setActiveTheme: props?.setActiveTheme,
			submitFormLoading: props?.submitFormLoading,
			isTheme: props?.isTheme,
			triggerFont: props.triggerFont,
		};
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.sections !== nextProps.sections) {
			this.setState({
				sections: nextProps.sections,
			});
		}
		if (this.state.isTheme !== nextProps.isTheme) {
			this.setState({
				isTheme: nextProps.isTheme,
			});
		}
		if (this.state.setActiveTheme !== nextProps.setActiveTheme) {
			this.setState({
				setActiveTheme: nextProps.setActiveTheme,
			});
		}
		if (this.state.actionType !== nextProps.actionType) {
			this.setState({
				actionType: nextProps.actionType,
			});
		}
		if (this.state.activeTextBlock !== nextProps.activeTextBlock) {
			this.setState({
				activeTextBlock: nextProps.activeTextBlock,
			});
		}
		if (this.state.actionValue !== nextProps.actionValue) {
			this.setState({
				actionValue: nextProps.actionValue,
			});
		}
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
			});
		}
		if (this.state.previewType !== nextProps.previewType) {
			this.setState({
				previewType: nextProps.previewType,
			});
		}
		if (this.state.submitFormLoading !== nextProps.submitFormLoading) {
			this.setState({
				submitFormLoading: nextProps.submitFormLoading,
			});
		}
		if (this.state.triggerFont !== nextProps.triggerFont) {
			this.setState({
				triggerFont: nextProps.triggerFont,
			});
		}
		if (this.state.client !== nextProps.client) {
			this.setState({
				client: nextProps.client,
			});
		}
	};

	handleMoveItem = (fromIndex, toIndex, isDragging = false) => {
		let section = this.state.sections[0].blocks;
		//if (toIndex < 0 || toIndex >= sections.length) return;
		let sections = [...this.state.sections];
		if (!isDragging) {
			this.setState({ moveDirection: { fromIndex, toIndex } });

			setTimeout(() => {
				const updatedItems = [...section];
				const fromItem = updatedItems.find((item) => item.order === fromIndex);
				const toItem = updatedItems.find((item) => item.order === toIndex);
				fromItem.order = toIndex;
				toItem.order = fromIndex;
				sections[0].blocks = updatedItems;
				this.setState({
					sections,
					moveDirection: null,
				});
			}, 500);
		} else {
			const updatedItems = [...section];
			const fromItem = updatedItems.find((item) => item.order === fromIndex);
			const toItem = updatedItems.find((item) => item.order === toIndex);
			fromItem.order = toIndex;
			toItem.order = fromIndex;
			sections[0].blocks = updatedItems;
			this.setState({ sections }, () => {
				this.props.setFSections(updatedItems);
			});
		}
	};
	deleteBlockById(sections, sectionId, blockId) {
		return sections.map((section) => {
			if (section._id === sectionId) {
				const updatedBlocks = section.blocks.filter((block) => block._id !== blockId);
				return { ...section, blocks: updatedBlocks };
			}
			return section;
		});
	}
	handleDeleteBlock = (id) => {
		let sections = [...this.state.sections];
		sections = this.deleteBlockById(sections, sections[0]._id, id);
		this.setState({ sections }, () => {
			this.props.deleteFBlock(id, sections[0]._id);
		});
	};
	setBlockOptions = (e, blockId, restrict) => {
		let sections = [...this.state.sections];
		let arr = [];
		_.map(sections, (section, key) => {
			if (key == 0) {
				_.map(section.blocks, (block, k) => {
					if (block._id == blockId) {
						block.answerOptions.options = e;
					}
				});
			}
			arr.push(section);
		});
		this.setState({ sections: arr }, () => {
			if (restrict == true) {
				setTimeout(
					function () {
						this.props.setFSections(arr, restrict);
					}.bind(this),
					2000,
				);
			} else {
				this.props.setFSections(arr, restrict);
			}
		});
	};
	render() {
		let sectionsArr = [];
		_.map(_.sortBy(this.state.sections[0].blocks, ['order']), (section, index) => {
			section.order = index + 1;
			sectionsArr.push(section);
		});

		return (
			<div
				className="layout"
				style={{
					padding: `${
						this.state.sections[0].style.padding
							? padding[this.state.sections[0].style.padding]
							: '0px'
					} ${this.state.previewType === 'm' && this.state.preview ? '14px' : '56px'}`,
					backgroundColor: this.state.sections[0].style.sectionBackgroundColor,

					display: 'flex',
					flexDirection: 'column',
					gap: 40,
					width: '100%',
					justifyContent: 'center',
					alignItems: 'center',
					//minHeight: 'calc(100vh - 64px)',
				}}
				onClick={(e) => this.props.handleSideBar(e, this.state.sections[0]._id)}
			>
				{_.map(sectionsArr, (block, key) => {
					return (
						<FormElement
							setOptions={(e, restrict = null) =>
								this.setBlockOptions(e, block._id, restrict)
							}
							variableId={block?.variableId}
							question={block?.question}
							type={block?.type}
							order={block?.order}
							options={block?.answerOptions?.options}
							isMultiple={block?.answerOptions?.isMultiple}
							index={key + 1}
							itemsLength={_.size(sectionsArr)}
							moveItem={(e, f, g) => this.handleMoveItem(e, f, g)}
							deleteQuestion={(e) => this.handleDeleteBlock(block._id)}
							isRequired={block?.isRequired ? block?.isRequired : false}
							handleSetFTab={(e) => this.props.handleSetTab(e, null, block._id)}
							handleFBSelection={(e, activeTextBlock) =>
								this.props.handleBSelection(e, activeTextBlock)
							}
							handleFSideBar={(e) => this.props.handleSetFSideBar(e, block._id)}
							handleSetContent={(e) =>
								this.props.setBlockContent(e, this.state.sections[0]._id, block._id)
							}
							addQuestion={(e) => {
								const currentOrder = block?.order || 0;
								const nextBlockOrder = sectionsArr[key + 1]?.order;

								let newOrder;
								if (nextBlockOrder === undefined) {
									newOrder = currentOrder + 1;
								} else {
									newOrder = ((nextBlockOrder + currentOrder) / 2).toFixed(3);
								}

								this.props.addQues(this.state.sections[0]._id, newOrder);
							}}
							addOptionForForm={(e) => this.props.addOptionForm(e)}
							preview={this.state.preview}
							previewType={this.state.previewType}
							setAnswer={(e) => {
								this.props.client
									? this.props.handleFormAnswer(e, key + 1, block.order)
									: '';
							}}
							answer={block?.answer}
							id={block?._id}
							client={this.props.client}
							setActiveTheme={this.state.setActiveTheme}
							isTheme={this.state.isTheme}
							actionType={this.state.actionType}
							actionValue={this.state.actionValue}
							clearStyle={() => this.props.clearStyle()}
							triggerFont={this.state.triggerFont}
							setTriggerFont={(e) => this.props.setTriggerFont(e)}
							activeFormQuestion={this.props?.activeFormQuestion}
						/>
					);
				})}

				<div className="form-button">
					<a
						style={{
							backgroundColor: this.state?.isTheme
								? this.state?.setActiveTheme?.button
								: '#333',
							color: this.state?.isTheme
								? this.state?.setActiveTheme?.buttonText
								: '#fff',
							borderRadius: '50px',
							width: '100%',
							padding: '12px 15px',
							justifyContent: 'center',
							display: 'flex',
							alignItems: 'center',
							maxWidth: 200,
							minWidth: '200px',
						}}
						onClick={(e) => {
							if (this.props.client && !this.state?.submitFormLoading) {
								this.props.submitForm(e);
							}
						}}
					>
						{this.state?.submitFormLoading ? (
							<span class="next-loader"></span>
						) : (
							'Submit'
						)}
					</a>
				</div>
				<div className="forms-wrapper">
					<div className="logo"></div>
				</div>
			</div>
		);
	}
}

export default Form;
