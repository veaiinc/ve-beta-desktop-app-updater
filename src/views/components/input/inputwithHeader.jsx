import React, { Component } from 'react';
import _ from 'lodash';
class InputHeader extends Component {
    constructor() {
        super();
        this.id = 'text-area-input__' + Math.random().toFixed(8).slice(2);
    }
    isFirstLoad = true;
    componentDidMount = () => {
        if (_.has(this.props, 'textarea')) {
            window.addEventListener('resize', this.handleResize);
        }
    };

    componentWillUnmount = () => {
        if (_.has(this.props, 'textarea')) {
            window.removeEventListener('resize', this.handleResize);
        }
    };

    handleResize = () => {
        this.handleNotesInput();
    };

    handleNotesInput = (e) => {
        if (document.getElementById(this.id)) {
            let item = document.getElementById(this.id);
            item.style.height = '30px';
            item.style.height = item.scrollHeight === 0 ? '30px' : item.scrollHeight - 3 + 'px';
            if (this.isFirstLoad === true) {
                item.blur();
            }
        }
    };

    render() {
        return (
            <div
                className="p-form-group w-100p f-left"
                style={{ padding: _.has(this.props, 'padding') ? this.props.padding : '' }}
            >
                <div
                    className={`floating-label ${this.props.isInputError ? 'error-label' : ''}`}
                    style={{
                        width: _.has(this.props, 'width')
                            ? this.props.width
                            : 'calc(62.7% - 104px)',
                        marginBottom: _.has(this.props, 'marginBottom')
                            ? this.props.marginBottom
                            : '32px',
                    }}
                >
                    {_.has(this.props, 'textarea') ? (
                        <textarea
                            type={this.props.type}
                            name={this.props.name}
                            //onChange={(e) => this.props.onChange(e)}
                            value={this.props.value}
                            className={'floating-input'}
                            placeholder={this.props.placeholder}
                            readOnly={_.has(this.props, 'readOnly') ? this.props.readOnly : false}
                            onInput={(e) => {
                                this.props.onChange(e);
                                this.handleNotesInput();
                            }}
                            id={_.has(this.props, 'id') ? this.props.id : null}
                            onBlur={(e) => {
                                if (_.has(this.props, 'onBlur') && this.isFirstLoad === false) {
                                    this.props.onBlur(e);
                                } else {
                                    this.isFirstLoad = false;
                                }
                            }}
                            spellCheck={false}
                            autoFocus
                            onFocus={this.handleNotesInput}
                        />
                    ) : (
                        <input
                            spellCheck={false}
                            type={this.props.type}
                            name={this.props.name}
                            onChange={(e) => this.props.onChange(e)}
                            value={this.props.value}
                            className={`floating-input ${
                                _.has(this.props, 'className') ? this.props.className : ''
                            }`}
                            placeholder={
                                _.has(this.props, 'placeholder') ? this.props.placeholder : ''
                            }
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
                            }}
                            ref={_.has(this.props, 'inputRef') ? this.props.inputRef : null}
                            id={_.has(this.props, 'id') ? this.props.id : null}
                        />
                    )}
                    <span className="highlight"></span>
                    <label className="labelInput">
                        {this.props.isInputError
                            ? this.props.label + ' ' + this.props.errorMessage
                            : this.props.label}
                        {_.has(this.props, 'required') && this.props.required ? (
                            <span className="required-input-new">
                                {this.props.isInputError ? '' : '*'}
                            </span>
                        ) : null}
                    </label>
                </div>
            </div>
        );
    }
}

export default InputHeader;
