import { Component } from 'react';
import * as TenantUserAction from './oldActions';
import _ from 'lodash';
import Tenant from './tenant';
import jwtDecode from 'jwt-decode';
import { toast } from 'react-toastify';
class TenantUser extends Tenant {
    getTenantUserList = async (actionType = null, projectCollaborators = null) => {
        let usertoken = localStorage.getItem('usertoken');
        var decoded = jwtDecode(usertoken);

        let response = await TenantUserAction.getTenantUsers(
            this.props.match.params.workspaceID,
            usertoken,
        );

        if (response[0]) {
            this.setState({
                tenantUser: response[1],
            });

            if (actionType === 'projectCollab') {
                let collabJson = [];
                _.map(response[1].docs, (member, index) => {
                    if (decoded.user_id !== member._id) {
                        let json = {
                            tenantID: member._id,

                            label: (
                                <div className="collaborator-select-item  w-100p f-left d-flex align-center">
                                    <div className="img-container">
                                        {/* <img src={'https://www.w3schools.com/howto/img_avatar.png'} /> */}

                                        <p className="letters-dp">
                                            <span>
                                                {member.firstName[0] +
                                                    +(member.lastName[0]
                                                        ? ` ${member.lastName[0]}`
                                                        : '')}
                                            </span>
                                        </p>
                                    </div>
                                    {member.firstName +
                                        (member.lastName ? ` ${member.lastName}` : '')}
                                </div>
                            ),
                        };

                        collabJson.push(json);
                    }
                });

                if (
                    _.size(collabJson) + 1 + _.size(projectCollaborators) ===
                    _.size(response[1].docs)
                ) {
                    this.setState({
                        collaboratoroptions: collabJson,
                    });
                }
            } else if (actionType === 'usersList') {
                let collabJson = [];
                _.map(response[1], (member, index) => {
                    if (
                        member._id &&
                        member.email !== null &&
                        _.size(_.filter(this.state.notifyUsersClose, { userId: member._id })[0]) ==
                            0
                    ) {
                        let json = {
                            value: member._id,

                            label:
                                (member.firstName ? ` ${member.firstName}` : '') +
                                (member.lastName ? ` ${member.lastName}` : ''),
                        };

                        collabJson.push(json);
                    }
                });
                this.setState({
                    collaboratoroptions: collabJson,
                    isUserLoading: false,
                });
            }
        }
    };
    getTenantUserDetails = async (
        tenantUserId,
        workspaceId = null,
        checkOnlyForFewkeys = null,
        getOnlyPhoneNumber = null,
    ) => {
        let usertoken = localStorage.getItem('usertoken');
        let workspaceID;
        if (workspaceId !== null) {
            workspaceID = workspaceId;
        } else {
            workspaceID = this.props.match.params.workspaceID;
        }
        let response = await TenantUserAction.getTenantUserDetails(
            tenantUserId,
            workspaceID,
            usertoken,
        );
        if (response[0] === true) {
            if (checkOnlyForFewkeys == true) {
                this.setState({
                    isLoggedInUserSuperHuemn: response[1].isSuperHuemn,
                    isLoggedInUserOwner: response[1].isOwner,
                });
            } else if (getOnlyPhoneNumber) {
                if (response[1].phoneNumber) {
                    if (response[1].phoneNumber == null || response[1].phoneNumber == '') {
                        return [
                            false,
                            'No Phone Number,please retry after adding phone number to user',
                        ];
                    } else {
                        return [true, response[1].phoneNumber];
                    }
                } else {
                    return [
                        false,
                        'No Phone Number,please retry after adding phone number to user',
                    ];
                }
            } else {
                localStorage.setItem(
                    `userAccess::${workspaceID}::${tenantUserId}`,
                    JSON.stringify(response[1].accessControls),
                );
                localStorage.setItem(
                    `userRole::${workspaceID}::${tenantUserId}`,
                    btoa(response[1].role),
                );
                localStorage.setItem(
                    `isSuperHuemn::${workspaceID}::${tenantUserId}`,
                    response[1].isSuperHuemn,
                );
                this.setState({
                    tenantUserEmail: response[1].email,
                    tenantUserFirstName: response[1].firstName,
                    tenantUserLastName: response[1].lastName,
                    tenantUserIsOwner: response[1].isOwner,
                    tenantUserIsSuperHuemn: response[1].isSuperHuemn,
                    tenantUserRole: response[1].role,
                    tenantTempUserRole: response[1].role,
                    accessControls: response[1].accessControls ? response[1].accessControls : [],
                    originalAccessControls: response[1].accessControls
                        ? response[1].accessControls
                        : [],
                    isTenantDetailsLoading: false,
                    tenantUserPhoneNumber: response[1].phoneNumber ? response[1].phoneNumber : '',
                    firstName: response[1].firstName,
                    lastName: response[1].lastName,
                    phoneNumber: response[1].phoneNumber ? response[1].phoneNumber : '',
                });
            }
        } else {
            return [false, response[1]?.message];
        }
    };

