基于 React 的 framework 框架，它包含了 SSR、ISG、SSG 渲染等，非常简单方便，它抽象了自动配置工具，无绪关心工程化配置，专注于 coding 逻辑
npx create-next-app@latest [project]

Core API
静态路由
根据 pages 下的文件/文件夹自动配置路由
/index.tsx localhost:3000/
/about.tsx localhost:3000/about
/help localhost:3000/help
动态路由
比如 posts 文件夹下：
● [...params].tsx/ts
○ localhost:3000/posts/a，localhost:3000/posts/a/b，localhost:3000/posts/a/b/...
● [id].tsx/ts
○ localhost:3000/posts/1，localhost:3000/posts/[id]
● [[id]].tsx/ts 可有可无
○ localhost:3000/posts，localhost:3000/posts/[id]
● [id]/index.tsx 或者 [id]/page.tsx localhost:3000/posts/[id]

(auth) /login/index.tsx --> localhost:3000/login
生成无数据静态网页
next export
SSG(静态生成) / ISR(增量静态生成)
● 通过 getStaticPaths 和 getStatifcProps 这两个方法在服务端 build 时生成静态页面
// pages/posts/[id].tsx

// react 组件
const Page = ({ data }: any) => {
return (

<div>
{data}
</div>
);
};

export default Page;

/\***\*\*\*\*\*\*** 静态生成：SSG \***\*\*\*\***/
export async function getStaticProps(context: NextPageContext) {
const { id } = context.params;
const data = await fetch(`https://api/${id}/`).then(data => data.json());

    return {
    	props: { data },
    };

}

export async function getStaticPaths() {
return {
paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
fallback: false, // ‘blocking’ / true / false
// ‘blocking’ 按需生成
// false 没有静态页面，则 404
// true 自己返回 loading 等待静态生成
};
}
● getStaticPaths 通过配置，我们在 dev/build 时，预先生成相关的静态页面，这里生成如下：
○ localhost:3000/posts/1 和 localhost:3000/posts/2
○ fallback
■ false：localhost:3000/posts/3 --> 404
■ blocking: localhost:3000/posts/3 --> 访问时生成静态页面，用户等待静态页面生成完成时，才渲染页面（服务端压力增加，不要使用），
■ true：localhost:3000/posts/3 --> 访问时，用户端可以监控路由的 isFallback，先显示 loading 提示，待静态页面生成后，显示渲染的内容（服务端压力增加，不要使用）
●
○ 说白了，就是 blocking 和 true，是按需生成静态，当用户访问路由时，才会生成，这样效率和性能都不好，不要使用，
● ISR：增量静态色生成（不建议使用）
○ 自动触发：getStaticProps 设置 revalidata，比如设置为 10，表示当前页面在服务端的超时时间为 10s，当用户访问时，如果没超过 10s 中，则使用原来的生成静态页面，否则重新生成新的静态页面
■
○ 手动触发
■ 不建议使用

SSR
使用 getServerSideProps
// pages/posts/[id].tsx

// react 组件
const Page = ({ data }: any) => {
return (

<div>
{data}
</div>
);
};

// SSR，这里的代码在 server 端执行
export async function getServerSideProps(context: NextPageContext) {
const { id } = context.params;
const data = await fetch(`https://api/${id}/`).then(data => data.json());

    return {
    	props: { data },
    };

}
a component has only getServerSideProps or getStaticProps
不能同时存在一个组件中，说白了，要么是 SSG，要么是 SSR

Hit the road
FileSystem router

[id] 与 [..slug] all exist
会优先匹配 [id]
● http://localhost:3000/events/a -> [eventId]
● http://localhost:3000/events/a/b -> [...slug]
[...slug] 获取参数

Link 和手动设置路由

预渲染
why
● 传统 React： 应用返回的 HTML 文件中，不包含应用的信息，因为页面是在客户端进行渲染的，所以服务端返回的源码通常只有一个 id 为 root 的 div 标签，不利于做 SEO（搜索引擎优化）
● pre-rendering：浏览器收到的 HTML 文件源码是包含了页面信息的代码，Good for SEO

