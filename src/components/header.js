import React from 'react';
import {Link} from 'gatsby';

import containerStyles from './header.module.css';

export default () => (
  <div class={containerStyles.header}>
    <Link to='/about' key='about' name='about'>About</Link>
    <Link to='/blog' key='blog' name='blog'>Blog</Link>
    <Link to='/contact' key='contact' name='contact'>Contact</Link>
  </div> 
)