import React, { Component } from 'react';
import { ReactComponent as WarningIcon } from '../../../assets/svg/sectionwarnings/warning.svg';
import { ReactComponent as ArrowRight } from '../../../assets/svg/sectionwarnings/arrowRight.svg';
import './HomePagePopup.scss';
class SectionWarning extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showWarning: props.showWarning,
		};
	}

	render() {
		return (
			<>
				<div className="sectionWarning">
					<div className="section-warning">
						<div className="section-warning-header">
							<div className="warning-icon-container">
								<span className="warning-icon">
									<WarningIcon />
								</span>
								<span className="warning-icon">Workflow warning</span>
								<span className="warning-icon-count">(09)</span>
							</div>
						</div>
						<div></div>
					</div>
					<div className="section-warning-body">
						<span className="warning-text">
							Section ‘Service Block’ has no services listed
						</span>
						<span className="warning-icon">
							<ArrowRight />
						</span>
					</div>
					<span className="warning-divider"></span>
					<div className="section-warning-footer">
						<div className="ignore-all-btn">
							<span className="ignore-all-btn-text">Ignore all</span>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default SectionWarning;
