import React from "react"
import TechStack from '../components/tech-stack.js';
import '../styles/about.css';

export default () => (
  <div class='about-container'>
    <div style={{ width: '80%'}}>
      <h1>About me</h1>
      <p>I'm a backend web developer living in El Salvador. <br></br>
      I'm a passionate learner of new technologies & things that make my life easier.<br></br>
      My goal is to be able to create tools that help everyone in the world to have access to the knowledge, even on poor countries like mine
      </p>
    </div>
    <div class='tech-stack-container'>
      <h1>What I know</h1>
        <TechStack />
    </div>
    <div class="history-container">
      <h1>My history</h1>
      <ol class="rectangle-list">
        <li><button type='button' class='link-button'>Studied Information Systems Technician at 'Pedagogical University of El Salvador'</button></li>
        <li><button type='button' class='link-button'>Took CS50: Introduction to Computer Science from Harvard University</button></li>
        <li><button type='button' class='link-button'>Volunteered as Math & Science tutor </button></li>
        <li><button type='button' class='link-button'>Worked as an assistant while learning to code</button></li>
        <li><button type='button' class='link-button'>Worked as a web developer. Created an inventory system for a small company</button></li>
        <li><button type='button' class='link-button'>Started working at Applaudo Studios as a Backend Developer (CSS is my sworn enemy)</button></li>
        <li><button type='button' class='link-button'>Currently, learning Frontend development & DevOps</button></li>
      </ol>
    </div>
  </div>
)