import React, { Component } from 'react';
import _ from 'lodash';
import '../../../assets/scss/authenticator.scss';

class InputField extends Component {
	handleBlur = () => {
		if (_.has(this.props, 'onBlur')) {
			this.props.onBlur();
		}
	};
	handleKeyDown = (e) => {
		if (_.has(this.props, 'onKeyDown')) {
			this.props.onKeyDown(e);
		}
	};

	render() {
		return (
			<div className="input-wrapper">
				<input
					type={this.props.type}
					className={`inputfield ${this.props.isInputError ? 'error-input' : ''}`}
					placeholder={_.has(this.props, 'placeholder') ? this.props.placeholder : ''}
					name={this.props.name}
					required
					value={this.props.value}
					onChange={(e) => this.props.onChange(e)}
					onBlur={(e) => this.handleBlur()}
					onKeyDown={(e) => this.handleKeyDown(e)}
					autoFocus={_.has(this.props, 'autoFocus') ? this.props.autoFocus : false}
					readOnly={this.props.readOnly ? true : false}
					rows={this.props.rows}
					disabled={_.has(this.props, 'disabled') ? this.props.disabled : false}
				/>
				{_.has(this.props, 'image') ? (
					<a className="password-toggle-image" onClick={() => this.props.imageFunction()}>
						{this.props.image}
					</a>
				) : _.has(this.props, 'endStaticText') ? (
					<a className="end-static-text">{this.props.endStaticText}</a>
				) : (
					<span></span>
				)}
				<span className="form-input-error-message">{this.props.errorMessage}</span>
			</div>
		);
	}
}

export default InputField;
