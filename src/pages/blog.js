import React from "react"
import { Link, graphql } from "gatsby"
import '../styles/blog-listing.css';
import TagList from '../components/tag-list';



export default function Index({ data }) {
  const { edges: posts } = data.allMarkdownRemark
  return (
    <div className="blog-posts">
      {posts
        .filter(post => post.node.frontmatter.title.length > 0)
        .filter(post => !post.node.frontmatter.draft)
        .map(({ node: post }) => {
          return (
            <div className="blog-post-preview" key={post.id}>
              
              <div class="title-div">
              <h3>
                <Link to={post.frontmatter.path}>{post.frontmatter.title}</Link>
              </h3> <span class="small-text">Created at {post.frontmatter.date}</span>
              </div>
              <TagList tags={post.frontmatter.tags} />
              <p>{post.excerpt}</p>
            </div>
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