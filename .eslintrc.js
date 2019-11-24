module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "airbnb",
    "parser": "babel-eslint",
    "globals": {
        "$": true,
        "process": true,
        "__dirname": true
    },
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module",
        "ecmaVersion": 7
    },
    "plugins": [
        "react",
        "jsx-a11y",
        "import",
    ],
    "rules": {
        "quote-props": 0,//要求对象字面量属性名称使用引号 **
        "no-return-assign": 0, //禁止在返回语句中赋值 **
        "no-confusing-arrow": 0,//禁止在可能与比较操作符相混淆的地方使用箭头函数 *
        "arrow-parens": 0,//要求箭头函数的参数使用圆括号 *
        "react/jsx-no-bind": 0,//JSX props should not use .bind() *
        "react/forbid-prop-types": 0, //禁止propTypes的数组
        "no-else-return": 0,//禁止else中使用return
        "jsx-a11y/alt-text": 0,//img强制使用alt
        "jsx-a11y/no-noninteractive-element-interactions": 0,// 非交互标签禁止事件
        "no-restricted-globals": 0,//禁用特定的全局变量 如isNaN
        "react/require-default-props": 0,//props默认类型
        "no-eval": 0,//禁用 eval()
        "consistent-return": 0,//要求 return 语句要么总是指定返回的值，要么不指定
        "no-plusplus": 0,//不使用++
        "no-extra-boolean-cast": 0,//禁止不必要的布尔转换 如!!
        "default-case": 0,//要求 switch 语句中有 default 分支
        "no-extend-native": 0,//禁止扩展原生类型
        "no-cond-assign": 0,//禁止条件表达式中出现赋值操作符
        "no-implied-eval": 0,//禁止使用类似 eval() 的方法
        "func-names": 0,//要求或禁止使用命名的 function 表达式
        "no-restricted-syntax": 0,//禁止使用特定的语法
        "no-shadow": 1,//禁止变量声明与外层作用域的变量同名
        "comma-dangle": 0,
        "comma-spacing": 0,
        "radix": 0, //parseInt 必须标明第二位参数
        "prefer-destructuring": 1,//优先解构赋值
        "newline-per-chained-call": 0,// 要求方法链中每个调用都有一个换行符
        "no-mixed-operators": 0,//禁止混合使用不同的操作符
        "react/no-typos": 0,
        "no-unused-vars": 1,
        "jsx-a11y/mouse-events-have-key-events": 0,
        "react/prefer-stateless-function": 0,
        "no-return-await": 0,
        "no-await-in-loop": 0,


        "guard-for-in": 0, // 此规则旨在防止使用for in循环而不过滤循环中的结果时可能出现的意外行为
        "indent": [2, 4], //js缩进 
        "quotes": 0,//强制使用一致的反勾号、双引号或单引号 (quotes)
        "react/jsx-indent": [2, 4],//jsx缩进 
        "react/jsx-indent-props": [2, 4], //验证JSX中的props缩进
        "react/jsx-wrap-multilines": 0, //将多行 JSX 标签写在 ()里
        "max-len": [1, 250, 2, { "ignoreComments": true }],//当单行代码长度大于200个字符时，检测会报错。
        "camelcase": 1,//强制使用骆驼拼写法命名约定
        "linebreak-style": 0, //强制使用一致的换行符风格
        "prefer-template": 0,//要求使用模板字面量而非字符串连接
        "no-unused-expressions": 0,//禁止出现未使用过的表达式
        "react/jsx-filename-extension": 0,//不允许在js文件中使用jsx语法
        "no-param-reassign": 0,//禁止对 function 的参数进行重新赋值
        "no-prototype-builtins": 0,//禁止直接调用 Object.prototypes 的内置属性
        "object-curly-newline": 0,//强制在花括号内使用一致的换行符
        //"react/sort-comp": [1, {order:['static-methods','state','everything-else','lifecycle','render',]}],//强制组件方法顺序
        "class-methods-use-this": 0,//强制类方法使用 this
        "array-callback-return": 0,//强制数组方法的回调函数中有 return 语句
        "no-underscore-dangle": 0,//禁止标识符中有悬空下划线
        "react/no-access-state-in-setstate": 1,//防止在this.setState中使用this.state
        "no-nested-ternary": 0,//禁用嵌套的三元表达式
        "jsx-quotes": 0, //强制在JSX属性（jsx-quotes）中一致使用 prefer-single单引号 prefer-double双引号
        "react/jsx-first-prop-new-line": 0, //jsx第一个属性换行
        "dot-notation": 0, //强制尽可能地使用点号"
        "react/jsx-max-props-per-line": [1, { "maximum": 10 }], // 限制JSX中单行上的props的最大数量
        "react/jsx-closing-bracket-location": 0, //在JSX中验证右括号位置
        "react/jsx-closing-tag-location": 0,// 强制开始标签闭合标签位置
        "react/no-multi-comp": 0, //防止每个文件有多个组件定义
        "no-console": 0,//禁用 console
        "semi": 0, //一行结尾强制使用 ;
        "eqeqeq": 0,//强制使用 ===
        "no-bitwise": 0,//禁用按位运算符
        "react/no-array-index-key": 0,//jsx标签的key不使用数组下标
        "import/no-extraneous-dependencies": 0,
        "react/no-unused-state": 0,
        "react/destructuring-assignment": 0,
        "react/no-did-update-set-state": 0,
        "react/prop-types": 0,
        "import/extensions": 0,
        "jsx-a11y/no-static-element-interactions": 0,
        "jsx-a11y/click-events-have-key-events": 0,
        "jsx-a11y/anchor-is-valid": 0,
        "react/jsx-one-expression-per-line": 0,

        "no-alert": 1,//禁用 alert、confirm 和 prompt
        "import/prefer-default-export": 0,
        "global-require": 0,
        "import/no-dynamic-require": 0,
        "object-shorthand": 0,
        "jsx-a11y/iframe-has-title": 0,
        "jsx-a11y/media-has-caption": 0,
        "import/no-cycle": 0,
        "no-new-func": 0,
        "no-continue": 0,
        "react/jsx-curly-brace-presence": 0,
    }
}
