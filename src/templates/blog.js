import React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import BlogPost from '../components/blog-post';

import '../styles/blog-post.css';

export default function Template({
  data,
}) {
  const { markdownRemark: post } = data // data.markdownRemark holds your post data
  let featuredImgFluid = post.frontmatter.featuredImage.childImageSharp.fluid
  return (
    <article>
      <div className="blog-post-container">
        <Helmet title={`${post.frontmatter.title} - ABCDev`} />
        <BlogPost post={post} headerImg={featuredImgFluid} />
      </div>
    </article>
  )
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        draft
        featuredImage {
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`