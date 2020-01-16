// 全局键盘监听, 判断某个按键是否按下

const DownKeys = new Set([])

const Keys = {
    backspace: 8,
    del: 46,
    delete: 46,
    tab: 9,
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
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach((item, index) => Keys[`f${index}`] = 111 + index);

// 当鼠标移入窗口时，同步按键状态 alt ctrl shift
document.body.addEventListener("mouseenter", (e) => {

    if (e.altKey) {
        DownKeys.add(Keys.alt)
    } else {
        DownKeys.delete(Keys.alt)
    }

    if (e.ctrlKey) {
        DownKeys.add(Keys.ctrl)
    } else {
        DownKeys.delete(Keys.ctrl)
    }

    if (e.shiftKey) {
        DownKeys.add(Keys.shift)
    } else {
        DownKeys.delete(Keys.shift)
    }

    if (e.metaKey) {
        DownKeys.add(Keys.meta)
    } else {
        DownKeys.delete(Keys.meta)
    }
})

window.addEventListener("keydown", (e) => {
    // console.log("down", e.keyCode)
    DownKeys.add(e.keyCode)
})

window.addEventListener("keyup", (e) => {
    // console.log("up", e.keyCode)
    DownKeys.delete(e.keyCode)
})



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

export const getKeyCode = (keyName) => {
    const realName = Modifiers[keyName] || keyName
    return Keys[realName]
}

export const getShortCut = () => Array.from(DownKeys)

export const isShortCut = (input) => {

    const inShortCut = input.split("+").map(getKeyCode)

    const matchShortCut = getShortCut()

    if (inShortCut.length !== matchShortCut.length) {
        return false
    }

    return matchShortCut.every((keyName, i) => keyName === inShortCut[i])
}
