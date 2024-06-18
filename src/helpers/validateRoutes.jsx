import React, { Component } from 'react';
import _ from 'lodash';

class ValidateRoutes extends Component {
	navigateToPath = (pathname) => {
		if (_.has(this.props.match.params, 'tenantID')) {
			if (_.has(this.props.location.state, 'from')) {
				const { from } = this.props.location.state;
				this.props.history.push({
					pathname: '/' + this.props.match.params.tenantID + pathname,
					state: { from: from },
				});
			} else {
				this.props.history.push('/' + this.props.match.params.tenantID + pathname);
			}
		} else {
			if (_.has(this.props.location.state, 'from')) {
				const { from } = this.props.location.state;
				this.props.history.push({
					pathname: pathname,
					state: { from: from },
				});
			} else {
				this.props.history.push(pathname);
			}
		}
	};
}

export default ValidateRoutes;
