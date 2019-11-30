
// function regexTestUrlWithSuffix(string, suffix=""){

//     const escapeSuffix = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

//     const matcher = new RegExp(`^http.*${escapeSuffix}$`, "i")

//     // const matcher = new RegExp(`^http.*\${suffix}$`, "i")

//     return matcher.test(string)
// }

// console.log("-----")
// console.log(regexTestUrlWithSuffix("http://local.com/antd-demo/public/models/obj/female02/female02.mtl"))

const queryString = require('query-string');

const parsed = queryString.parseUrl('/model/gltf/duck?foo=bar');
console.log(parsed)

parsed.query.token = "12345"

const newUrl = `${parsed.url}?${queryString.stringify(parsed.query)}`
console.log(newUrl)