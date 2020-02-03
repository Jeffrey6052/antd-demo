// 全局键盘监听, 判断某个按键是否按下

import lodash from "lodash"

export const DownKeys = new Set([])

export const Keys = {
    backspace: 8,
    del: 46,
    delete: 46,
    // tab: 9, // tab有bug
    enter: 13,
    esc: 27,
    space: 32,
    pageUp: 33,
    pageDown: 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    ctrl: 17,
    shift: 16,
    meta: 91,
    alt: 18,
    ';': 186,
    '=': 187,
    ',': 188,
    '-': 189,
    '.': 190,
    '/': 191,
    '`': 192,
    '[': 219,
    '\\': 220,
    ']': 221
};

// Add uppercase versions of keys above for backwards compatibility
Object.keys(Keys).forEach(key => Keys[key.toUpperCase()] = Keys[key]);

'0123456789'.split('').forEach((num, index) => Keys[num] = index + 48);

'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((letter, index) => {
    Keys[letter] = index + 65;
    Keys[letter.toLowerCase()] = index + 65;
});

// fn keys
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach((num, index) => Keys[`f${num}`] = 111 + index);

const SupportKeyCodes = new Set(Object.values(Keys))

export const isCtrlDown = () => DownKeys.has(Keys.ctrl) || DownKeys.has(Keys.meta)
export const isShiftDown = () => DownKeys.has(Keys.shift)
export const isAltDown = () => DownKeys.has(Keys.alt)

export const Modifiers = {
    control: 'ctrl',
    ctrl: 'ctrl',
    shift: 'shift',
    meta: 'meta',
    cmd: 'meta',
    command: 'meta',
    option: 'alt',
    alt: 'alt'
}

export const getOriginKeyCode = (keyName) => {
    const realName = Modifiers[keyName] || keyName
    return Keys[realName]
}

export const getOriginShortCut = () => Array.from(DownKeys)
export const matchOriginShortCut = (matchString, originShortCut) => {
    const inShortCut = matchString.split("+").map(getOriginKeyCode)
    if (inShortCut.length !== originShortCut.length) {
        return false
    }

    return originShortCut.every((keyName, i) => keyName === inShortCut[i])
}

// 兼容处理, 使 meta = ctrl
export const getKeyCode = (keyName) => {
    const originKeyCode = getOriginKeyCode(keyName)
    return originKeyCode === Keys.meta ? Keys.ctrl : originKeyCode
}
export const getShortCut = () => getOriginShortCut().map((code) => code === Keys.meta ? Keys.ctrl : code)
export const matchShortCut = (matchString, shortCut) => {

    const inShortCut = matchString.split("+").map(getKeyCode)
    if (inShortCut.length !== shortCut.length) {
        return false
    }

    return shortCut.every((keyName, i) => keyName === inShortCut[i])
}

const updateDownKeysfromMouseEvent = (e) => {
    e.ctrlKey ? DownKeys.add(Keys.ctrl) : DownKeys.delete(Keys.ctrl)
    e.altKey ? DownKeys.add(Keys.alt) : DownKeys.delete(Keys.alt)
    e.shiftKey ? DownKeys.add(Keys.shift) : DownKeys.delete(Keys.shift)
    e.metaKey ? DownKeys.add(Keys.meta) : DownKeys.delete(Keys.meta)
}

const throttleUpdateDownKeysfromMouseEvent = lodash.throttle((e) => updateDownKeysfromMouseEvent(e), 100)

// 监听按键按下事件
window.onkeydown = (e) => {

    const keyCode = e.keyCode

    if (!SupportKeyCodes.has(keyCode)) {
        return
    }

    DownKeys.add(keyCode)
    // console.log("down", keyCode)
    // console.log(DownKeys)
}

// 监听按键弹起事件
window.onkeyup = (e) => {
    DownKeys.delete(e.keyCode)
}

// 鼠标移动时同步Ctrl Alt Shift按键状态
window.onmousemove = (e) => {
    throttleUpdateDownKeysfromMouseEvent(e)
}

// 鼠标进入时同步Ctrl Alt Shift按键状态
window.onmouseenter = (e) => {
    updateDownKeysfromMouseEvent(e)
}