- pre-rendering will not execute useEffect in server
  SSG
  SSG 是静态站点生成，就是在文件打包阶段，预先生成页面
  ● Next.js 默认会预渲染所有没有动态数据的页面，而动态的数据还是像 React 一样在客户端渲染的
  ● 如果要在 HTML 源码中展现动态数据，可以使用 page 下 getStaticProps 方法。这个方法是跑在服务端环境下的，可以在服务端获取数据并渲染，并且客户端不会收到方法内任何的代码。此外，Next.js 拓展了一些功能，比如 fetch 是浏览器的接口，在服务端是不能用的，而在 getStaticProps 方法中是可以使用 fetch API 的 （通过 node-fetch 这个库实现的。（Node.js18.0.0 版本开始原生支持了 fetch 方法）
  getStaticProps

export type GetStaticPropsResult<P> =
| { props: P; revalidate?: number | boolean }
| { redirect: Redirect; revalidate?: number | boolean }
| { notFound: true; revalidate?: number | boolean }
● props 是服务端获取的需要传给组件的数据，revalidate 可以定义生产环境下 getStaticProps 调用的间隔秒数，600 就是 600 秒，10 分钟。测试环境下这个配置项无效，每次访问页面都会触发此方法。而后两种情况适用于获取数据失败时，引导用户进行下一步操作，重定向或直接返回 404 错误。此外如果需要在 getStaticProps 中访问路径参数，可以在方法的 context 参数的 params 属性获取
getStaticPaths
上面指的没有动态数据的页面，也不能是动态路由（文件名带[]的 js），否则也不会自动生成静态页面。如果需要生成静态页面，需要使用 getStaticPaths 方法。
● getStaticPaths 方法定义了一组需要生成静态页面的列表，每项数据都会调用 getStaticProps 来获取数据，所以要使用 getStaticPaths 一定先要有定义 getStaticProps
export async function getStaticPaths() {
return {
paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
fallback: false,
}
}
SSR
SSR 是服务端渲染，getServerSideProps 方法可以针对每次请求作出处理，适用于数据变化比较频繁的页面
● getStaticProps 与 getServerSideProps 只能二选一
● getServerSideProps 也是运行在服务器上的方法，这个方法的参数 context 可以完整获取请求的所有数据
● 没有 revalidate 属性，因为每次请求都会重新渲染
export type GetServerSidePropsContext<
Q extends ParsedUrlQuery = ParsedUrlQuery,
D extends PreviewData = PreviewData

> = ({
> req: IncomingMessage & {

    cookies: NextApiRequestCookies

}
res: ServerResponse
params?: Q
query: ParsedUrlQuery
preview?: boolean
previewData?: D
resolvedUrl: string
locale?: string
locales?: string[]
defaultLocale?: string
}) => GetServerSidePropsResult

export type GetServerSidePropsResult<P> =
| { props: P | Promise<P> }
| { redirect: Redirect }
| { notFound: true }

不适合预渲染的情况
以下三种情况不适合使用服务端预渲染：
● 数据变化非常频繁的页面（比如股票数据）
● 与用户身份高度耦合的页面（比如用户信息）
● 页面中只有某一小部分数据不同的情况

碰到这些情况，还是在客户端使用 useEffect 中 fetch 来获取数据，Next.js 团队也编写了一个 React 钩子库 SWR（https://swr.vercel.app/zh-CN） 来简化客户端请求
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

function Profile() {
const { data, error } = useSWR('/api/profile-data', fetcher)

if (error) return <div>Failed to load</div>
if (!data) return <div>Loading...</div>

return (

<div>
<h1>{data.name}</h1>
<p>{data.bio}</p>
</div>
)
}

SEC-Head+Meta
统一加上 Head 信息
● 所有页面都都会统一加上 head 信息

页面独立 Head
● 页面中加入的 Head 会 merge \_app 中的 head，做到个性化

多个 Head 会 merge

根据数据动态设置 Head

\_document.js
\_app.js 相当于 body 中的内容，\_document.js 相当于整个 HTML 文档
● \_app.js 会进入到 div#\_next 容器下（默认自动创建）
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
return (

<Html>
<Head />
<body>
<Main />
<NextScript />
</body>
</Html>
)
}

● MyDocument
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
render() {
return (

<Html lang='en'>
<Head />
<body>
<div id='overlays' />
<Main />
<NextScript />
</body>
</Html>
);
}
}

export default MyDocument;

