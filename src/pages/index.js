import React from "react"
import { Helmet } from "react-helmet"
import Left from '../components/left';
import Right from '../components/right';
import Container from '../components/container';

export default () =>
(<Container>
    <Helmet>
        <title>"ABCDev - Kevin Aleman's blog"</title>
        <meta name="description" content="Blog about PostgreSQL, Golang, Javascript and more. Enjoy it! :)"></meta>
        <meta name="keywords" content="html,css,javascript,go,golang,personal site,blog,kaleman,kevin,aleman"></meta>
        <meta name="author" content="Kevin Aleman @kaleman"></meta>
        <meta property="og:site_name" content="ABCDev's blog"/>
    </Helmet>
    <Left />
    <Right />
</Container>)