import "jasmine";
import { TextPostParams, TumblrClient, TumblrClientOptions } from "../tumblr";
import { CONSUMER_KEY, CONSUMER_SECRET, TOKEN, TOKEN_SECRET } from "../env";
import { AxiosResponse } from "axios";

const blog: string = 'hfht-vox-pop.tumblr.com';
const options: TumblrClientOptions = {
  credentials: {
    consumerKey: CONSUMER_KEY,
    consumerSecret: CONSUMER_SECRET,
    token: TOKEN,
    tokenSecret: TOKEN_SECRET,
  },
}

describe('tumblr.ts', function() {
  const client: TumblrClient = new TumblrClient(blog, options)

  it('should return blog info', (done) => {
    client.getBlogInfo().then((response: AxiosResponse) => {
      expect(response.data.meta.status).toBe(200);
      expect(response.data.response.blog.name).toBe('hfht-vox-pop');
      done();
    })
  });

  it('should create a text post', (done) => {
    const params: TextPostParams = {
      title: "wassup",
      body: "hows it going",
    }

    client.createTextPost(params).then((response: AxiosResponse) => {
      expect(response.data.meta.status).toBe(200);
      expect(response.data.meta.msg).toBe("Created");
      console.log(response.data.meta);
      console.log(response.data.response);
      done();
    })
  })
});
