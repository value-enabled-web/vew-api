// Same matching as Alby: https://github.com/getAlby/lightning-browser-extension/blob/master/src/extension/content-script/batteries/helpers.ts
export const matchLightningAddress = (text) => {
  // The second lightning emoji is succeeded by an invisible
  // variation selector-16 character: https://emojipedia.org/variation-selector-16/️
  const regex = /((⚡|⚡️):?|lightning:|lnurl:)\s?([\w.-]+@[\w.-]+[.][\w.-]+)/i
  const match = text.match(regex)
  if (match) return match[3]

  return null
}
