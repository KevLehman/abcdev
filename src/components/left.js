import React from "react";
import Headline from './headline';
import SocialLinks from './social-links.js'
import ProfileImage from '../images/profile.png';
import moduleStyles from './left.module.css'; 

export default () => (
    <div className={moduleStyles.left}>
        <div className={moduleStyles.wrap}>
            <img src={ProfileImage} className={moduleStyles.profileImg} alt='my ugly foto' />
            <Headline lines={['Hi!', "I'm Kevin Aleman", 'a Backend web developer']} />
            <SocialLinks />
        </div>
    </div>
);