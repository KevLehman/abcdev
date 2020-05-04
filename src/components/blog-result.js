import React from 'react';
import { Link } from "gatsby"
import ModuleStyles from './blog-result.module.css';
import TagList from './tag-list';

export default ({post}) => (
  <div className={ModuleStyles.wrapper} key={post.id}>
    <div className="md:flex-shrink-0">
      <img className={ModuleStyles.blogImg} src={`${process.env.GATSBY_APP_HOSTNAME}${post.frontmatter.featuredImage.childImageSharp.fluid.src}`} alt="" />
    </div>
    <div className="mt-4 md:mt-0 md:ml-6">
      <TagList tags={post.frontmatter.tags}></TagList>
      <Link className={ModuleStyles.styledLink} to={post.frontmatter.path}>{post.frontmatter.title}</Link>
      <p className="mt-2 text-gray-600 clamp">{post.excerpt}</p>
    </div>
  </div>
);