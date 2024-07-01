import jwt_decode from 'jwt-decode';
import _ from 'lodash';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import '../../../assets/scss/workspaceSettings/settings.scss';
import Workspace from '../../../controllers/workspace';

class MySettingsPageLayout extends Workspace {
    constructor() {
        super();
        this.state = {
            accessControls: [],
            isTenantDetailsLoading: true,
            originalAccessControls: [],
            workspaceList: {},
            isWorkSpaceListLoading: true,
            tenantUserIsOwner: false,
            tenantUserIsSuperHuemn: false,
            tenantUserRole: null,
            getStripeLink: false,
            tenantUsageDetails: {
                stripeCustomerId: null,
            },
            isSidebarVisible: false,
            activeLink: 'my-profile',
        };
    }
    componentDidMount = async () => {
        // Check if componentDidMount has already been called
        // this.callFN();
        let usertoken = localStorage.getItem('usertoken');
        var decoded = await jwt_decode(usertoken);
        let workspaceID = localStorage.getItem('workspaceId');
        await this.getTenantUserDetails(decoded.user_id, workspaceID);

        // let activeLink = this.props.location.pathname.split('/')[2];

        // if (_.has(this.props.location.state, 'isExpanded')) {
        // 	this.setState({ isExpanded: this.props.location.state.isExpanded });
        // }
        // if (activeLink) {
        // 	this.setState({ activeLink: activeLink });
        // }

        this.setState({
            workspaceID,
        });
        localStorage.setItem('pvt', '1');

        this.getTenantUserDetails(decoded.user_id, workspaceID);
        this.getUserWorkSpaceList(false);
        this.getTenantUsageDetails(workspaceID);
        this.getTenantSubscriptionDetails(workspaceID);
        await this.getTenantSettings();
    };

    componentWillUnmount = () => {
        localStorage.setItem('pvt', '0');
    };

    toggleSidebar = () => {
        this.setState((prevState) => ({
            isSidebarVisible: !prevState.isSidebarVisible,
        }));
    };
    scrollToSection = (val) => {
        const section = document.getElementById(val);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };
    render() {
        let renderedWorkspaceID = localStorage.getItem('workspaceId');

        return (
            <>
                <div className="settings-outermost-layout-container">
                    <div className="hamburger-icon" onClick={this.toggleSidebar}>
                        ☰
                    </div>
                    <div
                        className={`settings-embed-left-bar-container ${
                            this.state.isSidebarVisible ? 'visible' : ''
                        }`}
                    >
                        <div className="settings-left-bar-container" style={{}}>
                            {/* <div className="settings-left-bar-title-container">
								<div className="settings-left-bar-title"></div>
							</div> */}
                            <div className="settings-left-bar-nav-container">
                                <div className="settings-links-container">
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        <div
                                            className="icon"
                                            style={{
                                                backgroundImage: `url(${this.state.logoUrl})`,
                                                // backgroundImage: `url(${
                                                // 	_.find(this.state.workspaceList, {
                                                // 		workspaceId: renderedWorkspaceID,
                                                // 	})
                                                // 		? _.find(this.state.workspaceList, {
                                                // 				workspaceId: renderedWorkspaceID,
                                                // 		  }).logoUrl
                                                // 		: ''
                                                // })`,
                                                backgroundPosition: '50%',
                                                // backgroundRepeat: 'no-repeat',
                                                backgroundSize: 'cover',
                                                // backgroundColor: 'transparent',
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontFamily: 'Inter Medium',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                lineHeight: '16px',
                                                letterSpacing: '-0.30000001192092896px',
                                                textAlign: 'left',
                                                // color: 'rgba(28, 28, 28, 1)',
                                                justifyContent: 'center',
                                                textTransform: 'uppercase',
                                                marginRight: '0.5rem',
                                            }}
                                        ></div>
                                        <div className="info">
                                            <div
                                                className="name"
                                                style={{
                                                    color: '#e4e5e6',
                                                    fontSize: '14px',
                                                    fontFamily: 'Inter',
                                                }}
                                            >
                                                {this.state.isWorkSpaceListLoading ? (
                                                    <Skeleton
                                                        width={100}
                                                        height={14}
                                                        baseColor={'#313131'}
                                                        highlightColor={'#525252'}
                                                    />
                                                ) : _.find(this.state.workspaceList, {
                                                      workspaceId: renderedWorkspaceID,
                                                  }) ? (
                                                    _.find(this.state.workspaceList, {
                                                        workspaceId: renderedWorkspaceID,
                                                    }).businessName
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                            <div className="user">
                                                {this.state.tenantUserRole === 'admin' ? (
                                                    <span
                                                        // className="admin-tag"
                                                        style={{
                                                            color: '#E4E5E6A3',
                                                            fontSize: '13px',
                                                            fontFamily: 'Inter',
                                                        }}
                                                    >
                                                        Admin
                                                    </span>
                                                ) : (
                                                    <span
                                                        style={{
                                                            color: '#E4E5E6A3',
                                                            fontSize: '13px',
                                                            fontFamily: 'Inter',
                                                        }}
                                                    >
                                                        Member
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="settings-left-bar-nav-container">
                                <div className="settings-links-container">
                                    {/* <div className={'link-parent-text'}>Company</div> */}
                                    <div
                                        className={
                                            'settings-nav-link' +
                                            (this.state.activeLink === 'my-profile'
                                                ? ' active'
                                                : '')
                                        }
                                        onClick={() => {
                                            this.scrollToSection('my-profile');
                                            this.setState({ activeLink: 'my-profile' });
                                        }}
                                    >
                                        My Profile
                                    </div>
                                    <div
                                        className={
                                            'settings-nav-link' +
                                            (this.state.activeLink === 'two-factor-authentication'
                                                ? ' active'
                                                : '')
                                        }
                                        onClick={() => {
                                            this.scrollToSection('two-factor-authentication');
                                            this.setState({
                                                activeLink: 'two-factor-authentication',
                                            });
                                        }}
                                    >
                                        Two Factor Authentication
                                    </div>
                                    <div
                                        className={
                                            'settings-nav-link' +
                                            (this.state.activeLink === 'theme-preference'
                                                ? ' active'
                                                : '')
                                        }
                                        onClick={() => {
                                            this.scrollToSection('theme-preference');
                                            this.setState({ activeLink: 'theme-preference' });
                                        }}
                                    >
                                        Theme Preference
                                    </div>
                                    <div
                                        className={
                                            'settings-nav-link' +
                                            (this.state.activeLink === 'notification-preference'
                                                ? ' active'
                                                : '')
                                        }
                                        onClick={() => {
                                            this.scrollToSection('notification-preference');
                                            this.setState({
                                                activeLink: 'notification-preference',
                                            });
                                        }}
                                    >
                                        Notifications
                                    </div>
                                    <div
                                        className={
                                            'settings-nav-link' +
                                            (this.state.activeLink === 'access-settings'
                                                ? ' active'
                                                : '')
                                        }
                                        onClick={() => {
                                            this.scrollToSection('access-settings');
                                            this.setState({ activeLink: 'access-settings' });
                                        }}
                                    >
                                        Access Settings
                                    </div>
                                    <div
                                        style={{
                                            color: '#6055EC',
                                            lineHeight: '16px',
                                            fontFamily: 'Inter',
                                            fontSize: '14px',
                                            paddingTop: '0.5rem',
                                            cursor: 'not-allowed',
                                        }}
                                    >
                                        + Create Workspace
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default MySettingsPageLayout;
