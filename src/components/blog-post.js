import React from 'react';

export default ({post, headerImg}) => (
  <div className="w-full shadow-none pl-10 pr-10 pb-10 md:shadow-2xl lg:shadow-2xl">
    <img src={`${process.env.GATSBY_APP_HOSTNAME}${headerImg.src}`} alt="" class="w-full" style={{ maxHeight: '500px' }} loading="lazy"/>
    <h1 className="font-bold font-title mt-2 mb-2">{post.frontmatter.title}</h1>
    <div
      className="w-full"
      dangerouslySetInnerHTML={{ __html: post.html }}
    />
  </div>
)