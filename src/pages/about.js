import React from "react"
import { Helmet } from "react-helmet"
import TechStack from '../components/tech-stack';
import MyHistory from '../components/my-history'

export default () => (
  <div class='container flex flex-col justify-center items-center h-auto mt-10'>
    <Helmet title="ABCDev - About me"></Helmet>
    <div class="w-4/5 mb-10">
      <h1 class="text-center mb-5">About me</h1>
      <p class="text-center">I'm a backend web developer living in El Salvador. <br></br>
      I'm a passionate learner of new technologies & things that make my life easier.<br></br>
      My goal is to be able to create tools that help everyone in the world to have access to the knowledge, even on poor countries like mine
      </p>
    </div>
    <div class='flex justify-center flex-col items-center mb-10'>
      <h1 class="text-center mb-5">What I know</h1>
        <TechStack />
    </div>
    <div class="w-4/5 flex flex-col justify-center items-center">
      <h1 class="mb-5">My history</h1>
        <MyHistory />
    </div>
  </div>
)