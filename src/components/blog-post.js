import React from 'react';
import Img from "gatsby-image"
import containerStyles from './blog-post.module.css';

export default ({post, headerImg}) => (
  <div className={containerStyles.post}>
    <Img fluid={headerImg} />
    <h1>{post.frontmatter.title}</h1>
    <div
      className={containerStyles.content}
      dangerouslySetInnerHTML={{ __html: post.html }}
    />
  </div>
)