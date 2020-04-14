import React from 'react';
import ModuleStyles from './my-history.module.css';

const historySteps = [
  "Studied Information Systems Technician at 'Pedagogical University of El Salvador'",
  'Took CS50: Introduction to Computer Science from Harvard University',
  'Volunteered as Math & Science tutor',
  'Worked as an assistant while learning to code',
  'Worked as a web developer. Created an inventory system for a small company',
  'Started working at Applaudo Studios as a Backend Developer (CSS is my sworn enemy)',
  'Currently, learning Frontend development & DevOps',
];

export default () => (
  <ol className={ModuleStyles.list}>
    {historySteps.map(step => (
      <li><button type='button' className={ModuleStyles.link}>{step}</button></li>
    ))}
  </ol>
);