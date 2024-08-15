import en_us from './lang/en_us.json'
import ta_in from './lang/ta_in.json'
import ms_my from './lang/ms_my.json'
import zh_cn from './lang/zh_cn.json'

import NotoSansSC_Normal from './lang/NotoSansSC-normal'
import NotoSansSC_Bold from './lang/NotoSansSC-bold'

import NotoSansTamil_normal from './lang/NotoSansTamil-normal'
import NotoSansTamil_bold from './lang/NotoSansTamil-bold'

var langFile = en_us

export function setLang(doc, langName) {
    langName = langName.toLowerCase()
    switch(langName) {
        case "english":
            langFile = en_us
            break
        case "mandarin":
            NotoSansSC_Normal.apply(doc)
            NotoSansSC_Bold.apply(doc)
            doc.setFont("NotoSansSC", 'normal')
            langFile = zh_cn
            break
        case "malay":
            langFile = ms_my
            break
        case "tamil":
            langFile = en_us
            alert("Unfortunately, the report generator does not work with Tamil.\nIf tamil is needed, generate the form manually.")
            // TAMIL IS BROKEN IN JSPDF, THANKS OBAMA
            // NotoSansTamil_normal.apply(doc)
            // NotoSansTamil_bold.apply(doc)
            // doc.setFont("NotoSansTamil", 'normal')
            // langFile = ta_in
            break
        default:
            console.log("Tried to parse unknown language " + langName + " for report!")
            langFile = en_us
            return false
      }
      return true
}

export function parseFromLangKey(key, ...args) {
    let text = langFile[key]
    for (let [index, val] of args.entries()) {
        text = text.replace(`{${index}}`, val)
    }
    return text
}