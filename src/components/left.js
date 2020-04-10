import React from "react";
import Headline from './headline';
import SocialLinks from './social-links.js'

import ProfileImage from '../images/profile.png';

export default () => (
    <div className="left flexible">
        <img src={ProfileImage} class='rounded small' alt='my ugly foto' />
        <Headline lines={['Hi!', "I'm Kevin Aleman", 'a Backend web developer']} />
        <SocialLinks />
    </div>
);