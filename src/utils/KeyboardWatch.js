// 全局键盘监听, 判断某个按键是否按下

const DownKeys = new Set([])

const ShiftKey = 16
const CtrlKey = 17
const AltKey = 18
const CommandKey = 91

window.onkeydown = (e) => {
    // console.log(e.keyCode)
    DownKeys.add(e.keyCode)
}
window.onkeyup = (e) => DownKeys.delete(e.keyCode)

export const isCtrlDown = () => DownKeys.has(CtrlKey) || DownKeys.has(CommandKey)
export const isShiftDown = () => DownKeys.has(ShiftKey)
export const isAltDown = () => DownKeys.has(AltKey)
