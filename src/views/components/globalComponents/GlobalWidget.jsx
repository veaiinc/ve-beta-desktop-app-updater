import { memo, useContext, useMemo, useState } from 'react';
import '../../../assets/scss/globalComponents/globalWidget.scss';
import PromptCards from './PromptCard';
import CalenderWidget from './CalenderWidget';
import TaskWidget from './TaskWidget';
import AutomationWidget from './AutomationWidget';
import ContactsWidget from './ContactsWidget';
import { Tooltip } from 'antd';
import { ReactComponent as CalendarSvg } from '../../../assets/svg/contacts/calendar.svg';
import { ReactComponent as TaskSvg } from '../../components/topNavbar/components/toolsTooltip/assets/tasks.svg';
import { ReactComponent as ContactSvg } from '../../../assets/svg/home_page/contacts.svg';
import { ReactComponent as AutomationsSvg } from '../../../assets/svg/home_page/automation.svg';
import Context from '../../../context/context';

const optionsList = [
	{
		id: 2,
		label: 'Task',
		value: 'task',
		tooltip: 'Manage your tasks and to-dos',
		showOption: true,
		icon: TaskSvg,
	},
	{
		id: 1,
		label: 'Calendar',
		value: 'calendar',
		tooltip: 'Manage your meetings and events',
		showOption: true,
		icon: CalendarSvg,
	},
	{
		id: 3,
		label: 'Contact',
		value: 'contact',
		tooltip: 'Manage your contacts and clients',
		controlValue: 'contact',
		showOption: true,
		icon: ContactSvg,
	},
	{
		id: 4,
		label: 'Automation',
		value: 'automation',
		tooltip: 'Create and manage your automations',
		controlValue: 'automation',
		showOption: true,
		icon: AutomationsSvg,
	},
];

const GlobalWidget = () => {
	const {
		profileInfo: { tenantUserAccessControls },
	} = useContext(Context);
	const [info, setInfo] = useState({
		selectedOption: 'task',
	});

	const componentMapper = useMemo(() => ({
		task: <TaskWidget />,
		calendar: <CalenderWidget />,
		automation: <AutomationWidget />,
		contact: <ContactsWidget />,
	}));

	const handleOptionSelection = (option) => {
		setInfo({
			selectedOption: option?.value,
		});
	};
	const renderedOptions = useMemo(() => {
		if (!tenantUserAccessControls || !optionsList) return null;

		const isAdmin = tenantUserAccessControls?.role === 'admin';

		const accessControlMap = Object.fromEntries(
			tenantUserAccessControls?.accessControls?.map((item) => [item?.app, item]) || [],
		);

		return optionsList?.map((option) => {
			if (!option?.showOption && !option?.controlValue) return null;

			if (option?.controlValue) {
				const accessControl = accessControlMap[option?.controlValue];
				const isEnabled = accessControl?.isEnabled;
				if (!isAdmin && !isEnabled) return null;
			}
			const Icon = option?.icon;
			return (
				<Tooltip
					key={option?.id}
					title={<div className="tooltipValue"></div>}
					placement="right"
					arrow={false}
					trigger="hover"
					color={'transparent'}
					rootClassName="tooltip-wrapper"
				>
					<div
						className={`option ${
							info?.selectedOption === option?.value ? 'active' : ''
						}`}
						onClick={() => handleOptionSelection(option)}
					>
						{option?.id === 0 ? (
							<div className="option-label">
								{option?.label}
								<Icon
									fill={
										info?.selectedOption === option?.value
											? 'var(--primary-button)'
											: 'var(--secondary-font)'
									}
								/>
							</div>
						) : (
							<>
								<Icon />
								<span> {option?.label}</span>
							</>
						)}
					</div>
				</Tooltip>
			);
		});
	}, [
		tenantUserAccessControls?.role,
		tenantUserAccessControls?.accessControls,
		info?.options,
		info?.selectedOption,
		handleOptionSelection, // make sure this is stable (e.g., memoized if needed)
	]);
	return (
		<div className="globalWidgetMainContainer">
			<div className="globalWidgetWrapper">
				{info?.selectedOption ? componentMapper[info?.selectedOption] : <CalenderWidget />}
				<PromptCards option={info?.selectedOption} />
			</div>
			<div className="widgetOptionsContainer">{renderedOptions}</div>
		</div>
	);
};
export default memo(GlobalWidget);
