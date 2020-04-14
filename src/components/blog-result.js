import React from 'react';
import { Link } from "gatsby"
import ModuleStyles from './blog-result.module.css';
import TagList from './tag-list';

export default ({post}) => (
  <div className={ModuleStyles.preview} key={post.id}>         
    <div class="title-div">
      <h3>
        <Link to={post.frontmatter.path}>{post.frontmatter.title}</Link>
      </h3> <span class={ModuleStyles.small}>Created at {post.frontmatter.date}</span>
    </div>
    <TagList tags={post.frontmatter.tags} />
    <p>{post.excerpt}</p>
  </div>
);

