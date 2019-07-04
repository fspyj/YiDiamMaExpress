module.exports = {
    mode:'debug',
    debug:{//开发环境配置
        sql: {
            host: '127.0.0.1',
            user: 'root',
            password: 'fengsheng',
            database: 'yidianma'
        },
        mongodb:'mongodb://127.0.0.1:27017/Express',
        jwtsecret: 'myjwttest'
    },
    release:{//生产环境配置
        sql: {
            host: '127.0.0.1',
            user: 'root',
            password: 'fengsheng',
            database: 'yidianma'
        },
        mongodb:'mongodb://localhost:3000/test',
        jwtsecret: 'myjwttest'
    }
};
