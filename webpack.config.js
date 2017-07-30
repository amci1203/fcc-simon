module.exports = {
    entry: {
        app    : './app/assets/app.js',
    },
    output: {
        path     : './app',
        filename : '[name].js',
    },
    module: {
        loaders: [
            {
                loader  : 'babel',
                query   : { presets: ['es2015'] },
                test    : /\.js$/,
                exclude : /node_modules/
            }
        ]
    }
}
