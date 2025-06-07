import React from 'react';

const NormalStickerShapes = ({
	className,
	stickerFill,
	stickerStroke,
	strokeStyles,
	stretch,
	width,
	shadowStyles,
	opacity,
	cornerRadius,
	showCornerRadius,
	corners,
	isDiffCorners,
}) => {
	return (
		<div
			className={`${className}`}
			style={{
				backgroundColor: stickerFill,
				opacity: opacity,
				// borderRadius: isDiffCorners
				// 	? 0
				// 	: (showCornerRadius && `${cornerRadius}px`) || 0,
				borderTopLeftRadius: isDiffCorners
					? `${corners?.topLeft}px`
					: (showCornerRadius && `${cornerRadius}px`) || 0,
				borderTopRightRadius: isDiffCorners
					? `${corners?.topRight}px`
					: (showCornerRadius && `${cornerRadius}px`) || 0,
				borderBottomLeftRadius: isDiffCorners
					? `${corners?.bottomLeft}px`
					: (showCornerRadius && `${cornerRadius}px`) || 0,
				borderBottomRightRadius: isDiffCorners
					? `${corners?.bottomRight}px`
					: (showCornerRadius && `${cornerRadius}px`) || 0,
				borderColor: strokeStyles?.stroke ? stickerStroke : '',
				borderWidth: strokeStyles?.stroke ? parseInt(strokeStyles?.strokeWidth) || 1 : '',
				borderStyle: strokeStyles?.stroke ? strokeStyles?.strokeStyle || 'solid' : '',
				width: stretch ? '100%' : width,
				// height: stretch ? '100%' : '85%',
				boxShadow: shadowStyles?.shadow
					? `${shadowStyles?.shadowX}px ${shadowStyles?.shadowY}px ${shadowStyles?.blur}px ${shadowStyles?.spread}px ${shadowStyles?.shadowColor}`
					: '',
			}}
		></div>
	);
};

export default NormalStickerShapes;
