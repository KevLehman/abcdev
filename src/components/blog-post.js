import React from 'react';
import SocialLogos from './social-links';
import twitterLogo from '../images/twitter.png'

const shareLogo = [twitterLogo]
const defaultTweet = "Check out new article on Kevin's blog -"

function twitterSharing(postUrl, tweet) {
  let baseUrl = 'http://twitter.com/share?'
  const params = {
    url: `${process.env.GATSBY_APP_HOSTNAME}${postUrl}`,
    text: tweet ? tweet : defaultTweet,
    via: 'kaleman15',
    hashtags: 'dev'
  }
  for(var prop in params) baseUrl += '&' + prop + '=' + encodeURIComponent(params[prop]);
  return baseUrl;
}

export default ({post, headerImg}) => {
  const urlList = [] 
  urlList.push(twitterSharing(post.frontmatter.path, post.frontmatter.tweet))
  return (
    <div className="w-full shadow-none pl-10 pr-10 pb-10 md:shadow-2xl lg:shadow-2xl">
      <img 
        src={`${process.env.GATSBY_APP_HOSTNAME}${headerImg.src}`} 
        alt="" 
        class="w-full" 
        style={{ maxHeight: '500px' }} 
        loading="lazy"
      />
      <h1 className="font-bold font-title mt-2 mb-2 text-center">{post.frontmatter.title}</h1>
      <div className="social flex w-full justify-center align-center"> 
        <SocialLogos socialLogos={shareLogo} socialUrls={urlList} />
      </div>
      <div
        className="w-full blog-data"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </div>
  )
}