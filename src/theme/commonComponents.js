import Divider from '@material-ui/core/Divider';

const size = 18;

export function title(text) {
    return (<div><Divider /><h2>{text}</h2><br /></div>)
}

export function underlined(text) {
    return (<p style={{textDecorationLine: 'underline', fontSize: size}}>{text}</p>);
}

export function blueText(text) {
    if (Array.isArray(text)) {
        return text.map(x => <div><p style={{color: 'blue'}}>{x}</p><br /></div>);
    } else {
        return (<div><p style={{color: 'blue'}}>{text}</p><br /></div>);
    }
}