import React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import BlogPost from '../components/blog-post';

import '../styles/blog-post.css';

export default function Template({
  data,
}) {
  const { markdownRemark: post } = data // data.markdownRemark holds your post data
  const {
    frontmatter: {
      title: postTitle,
      path: postPath,
      featuredImage: {
        childImageSharp: {
          fluid: featuredImgFluid,
          original: {
            src: featuredImgSrc,
          }
        }
      }
    },
    fields: {
      readingTime: {
        text: readingTime,
      }
    }
  } = post;

  return (
    <article>
      <div className="blog-post-container">
        <Helmet title={`${postTitle} - ABCDev`}>
          <meta name="title" content={`${post.frontmatter.title} - ABCDev`}></meta>
          
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content={`${process.env.APP_HOSTNAME}${postPath}`} />
          <meta property="twitter:title" content={postTitle} />
          <meta property="twitter:description" content={post.excerpt} />
          <meta property="twitter:image" content={`${process.env.APP_HOSTNAME}${featuredImgSrc}`} />
          <meta name="twitter:label1" value="Reading time" />
          <meta name="twitter:data1" value={readingTime} />
          <meta name="twitter:label2" value="Written by" />
          <meta name="twitter:data2" value="Kevin Aleman @kaleman" />

          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${process.env.APP_HOSTNAME}${postPath}`} />
          <meta property="og:title" content={post.frontmatter.title} />
          <meta property="og:description" content={post.excerpt} />
          <meta property="og:image" content={`${process.env.APP_HOSTNAME}${featuredImgSrc}`} />
        </Helmet>
        <BlogPost post={post} headerImg={featuredImgFluid} />
      </div>
    </article>
  )
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      excerpt(pruneLength: 100)
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        draft
        featuredImage {
          childImageSharp {
            original {
              src
            }
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
      fields {
        readingTime {
          text
        }
      }
    }
  }
`