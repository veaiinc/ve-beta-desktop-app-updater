import React from 'react';
import Context from './context';
import CombineState from './CombineState';
const ContextState = (props) => {
	return (
		<Context.Provider
			value={{
				...CombineState(),
			}}
		>
			{props.children}
		</Context.Provider>
	);
};

export default ContextState;
