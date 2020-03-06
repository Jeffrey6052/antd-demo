
import * as THREE from "three"

export const makeCube = (size, color, position) => {
    const geometry = new THREE.BoxGeometry(size, size, size)
    const material = new THREE.MeshBasicMaterial({ color: color })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.copy(position)

    return cube
}

export const transHexToCSSColor = (value) => {
    return "#" + lodash.padStart(value.toString(16), 6, '0')
}


let lastChartId = 0
const getRandomChartId = (max) => {
    lastChartId = lastChartId + 1
    return 1 + lastChartId % max
}

export const makeTextSprite = (message, renderer) => {
    const canvas = document.createElement("canvas")

    const context = canvas.getContext("2d")
    context.font = "14px Microsoft YaHei"

    // 避免放大模糊
    context.imageSmoothingEnabled = false
    context.webkitImageSmoothingEnabled = false
    context.mozImageSmoothingEnabled = false

    // 虽然可以根据文本计算宽高，但是会有模糊的bug, 直接使用固定宽高
    // 会被自动修改 THREE.WebGLRenderer: Texture has been resized from(58x24) to(32x16)
    const metrics = context.measureText(message)
    const textWidth = Math.ceil(metrics.width)
    const borderWidth = 1
    const padding = 1
    const calculateWidth = textWidth + borderWidth * 2 + padding * 2

    // 设置最小宽度，保持比例美观
    const fullWidth = calculateWidth > 60 ? calculateWidth : 60
    const fullHeight = 20

    canvas.width = fullWidth
    canvas.height = fullHeight

    // 背景
    context.fillStyle = "rgba(0, 0, 0, 0.5)"
    context.fillRect(0, 0, fullWidth, fullHeight)

    // 边框
    if (borderWidth) {
        context.fillStyle = "#2193B9"
        context.fillRect(0, 0, fullWidth, borderWidth)
        context.fillRect(0, 0, borderWidth, fullHeight)
        context.fillRect(0, fullHeight - borderWidth, fullWidth, borderWidth)
        context.fillRect(fullWidth - borderWidth, 0, borderWidth, fullHeight)
    }

    context.textAlign = "center"
    context.fillStyle = "#2193B9"
    context.fillText(message, fullWidth / 2, fullHeight / 2 * 1.4)

    const texture = new THREE.Texture(canvas)
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
    texture.minFilter = THREE.LinearFilter
    texture.needsUpdate = true
    const material = new THREE.SpriteMaterial({
        map: texture,
        sizeAttenuation: true,
        // transparent: false,
        // color: 0xffffff // CHANGED
    })
    const sprite = new THREE.Sprite(material)
    sprite.material.depthTest = false;
    sprite.renderOrder = 1
    sprite.center = new THREE.Vector2(0.5, 0)
    sprite.scale.set(fullWidth, fullHeight, 1)
    sprite.userData = {
        title: message,
        template: (Math.random() * 10 + 10).toFixed(1),
        humidity: (Math.random() * 10 + 20).toFixed(1),
        chart1: getRandomChartId(5),
        chart2: getRandomChartId(5)
    }

    // 用group包起来
    const group = new THREE.Group()
    group.add(sprite)

    // 额外记录一些信息，用于使用时判断位置

    return group
}

// function for drawing rounded rectangles
const roundRect = (ctx, x, y, w, h, r) => {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
}