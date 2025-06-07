import React, { Component } from 'react';

class SingleInputTypes extends Component {
	constructor(props) {
		super(props);
		this.state = {
			actionType: props.actionType,
			actionValue: props.actionValue,
			preview: props.preview,
			previewType: props.previewType,
			setActiveTheme: props?.setActiveTheme,
			submitFormLoading: props?.submitFormLoading,
			isTheme: props?.isTheme,
			answer: props.answer ? props.answer : '',
			inputError: '',
		};
	}
	componentWillReceiveProps = (nextProps) => {
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
		if (this.state.answer !== nextProps.answer) {
			this.setState({
				answer: nextProps.answer,
			});
		}
	};
	onChangeInput = (e) => {
		const { name, value } = e.target;
		if (name === 'email') {
			const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
			if (emailRegex?.test(value)) {
				this.setState(
					(prevState) => ({
						answer: value?.toLowerCase(),
						inputError: '',
					}),
					() => {
						this.props.setAnswer(this.state.answer); // Use updated state
					},
				);
			} else {
				this.setState(
					{
						answer: value?.toLowerCase(),
						inputError: 'Please enter a valid email address',
					},
					() => {
						this.props.setAnswer(this.state.answer); // Use updated state
					},
				);
			}
		}
		if (name === 'link') {
			if (value?.startsWith('http://') || value?.startsWith('https://')) {
				this.setState(
					(prevState) => ({
						answer: value?.toLowerCase(),
						inputError: '',
					}),
					() => {
						this.props.setAnswer(this.state.answer); // Use updated state
					},
				);
			} else {
				this.setState(
					{
						answer: value?.toLowerCase(),
						inputError: 'Please enter a valid link starts with http:// or https://',
					},
					() => {
						this.props.setAnswer(this.state.answer); // Use updated state
					},
				);
			}
		}
		if (name === 'number') {
			const numberRegex = /^[0-9]*$/; // Only allow digits (0-9)
			if (numberRegex?.test(value) && value !== '') {
				this.setState(
					(prevState) => ({
						answer: value,
						inputError: '',
					}),
					() => {
						this.props.setAnswer(this.state.answer); // Use updated state
					},
				);
			} else {
				this.setState(
					{
						answer: value,
						inputError: 'Please enter a valid positive number',
					},
					() => {
						this.props.setAnswer(this.state.answer); // Use updated state
					},
				);
			}
		}
		// setTimeout(() => {
		// this.props.setAnswer(this.state.answer);
		// }, 1000);
	};
	onBlurInput = () => {
		this.setState({
			inputError: '', // Reset the error message
		});
	};
	render() {
		return (
			<div className="singleInputTypes">
				{this.props.type === 'email' ? (
					<input
						defaultValue={this.state?.answer}
						onChange={(e) => this.onChangeInput(e)}
						placeholder="Enter your Email here"
						className="answerInput"
						disabled={!this.state?.preview}
						name="email"
						type="email"
						style={{
							backgroundColor: this.state?.isTheme
								? this?.state?.setActiveTheme?.fieldFill
								: '#fff',
							border: this.state.isTheme
								? ` 1px solid ${this?.state?.setActiveTheme?.fieldBorder}`
								: '#fff',
						}}
						onBlur={this.onBlurInput}
					/>
				) : this.props.type === 'link' ? (
					<input
						defaultValue={this.state?.answer}
						onChange={(e) => this.onChangeInput(e)}
						placeholder="Type your Link here"
						className="answerInput"
						disabled={!this.state?.preview}
						name="link"
						type="url"
						style={{
							backgroundColor: this.state?.isTheme
								? this?.state?.setActiveTheme?.fieldFill
								: '#fff',
							border: this.state.isTheme
								? ` 1px solid ${this?.state?.setActiveTheme?.fieldBorder}`
								: '#fff',
						}}
						onBlur={this.onBlurInput}
					/>
				) : this.props.type === 'number' ? (
					<input
						defaultValue={this.state?.answer}
						onChange={(e) => this.onChangeInput(e)}
						placeholder="Type your Number here"
						className="answerInput"
						disabled={!this.state?.preview}
						name="number"
						type="number"
						style={{
							backgroundColor: this.state?.isTheme
								? this?.state?.setActiveTheme?.fieldFill
								: '#fff',
							border: this.state.isTheme
								? ` 1px solid ${this?.state?.setActiveTheme?.fieldBorder}`
								: '#fff',
						}}
						onBlur={this.onBlurInput}
					/>
				) : null}
				{this.state?.inputError && (
					<span className="inputError">{this.state?.inputError}</span>
				)}
			</div>
		);
	}
}

export default SingleInputTypes;
