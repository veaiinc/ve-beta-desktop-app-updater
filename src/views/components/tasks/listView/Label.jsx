import React from 'react';
import Select from './Select';

const Label = ({ title = '', options = [], value }) => {
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
			selected={value}
		/>
	);
};

export default Label;
