import Divider from '@material-ui/core/Divider';

const size = 18;

export function title(text) {
    return (<div><Divider /><h2>{text}</h2></div>)
}

export function bold(text) {
    return (<h2>{text}</h2>)
}

export function divider() {
	return (<div></div>)
}

export function underlined(text) {
    return (<p style={{textDecorationLine: 'underline', fontSize: size}}>{text}<br /></p>);
}

export function underlinedWithBreak(text) {
    return (<p style={{textDecorationLine: 'underline', fontSize: size}}>{text}</p>);
}

export function blueText(text) {
    if (Array.isArray(text)) {
        return text.map(x => <div><p style={{color: 'blue', margin: 2, whiteSpace: "pre-wrap"}}>{x}</p></div>);
    } else {
        console.log(text)
        return (<div style={{margin: 2}}><p style={{color: 'blue', whiteSpace: "pre-wrap"}}>{text}</p></div>);
    }
}