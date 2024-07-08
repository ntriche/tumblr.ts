# hfht's Tumblr API Client #

A Tumblr API Client written in TypeScript meant as a more up-to-date alternative to Tumblr's own API client library, [tumblr.js](https://github.com/tumblr/tumblr.js/). The creation of this library was motivated by issues I had with tumblr.js, particularly how the use of promises rather than callbacks feels like an afterthought. 

## Getting Starting ##

import { TumblrClient } from "tumblr.ts"

According to the Tumblr API documentation (https://www.tumblr.com/docs/en/api/v2), there is only a (single endpoint)[https://www.tumblr.com/docs/en/api/v2#avatar--retrieve-a-blog-avatar] that doesn't require any form of authorization. For this reason, creating a TumblrClient object doesn't require any credentials. In practice, you're better off supplying at least your API key, a.k.a. consumer key. To create text posts and anything of that nature, you'll need to supply all of the credentials necessary for OAuth1 authorization. 

## Getting OAuth1 Credentials for your Tumblr Bot ##

If you have already done this or have successfully used the Tumblr API in the past, just ignore this. 

Interacting with the Tumblr API requires you register a bot with Tumblr. You can register a Tumblr bot by going to this link (https://www.tumblr.com/oauth/apps), clicking "Register Application", and filling out the form. Most of the requested information is fairly self-explanatory. 

Users are redirected to the default callback URL you define after they authorize your app/bot/whatever to use access their blog.

TODO: look into the details of the effects of application website, default callback url, oauth2 redirect urls and so on

Completing this step will provide you with a OAuth consumer key and OAuth secret key. Your consumer key, as stated previously, is synonymous with your API key. 

TODO: confirm just having your consumer key / API key allows you to interact with the API endpoints with API key authorization only, and that you don't need to go through the whole process of getting a token and token secret (even if not supplied)

Utilizing methods with OAuth1 authorization, however, requires a token and token secret, too. If my memory serves, you used to be able to go to Tumblr's API console (https://api.tumblr.com/console/calls/user/info), plug in your OAuth consumer key and OAuth secret key, and you would be supplied with a token and token secret. This, however, doesn't work anymore (if it ever did). Instead, you can follow the steps in Tumblr's API docs (https://www.tumblr.com/docs/en/api/v2#oauth1-authorization) to obtain a token and token secret.

In my case, I wanted my bot to post to a dedicated blog, called "hfht-vox-pop", so I went ahead and created a Tumblr account and named my blog like so. Then, using curl, Postman, or whatever you desire, execute a POST request to 

https://www.tumblr.com/oauth/request_token

using the OAuth credentials you got earlier. You should get a response that contains the fields oauth_token, oauth_token_secret, and oauth_callback_confirmed. This token and token secret are temporary. In order to get permanent tokens, manually navigate or redirect a user to 

https://www.tumblr.com/oauth/authorize?oauth_token={your token here}

This should display a popup that wants to know whether or not to authorize your bot/app to use the blog you or the user you redirected are currently logged into. Upon a successful authorization, Tumblr redirects to the default callback URL you specified earlier and includes three parameters in the query string. 

## Authorizing your bot ##

To be determined

## Notes ##

Some endpoints (like blog info) return more information with OAuth1 compared to just an API key. I'm not sure if this typical behavior. If so, feel free to ignore this. If not, Tumblr's API documentation doesn't mention this fact.