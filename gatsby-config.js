/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */
const path = require('path')
require('dotenv').config({ path: '.env.development' })

module.exports = {
  siteMetadata: {
    title: `ABCDev blog`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-layout`,
      options: {
        component: require.resolve(`./src/layouts/index.js`),
      },
    },
    "gatsby-plugin-catch-links",
    "gatsby-plugin-react-helmet",
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages/articles`,
        name: "pages",
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: ["gatsby-remark-prismjs", "gatsby-remark-reading-time", {
          resolve: 'gatsby-remark-emojis',
          options: {
            // Deactivate the plugin globally (default: true)
            active : true,
            // Add a custom css class
            class  : 'emoji-icon',
            // In order to avoid pattern mismatch you can specify
            // an escape character which will be prepended to the
            // actual pattern (e.g. `#:poop:`).
            escapeCharacter : '#', // (default: '')
            // Select the size (available size: 16, 24, 32, 64)
            size   : 32,
            // Add custom styles
            styles : {
              display      : 'inline',
              margin       : '0',
              'margin-top' : '1px',
              position     : 'relative',
              top          : '5px',
              width        : '25px'
            }
          }
        }],
      },
    },
    {
      resolve: `gatsby-plugin-googledrive`,
      options: {
        folderId: `11fbg6fvhSwYbPbLAnqp2eaj2ZYxA0raN`,
        keyInfo: {
          private_key: process.env.GOOGLE_PRIVATE_KEY,
          email: process.env.GOOGLE_SERVICE_ACCOUNT,
        },
        destination: path.join(__dirname, 'src/talks'),
        exportMime: 'application/pdf',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `talks`,
        path: `${__dirname}/src/talks/`,
      },
    },
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        useMozJpeg: false,
        stripMetadata: true,
        defaultQuality: 75,
      },
    },
    "gatsby-plugin-postcss"
  ],
};
