import React from "react"
import { Helmet } from "react-helmet"
import TechStack from '../components/tech-stack';
import MyHistory from '../components/my-history'
import '../styles/about.css';

export default () => (
  <div class='about-container'>
    <Helmet title="ABCDev - About me"></Helmet>
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
        <MyHistory />
    </div>
  </div>
)