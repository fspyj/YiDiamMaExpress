const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
    if (key === './routes.js') return
    modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

modules.export= modules
