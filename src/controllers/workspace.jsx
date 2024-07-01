import React, { Component } from 'react';
import * as WorkspaceAction from './oldActions';
import Cookies from 'universal-cookie';
import _ from 'lodash';
import TenantUserController from './tenantUser';
import axios from 'axios';
import { toast } from 'react-toastify';
const cookies = new Cookies();

class Workspace extends TenantUserController {
    getUserWorkSpaceList = async (redirect = true) => {
        let usertoken = localStorage.getItem('usertoken');

        let response = await WorkspaceAction.accesibleWorkSpacesForUser(usertoken);

        if (response[0] === true) {
            this.setState({
                isWorkSpaceListLoading: false,
                workspaceList: response[1],
            });
            if (redirect === true) {
                if (_.size(response[1]) === 0) this.props.history.push(`/user/create-workspace`);
                else this.props.history.push(`/${response[1][0]['workspaceId']}/projects`);
                //else this.loginIntoWorkSpace(response[1][0]['workspaceId']);
            } else {
                this.setState(
                    {
                        workspaceList: response[1],
                    },
                    () => {
                        let workspaceID = localStorage.getItem('workspaceId');

                        let activeWorkspace = response[1][0];

                        if (activeWorkspace.currency) {
                            localStorage.setItem('tenantLocaleCurrency', activeWorkspace.currency);
                            cookies.set('tenantLocaleCurrency', activeWorkspace.currency, {
                                domain:
                                    window.location.host.split('.')[1] === 'huemn'
                                        ? '.huemn.com'
                                        : window.location.hostname,
                                path: '/',
                            });
                        } else {
                            localStorage.setItem('tenantLocaleCurrency', 'INR');
                            cookies.set('tenantLocaleCurrency', 'INR', {
                                domain:
                                    window.location.host.split('.')[1] === 'huemn'
                                        ? '.huemn.com'
                                        : window.location.hostname,
                                path: '/',
                            });
                        }
                    },
                );
                //localStorage.setItem('workspaceList', JSON.stringify(response[1]));
            }
        }
    };

    loginIntoWorkSpace = async (tenantId) => {
        let usertoken = localStorage.getItem('usertoken');
        let response = await WorkspaceAction.loginIntoWorkSpace(tenantId, usertoken);
        if (response[0]) {
            localStorage.setItem('usertoken');

            this.props.history.push(`/${tenantId}/projects`);
        }
    };

    checkTenantAvailability = async (type = null) => {
        let usertoken = localStorage.getItem('usertoken');
        let response = await WorkspaceAction.checkTenantAvailability(
            type === 'loveco' ? this.state.subdomain : this.state.workSpace,
            usertoken,
        );

        if (type === 'loveco') {
            if (!response[1].isAvailable) {
                this.setState({
                    subdomainError: true,
                    subdomainErrorMessage: 'subdomain already exists',
                    isLoading: false,
                    isChecked: true,
                });
            } else {
                this.setState({
                    subdomainError: false,
                    subdomainErrorMessage: '',
                    isLoading: false,
                    isChecked: true,
                });
            }
        } else {
            if (!response[1].isAvailable) {
                this.setState({
                    errorWorkSpace: true,
                    errorWorkSpaceMessage: 'Account Not Available',
                    isLoading: false,
                    addressavailable: false,
                });
            } else {
                this.setState({
                    errorWorkSpace: false,
                    isLoading: false,
                    addressavailable: true,
                    isInputNoError: true,
                    noerrorMessage: 'Available',
                });
            }
        }
    };

    createWorkspace = async () => {
        this.setState({
            isLoading: true,
        });
        let usertoken = localStorage.getItem('usertoken');
        let json = {
            businessName: this.state.bussinessName,
            workspaceId: this.state.workSpace,
        };

        if (this.state.website != '') {
            json = {
                ...json,
                websiteUrl: this.state.website,
            };
        }

        let response = await WorkspaceAction.createWorkspace(json, usertoken);

        if (response[0] === true) {
            this.props.history.push('/' + this.state.workSpace + '/projects?welcome');
        } else {
            this.setState({
                isLoading: false,
                errorMessage: response[1].message,
            });
        }
    };

