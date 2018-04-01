const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
function resolve(dir) {//因为自己改变了文件的路径，这里需要重新处理一下
    return path.join(__dirname, '..', dir);
}

module.exports = {
    context: path.resolve(__dirname, "../src"),
    entry: {//string|object|array,起点或者是应用程序的起点入口。从这个起点开始，应用程序启动执行。如果传递一个数组，那么数组的每一项都会执行
        goodsList: './js/goods_list/index.js',
        goodsDetail: './js/goods_detail/index.js',
        goodsBuy: './js/goods_buy/index.js',
        about: './js/about.js',
        vendor: [
            'jquery'
        ]
    },
    module: { //处理项目中的不同的模块
        rules: [//格式array,创建模块时，匹配请求的规则数组。这些规则能够对修改模块的创建方式。
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            minimize: true || {/* CSSNano Options */ }
                        }
                    }, 'autoprefixer-loader'],
                    publicPath: '../'
                    //生产环境下（也就是npm run build之后）重写资源的引入的路径,参考链接https://webpack.js.org/plugins/extract-text-webpack-plugin/#-extract
                })
            },
            // {//处理css的规则,处理less的规则
            //     test: /\.less$/,
            //     use: ExtractTextPlugin.extract({
            //         fallback: 'style-loader',
            //         use: ['css-loader', 'autoprefixer-loader', 'less-loader'],
            //         publicPath: publicPath
            //     })
            // },
            // {//处理图片资源,样式
            //     test: /\.(png|svg|jpg|jpeg|gif)$/,//这里处理了以.png .svg .jpg .jpeg .gif为后缀名的图片
            //     use: [
            //         {
            //             loader: `file-loader?name=[path][name].[ext]?v=[hash:6]`,
            //         }//加载器file-loader和npm run build之后 图片的存储文件夹
            //     ],
            //     // publicPath: publicPath
            // },
            {//处理html，插入在html中的图片img用此处理
                test: /\.html$/,
                use: [
                    { loader: 'html-loader' }
                ]
            },
            // {//处理字体
            //     test: /\.(woff|woff2|eot|ttf|otf)$/,
            //     use: [
            //         // 'file-loader'//等同于{loader:'file-loader'}
            //         { loader: 'file-loader?limit=1024&name=fonts/[name].[ext]' }//加载器file-loader和npm run build之后字体的存储文件夹
            //     ]
            // },
            {//处理handlebar
                test: /\.handlebars$/,
                use: [
                    { loader: "handlebars-loader" }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json'], // 后缀名自动补全
        alias: {
            'src': path.resolve(__dirname, "../src"),
        }
    },
    plugins: [
        new HtmlWebpackPlugin({//简化了html文件的创建，以便为webpack包提供服务。
            filename: resolve('/dist/index.html'),//处理dirname路径的问题 ，这里等同于'../dist/index.html'
            template: './index.html',
            chunks: [],
        }),
        new HtmlWebpackPlugin({//简化了html文件的创建，以便为webpack包提供服务。
            filename: resolve('/dist/goods_list.html'),//处理dirname路径的问题 ，这里等同于'../dist/index.html'
            template: './goods_list.html',
            chunks: ['manifest', 'vendor', 'goodsList']//选择加载的css和js,模块名对应上面entry接口的名称
        }),
        new HtmlWebpackPlugin({//简化了html文件的创建，以便为webpack包提供服务。
            filename: resolve('/dist/goods_detail.html'),
            template: './goods_detail.html',
            chunks: ['manifest', 'vendor', 'goodsDetail'] //选择加载的css和js,模块名对应上面entry接口的名称
        }),
        new HtmlWebpackPlugin({//简化了html文件的创建，以便为webpack包提供服务。
            filename: resolve('/dist/goods_buy.html'),
            template: './goods_buy.html',
            chunks: ['manifest', 'vendor', 'goodsBuy'] //选择加载的css和js,模块名对应上面entry接口的名称
        }),
        new HtmlWebpackPlugin({
            filename: resolve('/dist/about.html'),
            template: './about.html',
            chunks: ['about', 'manifest', 'vendor']
        })
    ]
}
