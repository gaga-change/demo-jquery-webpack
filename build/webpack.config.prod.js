const baseWebpackConfig = require('./webpack.base.config.js');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path');
const webpack = require('webpack');
const merge = require("webpack-merge");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const AliyunossWebpackPlugin = require('aliyunoss-webpack-plugin')
const publicPath = '//sy-5173.oss-cn-hangzhou.aliyuncs.com/syapp/'
const ExtractTextPlugin = require("extract-text-webpack-plugin");

let config = {
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, '../dist/'),
        // filename: 'js/[name].js?v=[hash:6]',
        publicPath: publicPath,
        filename: `js/[name].js?v=[chunkhash]`,
    },
    module: {
        rules: [
            {//处理图片资源,样式
                test: /\.(png|svg|jpg|jpeg|gif)$/,//这里处理了以.png .svg .jpg .jpeg .gif为后缀名的图片
                use: [
                    {
                        loader: `file-loader?name=[path][name].[ext]&publicPath=${publicPath}`,
                    }//加载器file-loader和npm run build之后 图片的存储文件夹
                ],
                // publicPath: publicPath
            },
        ]
    },
    plugins: [//插件，具体的内容可以查看链接 -- https://doc.webpack-china.org/plugins/
        new webpack.DefinePlugin({
            'ENV_DEV': false
        }),
        new CleanWebpackPlugin([path.join(__dirname, '../dist')], { root: path.join(__dirname, '../') }),
        new webpack.optimize.CommonsChunkPlugin({ // 防止重复导入
            name: 'vendor' // 指定公共 bundle 的名称。
        }),
        new ExtractTextPlugin({
            filename: `css/[name].css?v=[contenthash]`,
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),
        new webpack.HashedModuleIdsPlugin(),
        new UglifyJSPlugin({ //压缩js代码，且删除未引用代码
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new OptimizeCssAssetsPlugin({ //对生产环境的css进行压缩
            cssProcessorOptions: {
                safe: true
            }
        }),

    ],
}

if (process.env.AccessKeySecret) {
    // 自动上传阿里云
    config.plugins.push(
        new AliyunossWebpackPlugin({
            buildPath: path.join(__dirname, '../dist/') + "**/*.!(html)",
            region: 'oss-cn-hangzhou',
            accessKeyId: 'LTAIMUoFaqb5v7dm',
            accessKeySecret: process.env.AccessKeySecret,
            bucket: 'sy-5173',
            deleteAll: true,
            generateObjectPath: function (filename, file) {
                file = file.substr(file.indexOf('dist') + 4)
                return 'syapp' + file
            },
            getObjectHeaders: function (filename) {
                return {
                    // Expires: 1
                }
            }
        })
    )
}
module.exports = merge(baseWebpackConfig, config)
