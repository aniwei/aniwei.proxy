import React from 'react';
import AppBar from 'material-ui/AppBar';
import { assign } from 'lodash';

const ApplicationBar = (props) => {
    const style = {
        position: 'fixed',
        top: '0',
        width: '100%'
    }

    return <div className="view_appbar">
        <AppBar {...props} style={assign(style, props.style)} />
        {props.children}
    </div>
}

export default ApplicationBar;