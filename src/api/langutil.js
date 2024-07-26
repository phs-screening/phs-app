import en_us from './lang/en_us.json'

export function parseFromLangKey(key, ...args) {
    let text = en_us[key]
    for (let [index, val] of args.entries()) {
        text = text.replace(`{${index}}`, val)
    }
    return text
}