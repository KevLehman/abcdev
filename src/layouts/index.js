import React from 'react';
import { config } from 'react-spring';
import { Transition } from 'react-spring/renderprops'
import Header from '../components/header';

import './layout.css';

const TemplateWrapper = ({ location, children }) => {
    const isBaseRoute = location.pathname === '/';
    const className = !isBaseRoute ? 'full-with-header' : 'full';
    
    return (
      <div className={className}>
        {!isBaseRoute && <Header />}
        <Transition
          config={config.slow}
          keys={location.pathname}
          from={{ position: 'absolute', opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
          unique={true}
          reset={true}
        >
          {() => () => (
            children
          )}
        </Transition>
      </div>
    )
}

export default TemplateWrapper