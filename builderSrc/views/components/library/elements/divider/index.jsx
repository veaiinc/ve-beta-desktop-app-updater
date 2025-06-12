import React, { memo } from 'react';
import './divider.scss';
const Divider = ({ align, borderColor, borderStyle, borderWidth, isHorizontal, height, width }) => {
	return (
		<div
			className="divider-container"
			style={{
				width: '100%',
				height: '100%',
			}}
		>
			<div
				className="divider-container-wrapper"
				style={{
					display: 'flex',
					justifyContent: borderStyle !== 'arrow' && align,
					alignItems: 'center',
					flexDirection: borderStyle === 'arrow' ? 'row' : 'column',
					gap: '2px',
					position: 'relative',
					rotate: isHorizontal ? '0deg' : '90deg',
					width: isHorizontal ? '100%' : height,
					height: isHorizontal ? '100%' : width,
				}}
			>
				<div
					className="divider-line"
					style={{
						borderColor: borderColor,
						borderStyle:
							borderStyle !== 'double' && borderStyle !== 'arrow' && borderStyle,
						borderWidth: borderStyle !== 'arrow' && borderWidth && `${borderWidth}px`,
						borderImage:
							borderStyle === 'dashed' &&
							`repeating-linear-gradient(90deg, ${borderColor} 0px, ${borderColor} 10px, transparent 10px, transparent 20px) 10`,
					}}
				></div>
				{borderStyle === 'double' && (
					<div
						className="divider-line"
						style={{
							borderColor: borderColor,
							borderStyle: borderStyle !== 'double' && borderStyle,
							borderWidth: borderWidth && `${borderWidth}px`,
							borderImage:
								borderStyle === 'dashed' &&
								`repeating-linear-gradient(90deg, ${borderColor} 0px, ${borderColor} 10px, transparent 10px, transparent 20px) 10`,
						}}
					></div>
				)}
				{borderStyle === 'arrow' && (
					<>
						<div
							className="diamond-box"
							style={{
								left: '0px',
								backgroundColor: borderColor,
							}}
						></div>
						<div
							className="diamond-box"
							style={{
								right: '0px',
								backgroundColor: borderColor,
							}}
						></div>
					</>
				)}
			</div>
		</div>
	);
};

export default memo(Divider);
