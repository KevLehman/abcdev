import React from 'react';
import componentStyles from './tag-list.module.css';

export default (props) => {
  const tagList = props.tags || '';
  const tags = tagList.split(',');
  return (
    <div>
      Tags: {tags.map(tag => (<div class={componentStyles.tag}>{tag}</div>))}
    </div>
  )
}