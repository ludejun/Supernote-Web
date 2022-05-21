## PC端React脚手架项目

使用技术栈：
React + Redux + React-Router + Rematch + webpack + typescript + mock + eslint + prettier + fetch

在文件夹src/components/RichTextEditor和项目根目录之间建立有富文本编辑器和react的npm link，link跟文件和项目名强绑定，如需变更名字报错，请检查npm link设置。参考：https://juejin.cn/post/6862494892569051143#heading-7

link 步骤补充 TODO

src/components/RichTextEditor作为quill-react-commercial npm仓库的源，当需要修改或调试富文本编辑器时，可以修改RichTextEditor中的webpack.config.js中的webpack配置mode改为development，即可以在chrome中调试富文本编辑器的源码。或者在项目中直接引用相对源码路径也可以调试：
```js
import RichTextEditor from '../../components/RichTextEditor/index';
// import RichTextEditor from '../../components/RichTextEditor/dist/quill-react-commercial.min';
import RichTextEditor from 'quill-react-commercial';
```
！！！改动src/components/RichTextEditor的代码之后，需要在其根目录跑yarn build来打包npm代码给主项目使用，并且修改主项目package.json中quill-react-commercial的版本号

#### 项目命令行

- 安装项目：`yarn install`

- 启动开发环境：`yarn start`

- 启动开发环境并查看包体积分布：`yarn start:size`

- 生产打包：`yarn build`

  打包内容在release文件夹中




