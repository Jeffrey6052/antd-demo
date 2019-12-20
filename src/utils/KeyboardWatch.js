// 全局键盘监听, 判断某个按键是否按下

const DownKeys = new Set([])

const ShiftKey = 16
const CtrlKey = 17
const AltKey = 18

window.onkeydown = (e) => DownKeys.add(e.keyCode)
window.onkeyup = (e) => DownKeys.delete(e.keyCode)

export const isCtrlDown = () => DownKeys.has(CtrlKey)
export const isShiftDown = () => DownKeys.has(ShiftKey)
export const isAltDown = () => DownKeys.has(AltKey)
