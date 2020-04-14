import React from "react"
import containerStyles from './tech-stack.module.css';
import GoLogo from '../images/go.svg';
import JsLogo from '../images/javascript.svg';
import PyLogo from '../images/python.svg';
import CSSLogo from '../images/css-3.svg';
import HTMLLogo from '../images/html-5.svg';
import ReactLogo from '../images/react.svg';
import GatsbyLogo from '../images/gatsby.svg';
import PHPLogo from '../images/php.svg';
import PostgresLogo from '../images/postgresql.svg';
import MySQLLogo from '../images/mysql.svg';
import MongoLogo from '../images/mongodb.svg';
import NodeLogo from '../images/nodejs-icon.svg';
import AWSLogo from '../images/aws.svg';
import AzureLogo from '../images/azure.svg';
import HerokuLogo from '../images/heroku.svg';
import GitLogo from '../images/git.svg';
import ExpressLogo from '../images/express.svg';
import LaravelLogo from '../images/laravel.svg';


const knownTechnologies = ['Go', 'Javascript', 'Python', 'CSS', 'HTML', 'React', 'Gatsby', 'PHP', 'PostgreSQL', 'MySQL', 'MongoDB', 'Node.JS', 'AWS', 'Azure', 'Heroku', 'Git', 'Express', 'Laravel'];
const techLogos = [
  GoLogo,
  JsLogo,
  PyLogo,
  CSSLogo,
  HTMLLogo,
  ReactLogo,
  GatsbyLogo,
  PHPLogo,
  PostgresLogo,
  MySQLLogo,
  MongoLogo,
  NodeLogo,
  AWSLogo,
  AzureLogo,
  HerokuLogo,
  GitLogo,
  ExpressLogo,
  LaravelLogo,
];

export default () => (
  <div className={containerStyles.container}>
    {knownTechnologies.map((v, index) => {
      return (<div className={containerStyles.tech}>
        <div className={containerStyles.imageContainer}>
          <img src={techLogos[index]} alt=''/>
        </div>
        <h6>{v}</h6>
      </div>)
    })}
  </div>
)