图片优化
Next.js 提供了优化图片的方案——Image 组件，使用 Image 组件有四点好处：
● 优化图片大小：webp 格式
○ 对各个设备使用合适的尺寸与格式（使用 Chrome 访问页面时，图片会转换成 webp 格式）
● 防止 CLS（累计布局偏移）
● 懒加载：图片在视图中才会被加载
● 自定义图片尺寸，width、height
○ Next.js 会根据 Image 的 width 与 height 值，在页面请求服务端时，转换并缓存相应大小的图片
import Image from 'next/image'

export default function About(props) {
return <>
<Image
src={'/img.jpeg'}
alt="图片"
width={100}
height={100}
/>
<img
src={'/img.jpeg'}
alt="图片"
/>
</>
}

API 路由
/pages/api 文件下的 JS 文件不会导出页面组件，Next.js 会将这些文件映射成 /api/\* 的 API 端点，与文件路由创建一样，也支持动态路由
● Wonderful，next 会缓存 get 请求，自动开启 Etag，下次请求进行协商缓存 Etag，当服务端数据又变化，Etag 会变化 -> 200，没有变化 --> 304
export default function handler(req, res) {
if (req.method === 'POST') {
// 处理 POST 请求
} else {
// 处理其他 HTTP 方法请求
// res.status(200).json({ message: 'ok' });
}
}
● 类型
export declare type NextApiHandler<T = any> = (req: NextApiRequest, res: NextApiResponse<T>) => unknown | Promise<unknown>;

quest extends IncomingMessage {
/**
_ Object of `query` values from url
_/
query: Partial<{
[key: string]: string | string[];
}>;
/**
_ Object of `cookies` from header
_/
cookies: Partial<{
[key: string]: string;
}>;
body: any;
env: Env;
preview?: boolean;
/\*\*
_ Preview data set on the request, if any
_ \*/
previewData?: PreviewData;
}