    getUserWorkspaceNotifications = async (pageNumber = 1) => {
        let usertoken = localStorage.getItem('usertoken');

        let response = await WorkspaceAction.getUserWorkspaceNotifications(
            this.props.match.params.workspaceID,
            usertoken,
            pageNumber,
        );

        if (response[0] === true) {
            this.setState({
                isNotificationListLoading: false,
                notifcationList:
                    pageNumber === 1
                        ? response[1].notifications
                        : [...this.state.notifcationList, response[1].notifications],
                unreadNotifications: response[1].unreadCount,
                notificationsPagination: response[1].metadata,
            });
            return response[1].unreadCount;
        } else {
            this.setState({
                isNotificationListLoading: false,
                errorMessage: response[1].message,
            });
            return false;
        }
    };

    markAllNotificationAsRead = async () => {
        let usertoken = localStorage.getItem('usertoken');

        let response = await WorkspaceAction.readAllNotifications(
            this.props.match.params.workspaceID,
            usertoken,
        );

        if (response[0] === true) {
            this.getUserWorkspaceNotifications();
        }
    };

    getNotificationDetails = async () => {
        let usertoken = localStorage.getItem('usertoken');

        let response = await WorkspaceAction.getNotificationDetails(
            this.props.match.params.workspaceID,
            this.props.match.params.notificationID,
            usertoken,
        );

        if (response[0] === true) {
            if (response[1].notificationType === 'suggested-edit') {
                let url =
                    window.location.origin.split('//')[1].split('.')[0] === 'dev-app'
                        ? 'https://dev-galleries.huemn.com/' +
                          this.props.match.params.workspaceID +
                          '/' +
                          response[1]['galleryDetails'][0]['slug'] +
                          '/suggested-edits/' +
                          response[1]['metadata']['image_id']
                        : window.location.origin.split('//')[1].split('.')[0] === 'app'
                        ? 'https://galleries.huemn.com/' +
                          this.props.match.params.workspaceID +
                          '/' +
                          response[1]['galleryDetails'][0]['slug'] +
                          '/suggested-edits/' +
                          response[1]['metadata']['image_id']
                        : 'http://' +
                          window.location.hostname +
                          ':7001/' +
                          this.props.match.params.workspaceID +
                          '/' +
                          response[1]['galleryDetails'][0]['slug'] +
                          '/suggested-edits/' +
                          response[1]['metadata']['image_id'];

                window.location.replace(url);
            }
        } else {
            this.setState({
                isNotificationListLoading: false,
                errorMessage: response[1].message,
            });
        }
    };

