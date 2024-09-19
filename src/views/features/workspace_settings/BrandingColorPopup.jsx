// import React, { useState, useEffect, useContext } from 'react';
// import 'react-phone-input-2/lib/style.css';
// import Modal from '../../components/modalsV2/index';
// import { ReactComponent as CrossIcon } from '../../../assets/svg/workspaceSettings/cross.svg';
// import Context from '../../../context/context';

// const BrandingColorPopUp = (props) => {
// 	const {
// 		companyInfo: { updatePrefernces },
// 	} = useContext(Context);
// 	const [hexCode, setHexCode] = useState(props.value);
// 	const handleChangeColor = () => {
// 		let json = {
// 			brandAccentColor: hexCode,
// 		};
// 		if (hexCode.length > 3) {
// 			props.selectedColor(hexCode);
// 			props.handleClose();
// 			updatePrefernces(json);
// 		}
// 	};

// 	return (
// 		<Modal onRequestClose={props.handleClose} isOpen={props.show}>
// 			<div
// 				style={{
// 					backgroundColor: '#151515',
// 					width: '480px',
// 					maxHeight: '350px',
// 					borderRadius: '40px',
// 					padding: '32px 24px 0 24px',
// 				}}
// 			>
// 				<div
// 					style={{
// 						display: 'flex',
// 						justifyContent: 'space-between',
// 						gap: '5px',
// 					}}
// 				>
// 					<span
// 						style={{
// 							fontFamily: 'Inter',
// 							fontSize: '16px',
// 							color: '#e4e5e6',
// 							lineHeight: '24px',
// 						}}
// 					>
// 						Choose Accent Colour
// 					</span>
// 					<span style={{ cursor: 'pointer' }} onClick={props.handleClose}>
// 						<CrossIcon />
// 					</span>
// 				</div>
// 				<div style={{ width: '100%', padding: '24px 0 0 0' }}>
// 					<div
// 						style={{
// 							fontFamily: 'Inter',
// 							fontSize: '11px',
// 							color: '#b0b0b0',
// 							lineHeight: '16px',
// 							paddingLeft: '11px',
// 						}}
// 					>
// 						Enter Hex Code
// 					</div>
// 					<div style={{ position: 'relative' }}>
// 						<div
// 							style={{
// 								position: 'absolute',
// 								width: '16px',
// 								height: '16px',
// 								backgroundColor: `${hexCode}`,
// 								borderRadius: '100%',
// 								top: '20px',
// 								left: '20px',
// 								transform: 'translate(-50%)',
// 							}}
// 						></div>
// 						<input
// 							style={{
// 								borderRadius: '10px',
// 								border: '1px solid #242424A3',
// 								width: '100%',
// 								height: '48px',
// 								padding: '11px 14px 11px 40px',
// 								marginTop: '5px',
// 								backgroundColor: '#151515',
// 								color: '#E4E5E63D',
// 								fontSize: '16px',
// 								fontFamily: 'Inter',
// 							}}
// 							value={hexCode}
// 							onChange={(e) => setHexCode(e.target.value)}
// 						/>
// 					</div>
// 				</div>
// 				<div
// 					style={{
// 						display: 'flex',
// 						justifyContent: 'center',
// 						width: '100%',
// 					}}
// 				>
// 					<div style={{ padding: '32px 0 32px 0', width: '100%' }}>
// 						<div
// 							style={{
// 								border: '1px solid #242424A3',
// 								color: '#e4e5e6',
// 								backgroundColor: '#181818',
// 								cursor: 'pointer', // Assuming this button is always clickable
// 								borderRadius: '100px',
// 								padding: '16px 24px',
// 								height: '48px',
// 								fontSize: '13px',
// 								fontFamily: 'Inter',
// 								textAlign: 'center',
// 							}}
// 							onClick={handleChangeColor}
// 						>
// 							<div>
// 								<span>Choose Color</span>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</Modal>
// 	);
// };

// export default BrandingColorPopUp;