export declare type NextApiResponse<T = any> = ServerResponse & {
/**
_ Send data `any` data in response
_/
send: Send<T>;
/**
_ Send data `json` data in response
_/
json: Send<T>;
status: (statusCode: number) => NextApiResponse<T>;
redirect(url: string): NextApiResponse<T>;
redirect(status: number, url: string): NextApiResponse<T>;
/**
_ Set preview data for Next.js' prerender mode
_/
setPreviewData: (data: object | string, options?: {
/**
_ Specifies the number (in seconds) for the preview session to last for.
_ The given number will be converted to an integer by rounding down.
_ By default, no maximum age is set and the preview session finishes
_ when the client shuts down (browser is closed).
_/
maxAge?: number;
/\*\*
_ Specifies the path for the preview session to work under. By default,
_ the path is considered the "default path", i.e., any pages under "/".
_/
path?: string;
}) => NextApiResponse<T>;
/\*\*
_ Clear preview data for Next.js' prerender mode
_/
clearPreviewData: (options?: {
path?: string;
}) => NextApiResponse<T>;
revalidate: (urlPath: string, opts?: {
unstable_onlyGenerated?: boolean;
}) => Promise<void>;
};

● API 路由映射
○ /pages/api/feedback/index.js <===> GET api/feedback
■ /pages/api/posts/[postId].js <===> GET api/posts/12345
○ /pages/api/feedback/index.js <===> POST api/feedback
// GET
function loadFeedbackHandler() {
fetch('/api/feedback')
.then(response => response.json())
.then(data => {
setFeedbackItems(data.data);
});
}

// POST
fetch('/api/feedback', {
method: 'POST',
body: JSON.stringify(reqBody),
headers: {
'Content-Type': 'application/json',
},
})
.then(response => response.json())
.then(data => console.log(data));

MongoDB

使用云 MongoDB
https://cloud.mongodb.com/
注册 --> 创建集群 Cluster

Database Access 创建数据库 user

Network Access
RESTFUL
● npm i -S mongodb
● 连接 URL
○ 'mongodb+srv://username:<password>@cluster0.jdiygge.mongodb.net/<db_name>?retryWrites=true&w=majority'
○ await MongoClient.connect(url) ==> promise

● db 工具
// /helpers/db-util
import { MongoClient, ObjectId } from 'mongodb';

export async function connectDatabase() {
const client = await MongoClient.connect(
'mongodb+srv://xfz:2MBYB09wuR3HQrnq@cluster0.jdiygge.mongodb.net/test?retryWrites=true&w=majority'
);

return client;
}

export async function insertDocument(client, collection, document) {
const db = client.db();

const result = await db.collection(collection).insertOne(document);

return result;
}

export async function getAllDocuments(client, collection, sort) {
const db = client.db();

const documents = await db.collection(collection).find().sort(sort).toArray();

return documents;
}

export async function getDocumentById(client, collection, id) {
const db = client.db();
const document = await db
.collection(collection)
.find({ \_id: new ObjectId(id) })
.toArray();

return document[0];
}

export async function deleteDocumentById(client, collection, id) {
const db = client.db();
const document = await db.collection(collection).deleteOne({ \_id: new ObjectId(id) });
const { deletedCount } = document;
return deletedCount > 0;
}

● API
○ /api/list GET & POST
○ /api/detail/[id] DELETE
// /api/list
import { connectDatabase, getAllDocuments, insertDocument } from '../../helpers/db-util';

export default async function handler(req, res) {
let client;

    try {
    	client = await connectDatabase();
    } catch (error) {
    	res.status(500).json({ message: 'Connecting to the database failed!' });
    	return;
    }

    if (req.method === 'GET') {
    	try {
    		// products - table
    		const documents = await getAllDocuments(client, 'products', { _id: -1 });
    		res.status(200).json({ data: documents });
    		console.log('查询所有数据', documents);
    	} catch (error) {
    		res.status(500).json({ message: 'Getting comments failed.' });
    	}
    } else {
    	const { text } = req.body;
    	if (!text || !text.trim()) {
    		res.status(422).json({ message: 'Invalid input.' });
    		client.close();
    		return;
    	}

    	const newProduct = { text };
    	try {
    		const result = await insertDocument(client, 'products', newProduct);
    		console.log('insert success:', result.insertedId);
    		res.status(201).json({ message: 'Added success.', data: { _id: result.insertedId, ...newProduct } });
    	} catch (error) {
    		res.status(500).json({ message: 'Inserting comment failed!' });
    	}
    }

    client.close();

}

// /api/detial/[id]
import { connectDatabase, getDocumentById, deleteDocumentById } from '../../../helpers/db-util';

export default async function handler(req, res) {
let client;

    try {
    	client = await connectDatabase();
    } catch (error) {
    	res.status(500).json({ message: 'Connecting to the database failed!' });
    	return;
    }

    if (req.method === 'DELETE') {
    	try {
    		const { id } = req.query;
    		console.log(`delete id: ${id}`);
    		const response = await getDocumentById(client, 'products', id);
    		if (!response) {
    			res.status(500).json({ message: 'there is no data by id', result: false });
    		} else {
    			const result = await deleteDocumentById(client, 'products', id);
    			if (result) {
    				res.status(200).json({ message: 'delete success', result: true });
    			} else {
    				res.status(500).json({ message: 'there is no data by id', result: false });
    			}
    		}
    	} catch (e) {
    		console.log(e);
    		res.status(500).json({ message: 'Delete failed!', result: false });
    	}
    }

    client.close();

}

● client code
// GET
try {
const res = await fetch('http://localhost:3000/api/list');
const resData = await res.json();
data = resData.data;
} catch (e) {
console.log(e);
}

// POST
try {
setLoading(true);
const result = await fetch('/api/list', {
method: 'POST',
body: JSON.stringify(data),
headers: {
'Content-Type': 'application/json',
},
});
const res = await result.json();
setList([...list, res.data]);
inputRef.current.value = '';
} catch (err) {
console.error(err);
} finally {
setLoading(false);
}

// DELETE
try {
const response = await fetch(`/api/detail/${id}`, {
method: 'DELETE',
});
const { result } = await response.json();
if (result) {
setList(prev => prev.filter(item => item.\_id !== id));
}
} catch (e) {
console.error(e);
}

部署
构建
构建 Next.js 应用有两种方式
● 标准构建：next build，前端+nodejs
○ 使用这种方式构建，我们会得到优化后的前端项目 + 一个 NodeJS 服务端程序。这个服务端程序提供了 API 路由、SSR 与页面重验证等功能。所以如果要部署这个应用，需要服务器有 NodeJS 环境
● 完全静态构建：next export，只有前端
○ 使用这种方式生成的代码，只会包含纯前端的内容，HTML、CSS、JS 以及静态资源。没有 NodeJS 服务端程序，所以部署可以不需要 NodeJS 环境。当然这样的话，API 路由、SSR 等 Next.js 提供的特性就不能使用了
配置
next.config.js
/\*_ @type {import('next').NextConfig} _/
const nextConfig = {
reactStrictMode: true,
}

module.exports = nextConfig
这个文件中的代码也是服务端代码，在构建过程中以及构建生成的 NodeJS 服务端程序中会使用到。此外这个文件不会被 Webpack, Babel 或 TypeScript 处理，所以确保使用与机器 NodeJS 版本相匹配的语法

完整的配置项接口如下，不过一般还是看官方文档（https://nextjs.org/docs/api-reference/next.config.js/introduction）根据具体需求来配置
export interface NextConfig extends Record<string, any> {
exportPathMap?: (defaultMap: ExportPathMap, ctx: {
dev: boolean;
dir: string;
outDir: string | null;
distDir: string;
buildId: string;
}) => Promise<ExportPathMap> | ExportPathMap;
/**
_ Internationalization configuration
_
_ @see [Internationalization docs](https://nextjs.org/docs/advanced-features/i18n-routing)
_/
i18n?: I18NConfig | null;
/**
_ @since version 11
_ @see [ESLint configuration](https://nextjs.org/docs/basic-features/eslint)
_/
eslint?: ESLintConfig;
/\*\*
_ @see [Next.js TypeScript documentation](https://nextjs.org/docs/basic-features/typescript)
_/
typescript?: TypeScriptConfig;
/\*\*
_ Headers allow you to set custom HTTP headers for an incoming request path. \*
_ @see [Headers configuration documentation](https://nextjs.org/docs/api-reference/next.config.js/headers)
_/
headers?: () => Promise<Header[]>;
/**
_ Rewrites allow you to map an incoming request path to a different destination path.
_
_ @see [Rewrites configuration documentation](https://nextjs.org/docs/api-reference/next.config.js/rewrites)
_/
rewrites?: () => Promise<Rewrite[] | {
beforeFiles: Rewrite[];
afterFiles: Rewrite[];
fallback: Rewrite[];
}>;
/**
_ Redirects allow you to redirect an incoming request path to a different destination path.
_
_ @see [Redirects configuration documentation](https://nextjs.org/docs/api-reference/next.config.js/redirects)
_/
redirects?: () => Promise<Redirect[]>;
/**
_ @see [Moment.js locales excluded by default](https://nextjs.org/docs/upgrading#momentjs-locales-excluded-by-default)
_/
excludeDefaultMomentLocales?: boolean;
/**
_ Before continuing to add custom webpack configuration to your application make sure Next.js doesn't already support your use-case
_
_ @see [Custom Webpack Config documentation](https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config)
_/
webpack?: NextJsWebpackConfig | null;
/**
_ By default Next.js will redirect urls with trailing slashes to their counterpart without a trailing slash.
_
_ @default false
_ @see [Trailing Slash Configuration](https://nextjs.org/docs/api-reference/next.config.js/trailing-slash)
\*/
trailingSlash?: boolean;
/**
_ Next.js comes with built-in support for environment variables
_
_ @see [Environment Variables documentation](https://nextjs.org/docs/api-reference/next.config.js/environment-variables)
_/
env?: Record<string, string>;
/**
_ Destination directory (defaults to `.next`)
_/
distDir?: string;
/**
_ The build output directory (defaults to `.next`) is now cleared by default except for the Next.js caches.
_/
cleanDistDir?: boolean;
/**
_ To set up a CDN, you can set up an asset prefix and configure your CDN's origin to resolve to the domain that Next.js is hosted on.
_
_ @see [CDN Support with Asset Prefix](https://nextjs.org/docs/api-reference/next.config.js/cdn-support-with-asset-prefix)
_/
assetPrefix?: string;
/**
_ By default, `Next` will serve each file in the `pages` folder under a pathname matching the filename.
_ To disable this behavior and prevent routing based set this to `true`. \*
_ @default true
_ @see [Disabling file-system routing](https://nextjs.org/docs/advanced-features/custom-server#disabling-file-system-routing)
_/
useFileSystemPublicRoutes?: boolean;
/\*\*
_ @see [Configuring the build ID](https://nextjs.org/docs/api-reference/next.config.js/configuring-the-build-id)
_/
generateBuildId?: () => string | null | Promise<string | null>;
/\*\* @see [Disabling ETag Configuration](https://nextjs.org/docs/api-reference/next.config.js/disabling-etag-generation) _/
generateEtags?: boolean;
/** @see [Including non-page files in the pages directory](https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions) \*/
pageExtensions?: string[];
/** @see [Compression documentation](https://nextjs.org/docs/api-reference/next.config.js/compression) _/
compress?: boolean;
/\*\*
_ The field should only be used when a Next.js project is not hosted on Vercel while using Vercel Analytics.
_ Vercel provides zero-configuration analytics for Next.js projects hosted on Vercel.
_
_ @default ''
_ @see [Next.js Analytics](https://nextjs.org/analytics)
_/
analyticsId?: string;
/\*\* @see [Disabling x-powered-by](https://nextjs.org/docs/api-reference/next.config.js/disabling-x-powered-by) _/
poweredByHeader?: boolean;
/** @see [Using the Image Component](https://nextjs.org/docs/basic-features/image-optimization#using-the-image-component) \*/
images?: ImageConfig;
/** Configure indicators in development environment _/
devIndicators?: {
/\*\* Show "building..."" indicator in development _/
buildActivity?: boolean;
/** Position of "building..." indicator in browser \*/
buildActivityPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
};
/**
_ Next.js exposes some options that give you some control over how the server will dispose or keep in memory built pages in development.
_
_ @see [Configuring `onDemandEntries`](https://nextjs.org/docs/api-reference/next.config.js/configuring-onDemandEntries)
_/
onDemandEntries?: {
/** period (in ms) where the server will keep pages in the buffer \*/
maxInactiveAge?: number;
/** number of pages that should be kept simultaneously without being disposed _/
pagesBufferLength?: number;
};
/\*\* @see [`next/amp`](https://nextjs.org/docs/api-reference/next/amp) _/
amp?: {
canonicalBase?: string;
};
/**
_ Deploy a Next.js application under a sub-path of a domain
_
_ @see [Base path configuration](https://nextjs.org/docs/api-reference/next.config.js/basepath)
_/
basePath?: string;
/** @see [Customizing sass options](https://nextjs.org/docs/basic-features/built-in-css-support#customizing-sass-options) _/
sassOptions?: {
[key: string]: any;
};
/\*\*
_ Enable browser source map generation during the production build \*
_ @see [Source Maps](https://nextjs.org/docs/advanced-features/source-maps)
_/
productionBrowserSourceMaps?: boolean;
/**
_ By default, Next.js will automatically inline font CSS at build time
_
_ @default true
_ @since version 10.2
_ @see [Font Optimization](https://nextjs.org/docs/basic-features/font-optimization)
_/
optimizeFonts?: boolean;
/**
_ The Next.js runtime is Strict Mode-compliant.
_
_ @see [React Strict Mode](https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode)
_/
reactStrictMode?: boolean | null;
/**
_ Add public (in browser) runtime configuration to your app
_
_ @see [Runtime configuration](https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration)
_/
publicRuntimeConfig?: {
[key: string]: any;
};
/**
_ Add server runtime configuration to your app
_
_ @see [Runtime configuration](https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration)
_/
serverRuntimeConfig?: {
[key: string]: any;
};
/**
_ Next.js automatically polyfills node-fetch and enables HTTP Keep-Alive by default.
_ You may want to disable HTTP Keep-Alive for certain `fetch()` calls or globally. \*
_ @see [Disabling HTTP Keep-Alive](https://nextjs.org/docs/api-reference/next.config.js/disabling-http-keep-alive)
_/
httpAgentOptions?: {
keepAlive?: boolean;
};
/**
_ During a build, Next.js will automatically trace each page and its dependencies to determine all of the files
_ that are needed for deploying a production version of your application. \*
_ @see [Output File Tracing](https://nextjs.org/docs/advanced-features/output-file-tracing)
_/
outputFileTracing?: boolean;
/**
_ Timeout after waiting to generate static pages in seconds
_
_ @default 60
_/
staticPageGenerationTimeout?: number;
/**
_ Add `"crossorigin"` attribute to generated `<script>` elements generated by `<Head />` or `<NextScript />` components
_ \*
_ @see [`crossorigin` attribute documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)
_/
crossOrigin?: false | 'anonymous' | 'use-credentials';
/**
_ Use [SWC compiler](https://swc.rs) to minify the generated JavaScript
_
_ @see [SWC Minification](https://nextjs.org/docs/advanced-features/compiler#minification)
_/
swcMinify?: boolean;
/**
_ Optionally enable compiler transforms
_
_ @see [Supported Compiler Options](https://nextjs.org/docs/advanced-features/compiler#supported-features)
_/
compiler?: {
reactRemoveProperties?: boolean | {
properties?: string[];
};
relay?: {
src: string;
artifactDirectory?: string;
language?: 'typescript' | 'javascript' | 'flow';
};
removeConsole?: boolean | {
exclude?: string[];
};
styledComponents?: boolean | {
/**
_ Enabled by default in development, disabled in production to reduce file size,
_ setting this will override the default for all environments.
\*/
displayName?: boolean;
topLevelImportPaths?: string[];
ssr?: boolean;
fileName?: boolean;
meaninglessFileNames?: string[];
minify?: boolean;
transpileTemplateLiterals?: boolean;
namespace?: string;
pure?: boolean;
cssProp?: boolean;
};
emotion?: boolean | {
sourceMap?: boolean;
autoLabel?: 'dev-only' | 'always' | 'never';
labelFormat?: string;
importMap?: {
[importName: string]: {
[exportName: string]: {
canonicalImport?: [string, string];
styledBaseImport?: [string, string];
};
};
};
};
};
output?: 'standalone';
transpilePackages?: string[];
skipMiddlewareUrlNormalize?: boolean;
skipTrailingSlashRedirect?: boolean;
modularizeImports?: Record<string, {
transform: string;
preventFullImport?: boolean;
skipDefaultConversion?: boolean;
}>;
/**
_ Enable experimental features. Note that all experimental features are subject to breaking changes in the future.
_/
experimental?: ExperimentalConfig;
}

这个文件还可以通过函数来根据不同环境返回不同的配置参数
module.exports = async (phase, { defaultConfig }) => {
/\*\*

- @type {import('next').NextConfig}
  _/
  const nextConfig = {
  /_ 配置 \*/
  }
  return nextConfig
  }