    getSubscriptionPlans = async (workspaceID = null) => {
        let usertoken = localStorage.getItem('usertoken');
        let response = await WorkspaceAction.getSubscriptionPlans(
            workspaceID ? workspaceID : localStorage.getItem('workspaceId'),
            usertoken,
        );

        if (response[0] === true) {
            this.setState({
                isSubscriptionLoading: false,
                subscriptionData: _.orderBy(
                    _.filter(response[1], { isActive: true }),
                    ['storageInGb'],
                    ['asc'],
                ),
            });
        } else {
            this.setState({
                isSubscriptionLoading: false,
            });
        }
    };
    getCouponCode = async (body) => {
        let usertoken = localStorage.getItem('usertoken');
        let response = await WorkspaceAction.getCouponCode(this.props.workspaceID, usertoken, body);

        if (response[0] == true) {
            if (response[1].isAvailable) {
                let discounts = response[1].discounts;
                console.log(discounts);
                let sDiscount = 0;

                let cDiscount = 0;
                let aDiscount = 0;
                let aDiscountType = 'fixed';
                let sDiscountType = 'fixed';
                let cDiscountType = 'fixed';
                if (_.size(_.filter(discounts, { category: 'general' })[0]) > 0) {
                    let valueType = _.filter(discounts, { category: 'general' })[0].valueType;
                    let value = _.filter(discounts, { category: 'general' })[0].value;
                    sDiscount = value;
                    cDiscount = value;
                    aDiscount = value;
                    sDiscountType = valueType;
                    cDiscountType = valueType;
                    aDiscountType = valueType;
                } else {
                    if (_.size(_.filter(discounts, { category: 'storage' })) > 0) {
                        let storageDisc = _.filter(discounts, { category: 'storage' })[0];
                        let type = storageDisc.valueType;
                        if (type === 'fixed') {
                            sDiscount = storageDisc.value;
                            sDiscountType = 'fixed';
                        } else {
                            sDiscount = storageDisc.value;
                            sDiscountType = 'percent';
                        }
                    }
                    if (_.size(_.filter(discounts, { category: 'crm' })) > 0) {
                        let crmDisc = _.filter(discounts, { category: 'crm' })[0];
                        let type = crmDisc.valueType;
                        if (type === 'fixed') {
                            cDiscount = crmDisc.value;
                            cDiscountType = 'fixed';
                        } else {
                            cDiscountType = 'percent';
                            cDiscount = crmDisc.value;
                        }
                    }
                }
                this.setState(
                    {
                        isCouponLoading: false,
                        isCouponError: false,
                        isCouponErrorMessage: '',
                        isCouponCodeApplied: true,
                        couponDiscounts: response[1].discounts,
                        couponCodeId: response[1].couponCodeId,
                        aDiscount,
                        aDiscountType,
                        sDiscount,
                        cDiscount,
                        sDiscountType,
                        cDiscountType,
                    },
                    () => this.calculateDiscounts(),
                );
            } else {
                this.setState({
                    isCouponLoading: false,
                    isCouponError: true,
                    isCouponErrorMessage: 'Coupon Unavailable',
                });
            }
        } else {
            this.setState({
                isCouponLoading: false,
                isCouponError: true,
                isCouponErrorMessage: 'Cannot Find Coupon',
            });
        }
    };
    getAICreditsPlan = async (workspaceID = null) => {
        let usertoken = localStorage.getItem('usertoken');
        let response = await WorkspaceAction.getAICreditsPlan(
            workspaceID ? workspaceID : this.props.match.params.workspaceID,
            usertoken,
        );

        if (response[0] === true) {
            this.setState({
                isAICreditsPlanLoading: false,
                aiCreditsPlanData: _.orderBy(
                    _.filter(response[1], { isActive: true }),
                    ['credits'],
                    ['asc'],
                ),
            });
        } else {
            this.setState({
                isAICreditsPlanLoading: false,
            });
        }
    };

    getUserDetailsForIntercom = async (workspaceID = null) => {
        console.log(workspaceID);
        let usertoken = localStorage.getItem('usertoken');

        let response = await WorkspaceAction.userDetailsForIntercom(
            workspaceID === null ? this.props.match.params.workspaceID : workspaceID,
            usertoken,
        );

        if (response[0] === true) {
            _.has(this.props, 'storeUserDetailsForIntercom') &&
                this.props.storeUserDetailsForIntercom(response[1]);
            this.setState({
                isIntercomLoading: false,
                intercomData: response[1],
            });
        } else {
            this.setState({
                isIntercomLoading: false,
            });
        }
    };

