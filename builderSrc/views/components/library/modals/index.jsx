import React, { Component } from 'react';
import _ from 'lodash';

import { Modal } from 'react-bootstrap';

class modal extends Component {
	constructor() {
		super();
		this.state = {
			slideclassright: 'sliding-right-hide',
			slideclassrightadd: 'sliding-right-add-hide',
			openclasscenter: 'sliding-center-hide',
			slideclassbottom: 'sliding-bottom-hide',
		};
	}
	modalswitch = (e) => {
		switch (e) {
			case 'right':
				return `rightModal ${this.props.custClass ? this.props.custClass : ''}`;
			case 'right-add':
				return ` ${
					this.props.custClass
						? this.props.custClass + ' rightModalAdd '
						: 'rightModalAdd '
				}`;
			case 'center':
				return 'centerModal';

			case 'bottom':
				return 'bottomModal';

			default:
				return 'centerModal';
		}
	};
	modalcloseswitch = (e) => {
		switch (e) {
			case 'right-add':
				return <span></span>;
			case 'right':
				return <span></span>;
			case 'center':
				return <span></span>;

			case 'bottom':
				return <span></span>;

			default:
				return <span></span>;
		}
	};
	enteringclass = () => {
		if (this.props.modalType === 'right') {
			this.setState({
				slideclassright: 'sliding-right-show',
			});
		}
		if (this.props.modalType === 'right-add') {
			this.setState({
				slideclassrightadd: 'sliding-right-add-show',
			});
		}
		if (this.props.modalType === 'center') {
			this.setState({
				openclasscenter: 'sliding-center-show',
			});
		}
		if (this.props.modalType === 'bottom') {
			this.setState({
				slideclassbottom: 'sliding-bottom-show',
			});
		}
	};
	exitingclass = () => {
		if (this.props.modalType === 'right') {
			this.setState({
				slideclassright: 'sliding-right-hide',
			});
		}
		if (this.props.modalType === 'right-add') {
			this.setState({
				slideclassrightadd: 'sliding-right-add-hide',
			});
		}
		if (this.props.modalType === 'center') {
			this.setState({
				openclasscenter: 'sliding-center-hide',
			});
		}
		if (this.props.modalType === 'bottom') {
			this.setState({
				slideclassbottom: 'sliding-bottom-hide',
			});
		}
	};
	modalanimationswitch = (e) => {
		switch (e) {
			case 'right':
				return this.state.slideclassright;
			case 'right-add':
				return this.state.slideclassrightadd;

			case 'center':
				return this.state.openclasscenter;
			case 'bottom':
				return this.state.slideclassbottom;
			default:
				return '';
		}
	};
	render() {
		return (
			<>
				{this.props.show && (
					<Modal
						show={this.props.show}
						onHide={this.props.handleClose}
						keyboard={true}
						className={this.modalswitch(this.props.modalType)}
						onEntering={this.enteringclass}
						onExiting={this.exitingclass}
						centered
						aria-labelledby="contained-modal-title-vcenter"
						animation={true}
					>
						<Modal.Body
							scrollable={true}
							id={this.modalanimationswitch(this.props.modalType)}
							className={_.has(this.props, 'width') ? `w-${this.props.width}p` : ''}
						>
							<div className={'m-body'}>{this.props.children}</div>
						</Modal.Body>
					</Modal>
				)}
			</>
		);
	}
}

export default modal;