phase 参数会根据不同的 next 命令来传入不同的值
export declare const PHASE_EXPORT = "phase-export";
export declare const PHASE_PRODUCTION_BUILD = "phase-production-build";
export declare const PHASE_PRODUCTION_SERVER = "phase-production-server";
export declare const PHASE_DEVELOPMENT_SERVER = "phase-development-server";
export declare const PHASE_TEST = "phase-test";

通过 next/constants 模块引入常量
const { PHASE_PRODUCTION_BUILD } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
if (phase === PHASE*PRODUCTION_BUILD) {
return {
/* 生产构建配置 \_/
}
}

return {
/_ 其他情况配置 _/
}
}

部署
● vercel
● cloudflare

Authenication
● Signup & Login
● Controlling Page Access
session vs token

Type session token（例如 JWT）
存储方式 当用户登录时，服务器会创建一个 session，并为其生成一个唯一的 session ID。
这个 session ID 会被存储在客户端的 cookie 中。
服务器通常在后端存储 session 数据，例如在内存、数据库或其他存储系统中 当用户登录时，服务器会生成一个 token。
这个 token 包含了一些用户的数据，以及签名来确保其完整性。
客户端会存储这个 token，例如在 cookie、localStorage 或其他地方。
当客户端进行请求时，它会将 token 发送到服务器，服务器会验证 token 的有效性
状态 通常是有状态的。意味着服务器需要存储关于每个 session 的信息 通常是无状态的。服务器不需要存储 token 的信息，因为每次请求都会带有 token，服务器只需验证其有效性
跨域 Cookies 在默认情况下不支持跨域 可以轻松地在不同的域之间传输，因为它们只是一个字符串
过期方式 可以设置 session 的过期时间，在此时间后，session 就会失效 可以在生成 token 时设置过期时间，也可以为 token 设置刷新策略
安全性 由于 session ID 通常存储在 cookie 中，它可能容易受到 CSRF（跨站请求伪造）攻击 如果存储在 HTTP-only 的 cookie 中，可以减少 XSS（跨站脚本）攻击的风险，但如果不当地使用，可能会暴露于其他攻击。
可扩展性 对于大型应用，管理服务器上的 session 可能会变得复杂，尤其是在负载均衡环境中 由于是无状态的，因此很容易扩展，适用于大型、分布式应用
使用场景 适合传统的、单一的 web 应用 适合 SPA（单页应用）、移动应用、API 服务和跨域场景
JSON Web Tokens
token 是一个随机字符串，这个令牌数据由单部分组成：
● Isuuer Data:: 发行人数据
● Custom Data：自定义数据，如用户信息
● Secret Signing Key：密钥（存储在服务端，客户端永远看不到）

start now
鉴权
npm i -S next-auth
在 API 路由中，创建特殊文件 /api/auth/[...nextauth].js，在文件内引入 next-auth 包并实现相关逻辑
/\*\*

- Authentication
- used for login
- http://localhost:3000/api/auth/callback/credentials?
- arter login, cookie has next-auth.session-token. this is session-token
  \*/
  import NextAuth from 'next-auth';
  import CredentialsProvider from 'next-auth/providers/credentials';
  import { verifyPassword } from '@/lib/auth';
  import { connectToDatabase } from '@/lib/db';

export const authOptions = {
providers: [
CredentialsProvider({
name: 'Credentials',
session: {
strategy: 'jwt',
},
// verify logic
async authorize(credentials, req) {
const client = await connectToDatabase();
const usersCollection = client.db().collection('users');
const user = await usersCollection.findOne({
email: credentials.email,
});

    			if (!user) {
    				client.close();
    				throw new Error('No user found!');
    			}

    			const isValid = await verifyPassword(credentials.password, user.password);

    			if (!isValid) {
    				client.close();
    				throw new Error('Could not log you in!');
    			}

    			client.close();

    			return { email: user.email };
    		},
    	}),
    	// ...other providers
    ],
    // callbacks: {
    // 	async session({ session, token, user }) {
    // 		return session;
    // 	},
    // },

};

export default NextAuth(authOptions);
● 登录： 使用 signIn， 会访问 http://localhost:3000/api/auth/callback/credentials?
import { signIn } from 'next-auth/react';

       try {
    			const result = await signIn('credentials', {
    				redirect: false,
    				email: enteredEmail,
    				password: enteredPassword,
    			});

    			if (!result.ok || result.error) {
    				throw new Error(result.error);
    			}
    			// set some auth state
    			router.replace('/profile');
    		} catch (e) {
    			console.error(e);
    		} finally {
    			、
    		}

● 退出：signOut，会访问 http://localhost:3000/api/auth/signout
import { signOut } from 'next-auth/react';
const logoutHandler = () => signOut();
● \_app.js 中，使用 provider 来包裹，以便在前端使用 useSession
import { SessionProvider } from 'next-auth/react';

import Layout from '@/components/layout/layout';
import '@/styles/globals.css';

function MyApp({ Component, pageProps: { session, ...rest } }) {
return (
<SessionProvider session={session}>
<Layout>
<Component {...rest} />
</Layout>
</SessionProvider>
);
}

export default MyApp;
● 客户端使用 useSession 或 getSession (async)
import { useSession, getSession } from 'next-auth/react';

export default function xxxx(props) {
const { data: session, status } = useSession()

    console.log('session ', session)
    console.log('status ', status) // loading | authenticated | unauthenticated

    // 异步请求方式
    getSession().then(session => {
    	  console.log('-----', session);
    	  // ...
      });

    return <>
        <ul>
    				{status !== 'authenticated' && (
    					<li>
    						<Link href="/auth">Login</Link>
    					</li>
    				)}
    				{status === 'authenticated' && (
    					<>
    						<li>
    							<Link href="/profile">Profile</Link>
    						</li>
    						<li>
    							<button onClick={logoutHandler}>Logout</button>
    						</li>
    					</>
    				)}
    			</ul>
    </>

}

● 加密：比如：bcryptjs
import { hash, compare } from 'bcryptjs'

// 通过 hash 函数加密明文密码
const hashedPwd = await hash(pwd, 12)

// 通过 compare 函数比较两个密码是否相同，返回布尔值
const isValid = await compare(newPwd, hashedPwd)
● serverSideProps
import { getSession } from 'next-auth/react';

export async function getServerSideProps(context) {
const session = await getSession({ req: context.req });

    if (!session) {
    	return {
    		redirect: {
    			destination: '/auth',
    			permanent: false, // 永久重定向
    		},
    	};
    }

    return {
    	props: { session },
    };

}
路由守卫
我们不但要对页面的访问权限进行校验，同时需要对接口访问进行校验 session 或 token
这时获取 session，就不能用客户端的 getSession 了，需要使用 getServerSession
// /api/update

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async handler(req, res) {
const session = await getServerSession(req, res, authOptions);
if (!session) {
res.status(401).json({ message: 'Not authenticated!' });
return;
}

// ....
}