    requestRazorPayOrder = async (subscriptionID) => {
        let usertoken = localStorage.getItem('usertoken');

        this.setState({
            showPopup: false,
        });
        let response = await WorkspaceAction.requestRazorPayOrder(
            this.props.match.params.workspaceID,
            subscriptionID,
            usertoken,
        );

        if (response[0] === true) {
            let razorPayData = response[1];

            const options = {
                key: razorPayData.key,
                currency: razorPayData.currency,
                amount: razorPayData.amount.toString(),
                order_id: razorPayData.id,
                name: this.state.selectedPlan.plan + ' - Huemn',
                description: 'Huemn Subscription Plan',
                notes: razorPayData.notes,
                handler: async (response) => {
                    let json = {
                        payment_id: response.razorpay_payment_id,
                        order_id: response.razorpay_order_id,
                        signature: response.razorpay_signature,
                    };
                    let paymentResponse = await WorkspaceAction.sendRazorPayResponse(
                        this.props.match.params.workspaceID,
                        razorPayData.receipt,
                        json,
                        usertoken,
                    );

                    if (paymentResponse[0]) {
                        this.setState({
                            showPopup: true,
                            storageModelType: 'paymentDone',
                            subscriptionDetails: paymentResponse[1].planSubscribed,
                            amountPaid: paymentResponse[1].paidAmount / 100,
                        });
                    }
                },
                prefill: {
                    name:
                        this.state.firstName +
                        (this.state.lastName ? ` ${this.state.lastName}` : ''),
                    email: this.state.email,
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } else {
            toast.error(response[1].message, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'colored',
            });

            this.setState({
                isRazorPayLoading: false,
            });
        }
    };

    getVariables = async () => {
        let workspaceID = this.props.match.params.workspaceID;
        let userToken = localStorage.getItem('usertoken');
        let response = await WorkspaceAction.getVariables(workspaceID, userToken, 'proposal');
        if (response[0] === true) {
            this.setState({
                workspaceVariables: _.has(response[1], 'workspace') ? response[1].workspace : [],
                moduleVariables: _.has(response[1], 'module') ? response[1].module : [],
                customVariables: _.has(response[1], 'custom') ? response[1].custom : [],
                isLoading: false,
            });
            return true;
        } else {
            this.setState({ isLoading: false });
            return false;
        }
    };

    createCustomVariable = async (json) => {
        let workspaceID = this.props.match.params.workspaceID;
        let userToken = localStorage.getItem('usertoken');
        toast.promise(
            new Promise(async (resolve, reject) => {
                let response = await WorkspaceAction.createCustomVariable(
                    workspaceID,
                    json,
                    userToken,
                    'proposal',
                );
                if (response[0] === true) {
                    let variables = [...this.state.customVariables];
                    variables.push(response[1]);

                    this.setState({
                        customVariables: variables,
                    });
                    resolve(true);
                    return true;
                } else {
                    reject(true);
                    return false;
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
    uploadImage = async (json, image, type) => {
        let workspaceID = this.props.match.params.workspaceID;
        let userToken = localStorage.getItem('usertoken');
        let response;
        toast.promise(
            new Promise(async (resolve, reject) => {
                response = await WorkspaceAction.uploadImage(workspaceID, json, userToken, type);

                if (response[0] === true) {
                    let res = await this.axiosPutCallToS3Bucket(image, response[1]['signedUrl']);
                    if (res === true) {
                        resolve(true);
                        return true;
                    } else {
                        reject(true);
                        return false;
                    }
                } else {
                    reject(true);
                    return false;
                }
            }),
            {
                pending: 'Uploading image',
                success: 'Uploading successful',
                error: 'failed to upload image',
            },
            {
                theme: 'colored',
            },
        );
    };
    axiosPutCallToS3Bucket = async (image, uploadUrl) => {
        console.log('axiosPutCallToS3Bucket');
        let options = {
            headers: {
                'Content-Type': image.type,
            },
        };

        let response = await axios.put(uploadUrl, image, options);
        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    };
    getImages = async (type, actionType = null, imageId = null) => {
        let workspaceID = this.props.match.params.workspaceID;
        let userToken = localStorage.getItem('usertoken');
        let response = await WorkspaceAction.getImages(workspaceID, userToken, type);
        if (response[0] === true) {
            if (actionType === 'form-share') {
                let shareUrl = null;
                let filtered = _.filter(response[1], (image, index) => {
                    return image._id === imageId;
                });
                if (filtered) {
                    shareUrl = `https://api.huemn.com/images/1.0/${this.props.match.params.workspaceID}/images/${filtered._id}`;
                }
                this.setState({
                    imagesList: response[1],
                    shareUrl,
                    tempShareUrl: shareUrl,
                    isShareUrlLoading: false,
                });
                return true;
            }
            this.setState({
                imagesList: response[1],
            });
            return true;
        } else {
            return false;
        }
    };

    getLastTransactionDetails = async () => {
        let workspaceID = localStorage.getItem('workspaceId');
        let userToken = localStorage.getItem('usertoken');
        let response = await WorkspaceAction.getLastTransactionDetails(workspaceID, userToken);
        if (response[0] === true) {
            if (response[1].paymentCapturedNow === true) {
                this.getTenantSubscriptionDetails();
                this.getTenantUsageDetails();
            }
        } else {
        }
    };
    requestPaymentOrderForUSMonthly = async (payload, workspaceId = null) => {
        console.log('payload', payload);
        let usertoken = localStorage.getItem('usertoken');

        let response = await WorkspaceAction.requestPaymentOrderForUSMonthly(
            workspaceId == null ? this.props.match.params.workspaceID : workspaceId,
            payload,
            usertoken,
        );

        if (response[0] == true) {
            this.setState({
                iframeSrc: response[1].subscriptionLink,
                isPaymentLoading: false,
                showModal: true,
            });
        }
    };
    requestPaymentOrderForAICredits = async (payload, workspaceId = null) => {
        let usertoken = localStorage.getItem('usertoken');

        //close the modal.
        this.setState({
            showHuemnCreditsModel: false,
        });

        if (_.has(this.props, 'handleClose')) this.props.handleClose();

        let response = await WorkspaceAction.requestPaymentOrderForAICredits(
            workspaceId == null ? this.props.match.params.workspaceID : workspaceId,
            payload,
            usertoken,
        );

        if (response[0] === true) {
            let razorPayData = response[1];

            const options = {
                key: razorPayData.key,
                currency: razorPayData.currency,
                amount: razorPayData.amount.toString(),
                order_id: razorPayData.id,
                name: workspaceId === null ? 'AI Credits - Huemn' : 'Huemn Subscriptions',
                description: 'Huemn Subscription Plan',
                notes: razorPayData.notes,
                handler: async (response) => {
                    let json = {
                        payment_id: response.razorpay_payment_id,
                        order_id: response.razorpay_order_id,
                        signature: response.razorpay_signature,
                    };
                    let paymentResponse = await WorkspaceAction.sendRazorPayResponse(
                        workspaceId == null ? this.props.match.params.workspaceID : workspaceId,
                        razorPayData.receipt,
                        json,
                        usertoken,
                    );

                    if (paymentResponse[0]) {
                        if (workspaceId !== null)
                            // this.props.history.push(
                            // 	`/${workspaceId}/workspace-settings/subscription-plan`,
                            // );
                            window.location.replace(
                                `/${workspaceId}/workspace-settings/subscription-plan`,
                            );
                        this.setState({
                            showHuemnCreditsModel: true,
                            aiCreditsModalType: 'paymentDone',
                            aiCreditsPurchasedDetails: paymentResponse[1].aiCreditsPurchasedDetails,
                            amountPaid: paymentResponse[1].paidAmount / 100,
                        });
                        this.getTenantUsageDetails(workspaceId);
                        this.getTenantSubscriptionDetails(workspaceId);
                    }
                },
                prefill: {
                    name:
                        this.state.firstName +
                        (this.state.lastName ? ` ${this.state.lastName}` : ''),
                    email: this.state.email,
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } else {
            toast.error(response[1].message, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'colored',
            });

            this.setState({
                isRazorPayLoading: false,
            });
        }
    };

    getStripeBillingPortal = async () => {
        let workspaceID = this.props.match.params.workspaceID;
        let userToken = localStorage.getItem('usertoken');

        this.setState({ getStripeLink: true });
        let response = await WorkspaceAction.getStripeBillingPortal(workspaceID, userToken);
        if (response[0] === true) {
            window.location.href = response[1]['customerPortalLink'];
            this.setState({ getStripeLink: false });
        } else {
            this.setState({ getStripeLink: false });
        }
    };

    requestStripeOrder = async (subscriptionId, workspaceId = null) => {
        let usertoken = localStorage.getItem('usertoken');

        let payload = {
            subscriptionPlan_id: subscriptionId,
        };

        this.setState({
            isRequestStripeOrder: true,
        });
        let response = await WorkspaceAction.requestStripeOrder(
            workspaceId ? workspaceId : this.props.match.params.workspaceID,
            payload,
            usertoken,
        );

        if (response[0] === true) {
            this.setState({
                isRequestStripeOrder: false,
            });
            window.location.href = response[1]['url'];
        } else {
            this.setState({
                isRequestStripeOrder: false,
            });
        }
    };

    requestStripeOrderForAICredit = async (subscriptionId, workspaceId = null) => {
        let usertoken = localStorage.getItem('usertoken');

        this.setState({
            isRequestStripeOrder: true,
        });
        let response = await WorkspaceAction.postAICreditsPlan(
            workspaceId ? workspaceId : localStorage.getItem('workspaceId'),
            subscriptionId,
            usertoken,
        );

        if (response[0] === true) {
            this.setState({
                isRequestStripeOrder: false,
            });
            window.location.href = response[1]['url'];
        } else {
            this.setState({
                isRequestStripeOrder: false,
            });
        }
    };
}

export default Workspace;
