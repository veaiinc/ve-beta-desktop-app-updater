import React from 'react';
import './menubar.scss';
class MenuBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			duplicaModules: props?.duplicaModules || [],
		};
	}
	componentDidMount = () => {};
	componentDidUpdate = (prevProps, prevState) => {};

	componentWillUnmount = () => {};
	componentWillReceiveProps = (nextProps) => {
		if (this.state.duplicaModules !== nextProps.duplicaModules) {
			this.setState({
				duplicaModules: nextProps.duplicaModules,
			});
		}
	};
	render() {
		return (
			<div className="menubar-container-wrapper">
				<div
					style={{
						backgroundColor: this.props?.subBlock?.navbarBackgroundColor || '#fff',
					}}
					className="menubar-container"
				>
					{this.props?.duplicateModules?.map((module, index) => (
						<div
							onClick={() => this.props.getModuleInfo(module._id, module.module)}
							key={index}
							className={`menubar-item ${
								this.props?.activeModuleId === module._id ? 'activeModule' : ''
							}`}
							style={{
								color: this.props?.subBlock?.navbarTextColor || '#000',
								borderBottom:
									this.props.activeModuleId === module._id
										? `3px solid ${this.props?.subBlock?.navbarTextColor}`
										: 'none',
							}}
						>
							{module?.label}
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default MenuBar;
