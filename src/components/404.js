import React from 'react';
import {StaticQuery, graphql} from 'gatsby';
import BlogResult from './blog-result';
import ContainerStyles from './404.module.css';

const featuredQuery = graphql`
query FeaturedPosts {
  allMarkdownRemark(filter: {frontmatter: {featured: {eq: true}}}) {
    edges {
      node {
        excerpt(pruneLength: 250)
        id
        frontmatter {
          title
          date(formatString: "MMMM DD, YYYY")
          path
          draft
          tags
          featured
        }
      }
    }
  }
}
`;

export default () => (
  <StaticQuery
    query={featuredQuery}
    render={({ allMarkdownRemark: posts }) => (
      <div className={ContainerStyles.container}>
        <div className={ContainerStyles.bigText}>404. <br></br> Sorry, that link is broken :(</div>
        <div>
          If you were looking for something to read, maybe you find these articles interesting:
        </div>
        {posts.edges.map(({ node: post }) => (<BlogResult post={post} />))}
  </div>
    )}
  >
  </StaticQuery>
);