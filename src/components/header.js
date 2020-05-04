import React, { useState } from 'react';
import {Link} from 'gatsby';

import containerStyles from './header.module.css';

export default () => {
  const [hide, setHide] = useState(true);

  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-2 w-full">
    <div className="flex items-center flex-shrink-0 text-white mr-6">
      <span className="font-semibold text-xl tracking-tight">ABCDev</span>
    </div>
    <div className="block lg:hidden">
      <button className={containerStyles.hamburger} onClick={() => setHide(!hide)}>
        <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
      </button>
    </div>
    <div className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${hide ? 'hidden': ''}`}>
      <div className="text-sm lg:flex-grow">
        <Link to="/" className={`${containerStyles.styledLink} mr-4`}>Home</Link>
        <Link to="/about" className={`${containerStyles.styledLink} mr-4`}>About</Link>
        <Link to="/blog" className={`${containerStyles.styledLink} mr-4`}>Blog</Link>
        <Link to="/contact" className={containerStyles.styledLink}>Contact</Link>
      </div>
    </div>
  </nav>
  )
}