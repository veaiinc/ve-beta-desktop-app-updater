import { useContext, useEffect } from 'react';
import s from './filesTooltip.module.scss';
import { ReactComponent as Documents } from './assets/documents.svg';
import { ReactComponent as Forms } from './assets/forms.svg';
import { ReactComponent as Templates } from './assets/templates.svg';
import { ReactComponent as Sites } from './assets/sites.svg';
import { ReactComponent as Gallery } from './assets/gallery.svg';
import { ReactComponent as NotesIcon } from './assets/noteIcon.svg';
import Context from '../../../../../context/context';
import { useNavigate } from 'react-router-dom';

// ✅ Mapping: UI Label → Backend App Name(s)
export const fileLabelToAppName = {
	Documents: 'fileManager',
	Forms: 'form',
	Gallery: ['liteGallery', 'classicGallery'],
	Templates: 'template',
	Notes: 'note',
};

const files = [
	{
		id: 1,
		icon: <Documents />,
		label: 'Documents',
		description: 'Smart files that adapt to your work and hold context.',
		link: '/files?active-tab=Documents&viewMode=card',
	},
	{
		id: 2,
		icon: <Forms />,
		label: 'Forms',
		description: 'Collect inputs and decisions with smart logic.',
		link: '/files?active-tab=Forms&viewMode=card',
	},
	{
		id: 3,
		icon: <Gallery />,
		label: 'Gallery',
		description: 'Store, view, and share visual assets easily.',
		link: '/files?active-tab=Gallery&viewMode=card',
	},
	{
		id: 4,
		icon: <Templates />,
		label: 'Templates',
		description: 'Start fast with reusable intelligent layouts.',
		link: '/files?active-tab=My-Templates&viewMode=card',
	},
	{
		id: 5,
		icon: <NotesIcon />,
		label: 'Notes',
		description: 'Track structured data connected to memory.',
		link: '/files?active-tab=Notes&viewMode=card',
	},
	{
		id: 6,
		icon: <Sites />,
		label: 'Sites',
		description: 'Publish website content directly from your workspace.',
		link: null,
	},
];

const FilesTooltip = ({ closeTooltip }) => {
	const region = localStorage.getItem('region');
	const navigate = useNavigate();
	const {
		profileInfo: { tenantUserAccessControls, getTenantUserAccessControls },
	} = useContext(Context);

	useEffect(() => {
		if (!tenantUserAccessControls) {
			getTenantUserAccessControls();
		}
	}, [tenantUserAccessControls]);

	const accessControls = tenantUserAccessControls?.accessControls;
	const userRole = tenantUserAccessControls?.role; // ✅ Get role

	// Build lookup: { [app]: isEnabled }
	const appsMap = {};
	if (Array.isArray(accessControls)) {
		accessControls.forEach((control) => {
			const appName = control.app;
			if (appName) {
				appsMap[appName] = control.isEnabled;
			}
		});
	}

	// ✅ Updated: Respect role — bypass filtering if not 'default'
	const shouldShowFile = (fileLabel) => {
		// ✅ If role is NOT 'default', show everything
		if (userRole !== 'default') {
			return true;
		}

		// ✅ Special case: Always show "Sites" — no access control (even for default role)
		if (fileLabel === 'Sites') {
			return true;
		}

		const appNames = fileLabelToAppName[fileLabel];

		// If no mapping → hide (defensive, but won't matter if role !== 'default')
		if (!appNames) return false;

		const namesToCheck = Array.isArray(appNames) ? appNames : [appNames];

		// Show if any mapped app is explicitly enabled
		for (let name of namesToCheck) {
			if (appsMap.hasOwnProperty(name)) {
				if (appsMap[name] === true) {
					return true;
				}
			}
		}

		// Not found or all disabled → HIDE
		return false;
	};

	const visibleFiles = files.filter((file) => shouldShowFile(file.label));

	return (
		<div
			className={s.filesTooltipContainer}
			style={region === 'ap-south-1' ? { left: '-12px' } : { left: '-226px' }}
		>
			{visibleFiles.map((file) => (
				<div
					key={file.id}
					className={s.fileContainer}
					onClick={() => {
						if (file.link) {
							navigate(file.link);
						}
						closeTooltip();
					}}
				>
					<div className={s.fileIcon}>{file.icon}</div>
					<div className={s.fileInfo}>
						<h3 className={s.fileLabel}>{file.label}</h3>
						{/* <p className={s.fileDescription}>{file.description}</p> */}
					</div>
				</div>
			))}
		</div>
	);
};

export default FilesTooltip;
