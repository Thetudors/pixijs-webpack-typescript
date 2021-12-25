const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';


module.exports = {
    mode: isDev ? 'development' : 'production',
    entry:'./src/index.ts',
    module:{
        rules:[
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include:[path.resolve(__dirname,'src')]
            }
        ]
    },
    output:{
        filename:'bundle.js',
        path: path.resolve(__dirname, 'public')
    }

}