import React from 'react';
import NavigationBar from './navigation-bar';

export default () => (
    <div className="right flexible">
        <NavigationBar menuItems={['about', 'blog', 'contact']}/>
    </div>
)