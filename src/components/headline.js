import React from 'react';

import styles from './headline.module.css';

export default (props) => (
    <div className={styles.headline}><p>{props.lines.map((l, index) => (
        <React.Fragment key={`line-${index}`}>
            {l}
            <br></br>
        </React.Fragment>
    ))}</p></div>
)