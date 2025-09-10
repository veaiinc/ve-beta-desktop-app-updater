import React from 'react';
import {ReactComponent as Info} from '../../../assets/svg/DeleteTemplate/Info.svg';
class DeleteTemplatePopup extends React.Component {
    constructor(props) {
        super(props);
    }
    render(){
        return(
            <div className="template_delete_popup_container">
                <div className='template_delete_popup_header'>
                    <Info />
                    <div className='template_delete_popup_header_title'>Are you sure to delete Template?</div>
                    <div className='template_delete_popup_header_description'>You’ve created <span style={{fontWeight: '700',color:'#F2F2F3'}}>{this.props?.numOfDocuments} documents</span> using this template.</div>
                </div>
                <div className='template_delete_popup_footer'>
                  {this.props?.numOfDocuments > 0 && <div className='template_delete_popup_footer_button' onClick={() => this.props?.SetDeleteTemplate(false)}>Delete Template + Documents</div>}
                    <div className='template_delete_popup_footer_button' onClick={() => this.props?.SetDeleteTemplate(this.props?.numOfDocuments > 0 ? true :false)}>Delete Template {this.props?.numOfDocuments > 0 ? 'Only' : ''}</div>
                </div>

                
            </div>
        )
    }
}

export default DeleteTemplatePopup;
