import React from 'react';

import styles from './headline.module.css';

export default (props) => (
    <div className={styles.headline}><p>{props.lines.map(l => (
        <>{l}<br /></>
    ))}</p></div>
)