    getTenantInviteDetails = async (inviteID) => {
        let usertoken = localStorage.getItem('usertoken');
        let response = await TenantUserAction.getTenantInviteDetails(
            inviteID,
            this.props.match.params.workspaceID,
            usertoken,
        );

        if (response[0] === true) {
            let proposal = _.filter(
                response[1].accessControls,
                (item) => item.app === 'proposal',
            )[0];
            let gallery = _.filter(response[1].accessControls, (item) => item.app === 'gallery')[0];
            let form = _.filter(response[1].accessControls, (item) => item.app === 'form')[0];

            this.setState({
                tenantUserEmail: response[1].inviteeEmail,
                tenantUserFirstName: 'Pending',
                tenantUserLastName: 'invitation...',
                tenantUserIsOwner: false,
                tenantUserRole: response[1].inviteeRole,
                tenantTempUserRole: response[1].inviteeRole,
                accessControls: response[1].accessControls,
                isGalleryEnabled: gallery === undefined ? true : gallery.isEnabled,
                isProposalEnabled: proposal === undefined ? true : proposal.isEnabled,
                isFormEnabled: form === undefined ? true : form.isEnabled,
                hasGalleryFullAccess: gallery === undefined ? true : gallery.hasFullAccess,
                hasProposalFullAccess: proposal === undefined ? true : proposal.hasFullAccess,
                hasFormFullAccess: form === undefined ? true : form.hasFullAccess,
                isTenantDetailsLoading: false,
            });
        }
    };

    updateTenantUserAccessControls = async (tenantUserId, json) => {
        let usertoken = localStorage.getItem('usertoken');
        toast.promise(
            new Promise(async (resolve, reject) => {
                let response = await TenantUserAction.updateTenantUserAccessControls(
                    tenantUserId,
                    this.props.match.params.workspaceID,
                    usertoken,
                    json,
                );
                if (response[0] === true) {
                    this.getTenantUserDetails(tenantUserId, this.props.match.params.workspaceID);
                    resolve(true);
                } else {
                    reject(true);
                }
            }),
            {
                pending: 'Loading',
                success: 'Updated successfully',
                error: 'failed to update',
            },
            {
                theme: 'colored',
            },
        );
    };
    updateTenantInviteAccessControls = async (inviteId, json) => {
        let usertoken = localStorage.getItem('usertoken');

        toast.promise(
            new Promise(async (resolve, reject) => {
                let response = await TenantUserAction.updateTenantInviteAccessControls(
                    inviteId,
                    this.props.match.params.workspaceID,
                    usertoken,
                    json,
                );
                if (response[0] === true) {
                    this.getTenantInviteDetails(inviteId);
                    resolve(true);
                } else {
                    reject(true);
                }
            }),
            {
                pending: 'Loading',
                success: 'Updated successfully',
                error: 'failed to update',
            },
            {
                theme: 'colored',
            },
        );
    };
    resendTenantInvite = async (inviteId) => {
        let usertoken = localStorage.getItem('usertoken');
        toast.promise(
            new Promise(async (resolve, reject) => {
                let response = await TenantUserAction.resendTenantInvite(
                    inviteId,
                    this.props.match.params.workspaceID,
                    usertoken,
                );
                if (response[0] === true) {
                    resolve(true);
                } else {
                    reject(true);
                }
            }),
            {
                pending: 'Loading',
                success: 'Invite Sent',
                error: 'failed to send',
            },
            {
                theme: 'colored',
            },
        );
    };
    updateTenantUserDetails = async (tenantUserId, json) => {
        let usertoken = localStorage.getItem('usertoken');

        this.setState({ isLoading: true });
        var response = [];
        response[0] = false;
        await toast.promise(
            new Promise(async (resolve, reject) => {
                response = await TenantUserAction.updateTenantUserDetails(
                    tenantUserId,
                    this.props.match.params.workspaceID,
                    usertoken,
                    json,
                );
                if (response[0] === true) {
                    resolve(true);
                    this.setState(
                        {
                            isLoading: false,
                            isFormLoading: false,
                            isDetailsSuccessMessage: true,
                            firstName: response[1].firstName,
                            lastName: response[1].lastName,
                            phoneNumber: response[1].phoneNumber,
                            //phoneNumber: response[1].phoneNumber,
                            email: response[1].email,
                            detailsSuccessMessage: 'Details Updated Successfully',
                        },
                        () => {
                            this.getTenantUserDetails(
                                this.props.match.params.userId,
                                this.props.match.params.workspaceID,
                            );
                        },
                    );
                } else {
                    //this.setState({ errorMessage: response[1].message, isFormLoading: false });
                    reject(response[1].message);
                }
            }),
            {
                pending: 'Loading',
                success: 'Updated successfully',
                error: {
                    render({ data }) {
                        return `${data}`;
                    },
                },
            },
            {
                theme: 'colored',
                autoClose: 700,
            },
        );
    };
}

export default TenantUser;
