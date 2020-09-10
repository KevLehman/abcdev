import React from 'react';
import NavigationBar from './navigation-bar';
import moduleStyles from './right.module.css';

export default () => (
    <div className={[moduleStyles.right].join(' ')}>
        <NavigationBar menuItems={['about', 'blog', 'contact', 'talks']}/>
    </div>
)