import React from 'react';
import '../../../assets/scss/inputNew.scss';

class InputNew extends React.Component {
    render() {
        let {
            value,
            type,
            name,
            onChange,
            inputRef,
            id,
            label,
            isInputError,
            errorMessage,
            image,
            onClickImage,
            isIconLast,
            dialCode,
            className,
            ...rest
        } = this.props;
        return (
            <div
                className={
                    'sl-input-container' +
                    (isInputError === true ? ' sl-error-input' : '') +
                    (label ? ' with-label' : '') +
                    (className ? ` ${className}` : '')
                }
            >
                {label ? <label className="sl-label">{label}</label> : ''}
                <div
                    className={
                        'sl-input' + (image ? ' with-image' : '') + (isIconLast ? ' icn-last' : '')
                    }
                >
                    {image ? (
                        <span className="sl-input-icn" onClick={onClickImage}>
                            {image}
                        </span>
                    ) : (
                        ''
                    )}
                    {dialCode ? <span className="sl-input-prefix">{dialCode}</span> : ''}
                    <input
                        style={label ? { fontWeight: '300', fontSize: '14px' } : {}}
                        spellCheck={false}
                        type={type}
                        name={name}
                        onChange={(e) => onChange(e)}
                        value={value}
                        /* placeholder={_.has(this.props, 'placeholder') ? this.props.placeholder : ''}
						readOnly={_.has(this.props, 'readOnly') ? this.props.readOnly : false}
						onBlur={(e) => {
							if (_.has(this.props, 'onBlur')) {
								this.props.onBlur(e);
							}
						}}
						onPaste={(e) => {
							if (_.has(this.props, 'onPaste')) {
								this.props.onPaste(e);
							}
						}} */
                        ref={inputRef ? inputRef : null}
                        id={id ? id : null}
                        {...rest}
                    />
                </div>
                {isInputError === true && errorMessage ? (
                    <div className="sl-error-input-text">{errorMessage}</div>
                ) : null}
            </div>
        );
    }
}

export default InputNew;
