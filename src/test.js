
// function regexTestUrlWithSuffix(string, suffix=""){

//     const escapeSuffix = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

//     const matcher = new RegExp(`^http.*${escapeSuffix}$`, "i")

//     // const matcher = new RegExp(`^http.*\${suffix}$`, "i")

//     return matcher.test(string)
// }

// console.log("-----")
// console.log(regexTestUrlWithSuffix("http://local.com/antd-demo/public/models/obj/female02/female02.mtl"))

console.log(JSON.stringify("production"))

console.log(JSON.stringify("production") === "production")
