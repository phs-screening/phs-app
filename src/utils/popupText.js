import React, { Fragment } from 'react';
import { useField } from 'uniforms';

export default function PopupText(props) {
    const [{ value: qnValue }] = useField(props.qnNo, {});
    if (qnValue===props.triggerValue) {
        return (
            <Fragment>
                {props.children}
            </Fragment>
        );
    }
    return null;
}