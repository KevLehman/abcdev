import React from 'react';
import {Link} from 'gatsby';
import styles from './navigation-bar.module.css';

export default (props) => (
    <nav className="navbar">
        <ul className={styles.navlist}>
            {props.menuItems.map(e => (
                <li><Link to={`/${e.toLowerCase()}`} key={e.toLowerCase()} name={e.toLowerCase()}>{e.toUpperCase()}</Link></li>
            ))}
        </ul>
    </nav>
)