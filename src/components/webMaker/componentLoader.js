
import { Components } from "./components"

export const ComponentKeys = Object.keys(Components)

export const getComponent = (componentKey) => Components[componentKey]

export const notFoundComponent = () => <div>组件待开发</div>

export const loadComponent = (componentKey) => {
    const component = getComponent(componentKey)
    return component || notFoundComponent
}

export const forEachComponent = (callback) => {
    ComponentKeys.forEach((componentKey) => {
        const component = getComponent(componentKey)
        callback(componentKey, component)
    })
}
