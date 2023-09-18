import axios, { AxiosInstance, AxiosResponse } from "axios";
import addOAuthInterceptor, { OAuthInterceptorConfig } from "axios-oauth-1.0a";

export interface Method {
  [key: string]: string;
}

export const Get: Method = {
  blogInfo: '/v2/blog/:blogIdentifier/info',
  blogAvatar: '/v2/blog/:blogIdentifier/avatar/',
  blogLikes: '/v2/blog/:blogIdentifier/likes',
  blogFollowers: '/v2/blog/:blogIdentifier/followers',
  blogPosts: '/v2/blog/:blogIdentifier/posts/:type',
  blogQueue: '/v2/blog/:blogIdentifier/posts/queue',
  blogDrafts: '/v2/blog/:blogIdentifier/posts/draft',
  blogSubmissions: '/v2/blog/:blogIdentifier/posts/submission',
  userInfo: '/v2/user/info',
  userDashboard: '/v2/user/dashboard',
  userFollowing: '/v2/user/following',
  userLikes: '/v2/user/likes',
  taggedPosts: '/v2/tagged',
}

export const Post: Method = {
  createPost: '/v2/blog/:blogIdentifier/post',
  editPost: '/v2/blog/:blogIdentifier/post/edit',
  reblogPost: '/v2/blog/:blogIdentifier/post/reblog',
  deletePost: '/v2/blog/:blogIdentifier/post/delete',
  followBlog: '/v2/user/follow',
  unfollowBlog: '/v2/user/unfollow',
  likePost: '/v2/user/like',
  unlikePost: '/v2/user/unlike',
}

export interface Methods {
  [key: string]: Method;
}

export const ApiMethods: Methods = {
  'GET': Get,
  'POST': Post
}

export interface OAuthCredentials {
  consumerKey: string,
  consumerSecret: string,
  token: string,
  tokenSecret: string
}

export interface TumblrClientOptions {
  credentials?: OAuthCredentials,
  blogIdentifier?: string,
  baseURL?: string,
}

export enum BlogPostTypes {
  Text = "text",
  Quote = "quote",
  Link = "link",
  Answer = "answer",
  Video = "video",
  Audio = "audio",
  Photo = "photo",
  Chat = "chat"
}

export interface LegacyPostFields {
  type: BlogPostTypes,
  state?: "published" | "draft" | "queue" | "private",
  tags?: string,
  tweet?: string,
  date?: string
  format?: 'html' | 'markdown',
  slug?: string,
  native_inline_images?: boolean
}

export interface TextPost {
  title?: string,
  body: string
}

export type LegacyTextPost = LegacyPostFields & TextPost;

const CLIENT_VERSION: string = '0.0.1';
const API_BASE_URL: string = 'https://api.tumblr.com'; // deliberately no trailing slash

export class TumblrClient {
  private readonly blogIdentifier: string = '';
  private readonly baseURL: string = API_BASE_URL;
  private readonly credentials: OAuthCredentials | undefined = undefined;
  private readonly key: string = '';
  private readonly client: AxiosInstance;

  constructor(options?: TumblrClientOptions) {
    if (options?.baseURL) {
      this.baseURL = options.baseURL;
    }

    if (options?.blogIdentifier) {
      this.blogIdentifier = options.blogIdentifier;
    }

    let oauth_options: OAuthInterceptorConfig | undefined;
    if (options?.credentials) {
      this.credentials = options.credentials;
      this.key = this.credentials.consumerKey;

      oauth_options = {
        algorithm: 'HMAC-SHA1',
        includeBodyHash: 'auto',
        key: this.credentials?.consumerKey,
        secret: this.credentials?.consumerSecret,
        token: this.credentials?.token,
        tokenSecret: this.credentials?.tokenSecret,
        callback: '',
        verifier: '',
      }
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      maxRedirects: 0,
      timeout: 1000,
      headers: {
        'User-Agent': 'tumblr.ts/' + CLIENT_VERSION,
      }
    });

    if (oauth_options) {
      addOAuthInterceptor(this.client, oauth_options);
    }

    for (const key in ApiMethods) {
      const method: Method = ApiMethods[key];
      for (const path in method) {
        method[path] = method[path].replace(':blogIdentifier', this.blogIdentifier);
      }
    }
  }

  public async makePostRequest(apiPath: string, data: any) {
    return this.client.post(apiPath, JSON.stringify(data), { 
      headers: {'Content-Type': 'application/json'}
    });
  }

  public async makeGetRequest(apiPath: string, params?: object) {
    return this.client.get(apiPath, { params });
  }

  public async getBlogInfo(): Promise<AxiosResponse> {
    return this.makeGetRequest(Get.blogInfo, { api_key: this.key })
  }

  public async getBlogAvatar(params: object, avatarSize: number): Promise<AxiosResponse> {
    const apiPath: string = Get.blogAvatar + (!!avatarSize ? `/${avatarSize}` : ``);
    return this.makeGetRequest(apiPath, params);
  }

  public async getBlogLikes(): Promise<AxiosResponse> {
    return this.makeGetRequest(Get.blogLikes, { params: { api_key: this.key } });
  }

  public async getBlogFollowers(): Promise<AxiosResponse> {
    return this.makeGetRequest(Get.blogFollowers);
  }

  public async getBlogPosts(postType: BlogPostTypes): Promise<AxiosResponse> {
    return this.makeGetRequest(Get.blogPosts + `${postType}`);
  }

  public async createTextPost(textPost: TextPost): Promise<AxiosResponse> {
    return this.makePostRequest(Post.createPost, textPost);
  }
}
