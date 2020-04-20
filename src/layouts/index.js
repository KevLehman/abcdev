import React, { useRef } from 'react';
import { useTransition, animated } from 'react-spring';
import Header from '../components/header';

import './layout.css';

function keyExistsInArray(key, arr) {
    return arr.some(function (el) {
      return el.key === key
    })
}

const TemplateWrapper = ({ location, children }) => {
    const visitedRoutes = useRef([]);
    const transitions = useTransition(location, location.pathname, {
        from: { position: 'absolute', opacity: 0.01, transform: 'translate3d(100%,0,0)' },
        enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        leave: { opacity: 0, transform: 'translate3d(-100%,0,0)' },
        unique: true,
        reset: true,
    });
    const exists = keyExistsInArray(children.key, visitedRoutes.current);
    if (!exists) {
        visitedRoutes.current.push(children);
    }
    
    const isBaseRoute = location.pathname === '/';
    const className = !isBaseRoute ? 'full-with-header' : 'full';
    
    return (
      <div className={className}>
        {!isBaseRoute && <Header />}
        {transitions.map(({ item, props, key }) => {
          return (
            <animated.div
              key={key}
              style={props}
              className={className}
            >
              {item.pathname === children.key ? (
                // entering view
                children
              ) : (
                // again, not sure if this is the best approach
                // exiting view. or just render children if its the initial render
                visitedRoutes.current.find(x => x.key === key) || children
              )}
            </animated.div>
          )
        })}

      </div>
    )
}

export default TemplateWrapper