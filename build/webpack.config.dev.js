const baseWebpackConfig = require('./webpack.base.config.js');

const path = require('path');
const webpack = require('webpack');
const merge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = merge(baseWebpackConfig, {
    devtool: '#eval-source-map',
    output: {
        path: path.join(__dirname, '../dist/'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {//处理图片资源,样式
                test: /\.(png|svg|jpg|jpeg|gif)$/,//这里处理了以.png .svg .jpg .jpeg .gif为后缀名的图片
                use: [
                    {
                        loader: `file-loader?name=[path][name].[ext]`,
                    }//加载器file-loader和npm run build之后 图片的存储文件夹
                ],
            },
        ]
    },
    devServer: {//通过来自「webpack-dev-server」的这些选项，能够通过多种方式改变其行为。
        port: 9000,//指定监听的端口号
        contentBase: path.join(__dirname, 'dist'),// 告诉服务器从哪来提供内容。只有在你想要提供静态文件时才需要。
        publicPath: '/',//用于确定从哪里提供bundle，并且此选项优先
        compress: true,//一切服务都启用「gzip」压缩
        host: 'gaga.5173.com',
        proxy: [
            {
                context: ['/api', '/m-base-frontend', '/sy-game-service'],
                target: 'https://m.5173.com',
                changeOrigin: true,
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'ENV_DEV': true
        }),
        new ExtractTextPlugin({
            filename: `css/[name].css?v=[hash:6]`,
            allChunks: true
        })
        // new webpack.ProvidePlugin({
        //     $: "jquery",//jquery
        //     jQuery: "jquery",
        //     "window.jQuery": "jquery",
        // })
    ]
})

