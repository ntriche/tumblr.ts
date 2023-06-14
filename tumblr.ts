import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export interface OAuthCredentials {
    consumerKey: string,
    consumerSecret: string,
    token: string,
    tokenSecret: string,
}

export interface TumblrClientOptions {
    credentials?: OAuthCredentials,
    baseURL?: string,
    returnPromises?: boolean,
}

const CLIENT_VERSION: string = '0.0.1';
const API_BASE_URL: string = 'https://api.tumblr.com'; // deliberately no trailing slash

export class TumblrClient {
    private readonly blogIdentifier: string;
    private readonly baseURL: string = API_BASE_URL;
    private readonly returnPromises: boolean = true;
    private readonly credentials: OAuthCredentials | undefined = undefined;
    private readonly key: string = '';

    private readonly instance: AxiosInstance;

    constructor(blogIdentifier: string, options?: TumblrClientOptions) {
        this.blogIdentifier = blogIdentifier;
        if (options) {
            if (options.baseURL) { 
                this.baseURL = options.baseURL; 
            }
            if (options.credentials) { 
                this.credentials = options.credentials;
                this.key = this.credentials.consumerKey;
            }
            if (options.returnPromises) {
                this.returnPromises = options.returnPromises;
            }
        }

        this.instance = axios.create({
            baseURL: this.baseURL,
            maxRedirects: 0,
            timeout: 1000,
            headers: {
                'User-Agent': 'tumblr.ts/' + CLIENT_VERSION,
            }
        });
    }

    public async makePostRequest(apiPath: string, data: AxiosRequestConfig, config?: AxiosRequestConfig, callback?: Function) {
        return this.instance.post(apiPath, data, config);
    }

    public async makeGetRequest(apiPath: string, config?: AxiosRequestConfig, callback?: Function) {
        return this.instance.get(apiPath, config);
    }

    public async getBlogInfo(): Promise<AxiosResponse> {
        return this.instance.get(`/v2/blog/${this.blogIdentifier}/info`, {params: {api_key: this.key}})
    }
}