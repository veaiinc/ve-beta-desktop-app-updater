import React from 'react';
import '../../assets/scss/header.scss';
import { ReactComponent as VE } from '../../assets/svg/ve.svg';
import DropDown from './dropDown/DropDown';
import { useNavigate } from 'react-router-dom';

const modules = ['inbox', 'sales'];
const accessibleWorkspaces = JSON.parse(localStorage.getItem('accessibleWorkspaces'));
const activeWorkspaceId = localStorage.getItem('workspaceId');

const changeWorkspaceId = (item) => {
	if (item === activeWorkspaceId) {
		return;
	}
	localStorage.setItem('workspaceId', item);
};

const iconComponent = (
	<div
		style={{
			display: 'flex',
			width: '18px',
			height: '18px',
			justifyContent: 'center',
			alignItems: 'center',
			gap: '5.625px',
			borderRadius: '56.25px',
			background:
				'url(https://s3-alpha-sig.figma.com/img/1785/4816/6b242fa46aaac2dc8b45609480a257a7?Expires=1719792000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iiGtkJltYhmFpJEjLTL3da5weMk3RS~kz41rEB5FRlBc7f5Z6QrYajx4l9J6rFkjM7PJRErDB-hUwGrIvRwQqxiIFy9OiPSnkxmCNj1KJoPjLg8BT5jb3GoxoTz2tZmxic1R5iAUYRX-f~y8FTCqERjIVkZhGEd60SyrfgLPpS97Ruxuq6zCvwAPOorZM8qOS0nlM4~Drp0pqddZRxNtxLDTY4VuIPlXw2O~oz-dbBB5I6-SEyLHx~xKPFeD8ph5DARXtHktw3bpU0VCmDNecA2UZfpP5hgDsXeM9bINAGidL-2zyfO~8QNFGleIJThiCaIrxgQ-ZcdhDygd7BWvBQ__)',
			backgroundSize: 'cover',
			backgroundPosition: 'center',
		}}
	></div>
);

const Header = ({ title, hideQuickNav = false }) => {
	const navigate = useNavigate();
	return (
		<div className="headerContainer">
			<VE />
			{/* {header modules} */}
			{hideQuickNav ? (
				''
			) : (
				<div className="headerModulesContainer">
					<div
						className={`filterButton ${title === 'Inbox' ? 'filterButtonActive' : ''}`}
						onClick={() => navigate('/inbox')}
					>
						Inbox
					</div>
					<div
						className={`filterButton ${title === 'Sales' ? 'filterButtonActive' : ''}`}
						onClick={() => navigate('/sales')}
					>
						Sales
					</div>
				</div>
			)}
			<DropDown
				selectedValue={activeWorkspaceId}
				options={accessibleWorkspaces}
				containerStyle={{
					padding: '10px 12px 10px 10px',
					gap: '6px',
					width: 'auto',
				}}
				valueSelector={'itself'}
				dropDownStyle={{ right: 0, top: '50px', left: 'unset', width: 'auto' }}
				iconComponent={iconComponent}
				uniqueIdKey={activeWorkspaceId}
				onChange={changeWorkspaceId}
			/>
		</div>
	);
};

export default Header;
