import React from "react"
import { Helmet } from "react-helmet"
import Left from '../components/left';
import Right from '../components/right';
import Container from '../components/container';

export default () =>
(<Container>
    <Helmet>
        <title>"ABCDev - Kevin Aleman's blog"</title>
        <meta name="description" content="blog site for kevin aleman's posts. Personal site"></meta>
        <meta name="keywords" content="html,css,javascript,go,golang,personal site,blog,kaleman,kevin,aleman"></meta>
        <meta name="author" content="Kevin Aleman @kaleman"></meta>
    </Helmet>
    <Left />
    <Right />
</Container>)