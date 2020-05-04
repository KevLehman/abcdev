import React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import BlogPreview from '../components/blog-result';

export default function Index({ data }) {
  const { edges: posts } = data.allMarkdownRemark
  return (
    <div className="container h-full w-4/5 mb-8">
      <Helmet title="ABCDev - Blog" />
      {posts
        .filter(post => post.node.frontmatter.title.length > 0)
        .filter(post => !post.node.frontmatter.draft)
        .map(({ node: post }) => {
          return (
            <BlogPreview post={post} />
          )
        })}
    </div>
  )
}
export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
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
            featuredImage {
              childImageSharp {
                fluid(maxWidth: 400) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`