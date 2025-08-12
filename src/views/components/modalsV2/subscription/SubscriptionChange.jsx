import { memo, useContext, useEffect, useState } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/subscriptions/subscriptionChange.scss';
import { ReactComponent as MinusIcon } from '../../../../assets/svg/Settings/minusIcon.svg';
import { ReactComponent as PlusIcon } from '../../../../assets/svg/Settings/plusIcon.svg';
import Context from '../../../../context/context';
import { message } from '../../globalComponents/CustomToast';
import TeamSettingsModal from '../../../features/settings/TeamSettingsModal';
import Spinner from '../../loaders/Spinner';
const customStyles = {
	content: { zIndex: 1006 },
	overlay: { zIndex: 1005 },
};
const SubscriptionChange = ({
	isOpen,
	onClose,
	selectedAddOn,
	selectedPeriod,
	handleDowngrade,
	closeMainModal,
}) => {
	const {
		subscriptionInfo: { currentPlan, updateBaseSubscription, getCurrentSubscriptionPlan },
	} = useContext(Context);

	const [info, setInfo] = useState({
		count: null,
		price: 0,
		isOpenTeamSettings: false,
		isLoading: false,
	});

	const isSeatBased = selectedAddOn?.isSeatBasedPlan;
	const getUnitPrice = () =>
		selectedPeriod === 'Yearly' ? selectedAddOn?.yearlyPrice : selectedAddOn?.monthlyPrice;

	useEffect(() => {
		if (isOpen) {
			setInfo((prev) => ({ ...prev, count: currentPlan?.tenantUsers }));
		}
	}, [currentPlan?.tenantUsers, isOpen]);

	useEffect(() => {
		// If not seat-based, force count to 1
		if (!isSeatBased) {
			setInfo((prev) => ({ ...prev, count: 1 }));
		}

		const unitPrice = getUnitPrice() || 0;
		setInfo((prev) => ({ ...prev, price: (isSeatBased ? info.count : 1) * unitPrice }));
	}, [info.count, selectedAddOn, selectedPeriod]);

	const handleIncrement = () => {
		if (isSeatBased) {
			setInfo((prev) => ({ ...prev, count: prev.count + 1 }));
		}
	};

	const handleDecrement = () => {
		if (!isSeatBased) return;

		if (info.count > currentPlan?.tenantUsers) {
			setInfo((prev) => ({ ...prev, count: prev.count - 1 }));
		} else {
			message.error(
				`You currently have ${currentPlan?.tenantUsers} team member. You cannot reduce the team size below ${currentPlan?.tenantUsers}`,
			);
		}
	};

	const handleUpdateSubscription = async () => {
		if (info.isLoading) return;
		setInfo((prev) => ({ ...prev, isLoading: true }));
		const payload = {
			plan: {
				planId: selectedAddOn?._id,
				quantity: isSeatBased ? info.count : 1,
				recurringType: selectedPeriod === 'Yearly' ? 'yearly' : 'monthly',
			},
		};
		const response = await updateBaseSubscription(payload);
		if (response?.[0] === true) {
			message.success(response?.[1]?.message);
			setTimeout(async () => {
				await getCurrentSubscriptionPlan();
				setInfo((prev) => ({ ...prev, isLoading: false }));
				closeModal();
			}, 3000);
		} else {
			message.error(response?.[1]?.message);
			setInfo((prev) => ({ ...prev, isLoading: false }));
		}
	};

	const closeModal = () => {
		setInfo((prev) => ({ ...prev, count: null }));
		onClose();
		closeMainModal();
	};

	return (
		<ReactModal isOpen={isOpen} closeModal={closeModal} customStyles={customStyles}>
			<div className="subscriptionChange">
				<div className="subscriptionChangeHeader">
					<div className="planName">{selectedAddOn?.plan}</div>
					<div className="priceContainer">
						<span className="currencySymbol">
							{selectedAddOn?.currency === 'INR' ? '₹ ' : '$ '}
						</span>
						<span className="currencySymbol">
							{selectedPeriod === 'Yearly'
								? selectedAddOn?.yearlyPrice
								: selectedAddOn?.monthlyPrice}
							<span className="priceDuration">
								{selectedAddOn?.yearlyPrice > 0 &&
									selectedAddOn?.monthlyPrice > 0 &&
									(() => {
										const users =
											selectedAddOn?.tenantUserDetails?.numberOfUsers;
										const isYearly = selectedPeriod === 'Yearly';
										const duration = isYearly ? 'Year' : 'Month';

										if (users === '*' || !users) {
											return `  Unlimited users/${duration}`;
										}

										return `${' '}${users}${' '}User/${duration}`;
									})()}
							</span>
						</span>
					</div>
				</div>
				<div className="subscriptionUserCountContainer">
					<div className="subscriptionUserCountHeader">
						<div className="subscriptionUserCountHeaderLeft">
							<div className="subscriptionUserCountHeaderLeftTitle">Users</div>
							<div className="subscriptionUserCountHeaderLeftDescription">
								{!isSeatBased
									? 'This is a Unlimited User Plan'
									: 'Add more users based on your preference.'}
							</div>
						</div>
						<div className="priceContainer">
							{' '}
							{selectedAddOn?.currency === 'INR' ? '₹ ' : '$ '} {info.price}
						</div>
					</div>
					<div className="subscriptionUserCountBody">
						<div className="addOnsQuantityContainer">
							{isSeatBased && (
								<div
									className="minusIcon"
									onClick={() => {
										handleDecrement();
									}}
								>
									<MinusIcon />
								</div>
							)}
							<div className="countIndicators">{info?.count}</div>
							{isSeatBased && (
								<div
									className="minusIcon"
									onClick={() => {
										handleIncrement();
									}}
								>
									<PlusIcon />
								</div>
							)}
						</div>
						{isSeatBased && (
							<div
								className="manageUserContainer"
								onClick={() =>
									setInfo((prev) => ({ ...prev, isOpenTeamSettings: true }))
								}
							>
								Manage Users
							</div>
						)}
					</div>
				</div>
				<div className="subscriptionChangeFooter">
					<button
						className="subscriptionChangeFooterButton"
						onClick={handleUpdateSubscription}
					>
						{info.isLoading ? <Spinner /> : 'Subscribe'}
					</button>
				</div>
			</div>
			<TeamSettingsModal
				isOpen={info.isOpenTeamSettings}
				closeTeamSettings={() =>
					setInfo((prev) => ({ ...prev, isOpenTeamSettings: false }))
				}
			/>
		</ReactModal>
	);
};

export default memo(SubscriptionChange);
