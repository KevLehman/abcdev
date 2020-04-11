import React from 'react';
import devLogo from '../images/devlogo.png';
import fbLogo from '../images/fb-logo.png';
import githubLogo from '../images/github.png';
import twitterLogo from '../images/twitter.png';

import containerStyles from './social-links.module.css';

const socialLogos = [devLogo, fbLogo, githubLogo, twitterLogo];
const socialUrls = ['https://dev.to/kaleman15', 'https://www.facebook.com/k.alemangarcia', 'https://github.com/KevLehman', 'https://twitter.com/kaleman15'];

export default () => (
  <div className={containerStyles.logosContainer}>
    {socialLogos.map((logo, idx) => (
      <div style={{ 'marginRight': '5%' }} key={`logo-${idx}`}>
        <a href={socialUrls[idx]}>
          <img className={containerStyles.smallImg} src={logo} alt='' />
        </a>
      </div>
    ))}
  </div>
);