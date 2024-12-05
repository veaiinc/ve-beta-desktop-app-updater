import React from 'react';
import Select from './Select';

const Label = ({ title, options, selected }) => {
	return (
		<Select
			title={title}
			options={options.map((option) => ({
				...option,
				icon: (
					<div
						style={{
							backgroundColor: option.color,
							height: '8px',
							width: '8px',
							borderRadius: '10px',
						}}
					/>
				),
			}))}
			showLabel={true}
			selected={selected}
		/>
	);
};

export default Label;
