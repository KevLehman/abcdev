import React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby";
import PDFJS from 'pdfjs-dist'

PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.js`
PDFJS.disableWorker = true;

export default ({ data: { allFile: { edges = [] } } }) => (
  <div className='container flex flex-col justify-center items-center h-auto mt-10'>
    <Helmet title="ABCDev - About me"></Helmet>
    <div className="w-4/5 mb-10">
      <h1 className="text-center mb-5">My talks!</h1>
    </div>
    <div className='flex justify-center flex-row flex-wrap items-center mb-10'>
      {edges.map(({ node: talk }, i) => (
        <a href={`${process.env.GATSBY_APP_HOSTNAME}${talk.publicURL}`}>
          <canvas className="mt-4 ml-4 mr-4 mb-4" id={`canva-${i}`} key={`canva-${i}-key`}></canvas>
        </a>
      ))}
      {
        edges.map(({ node: talk }, id) => {
          // <object width="400" height="40 0" data={talk.publicURL} type="application/pdf"></object>
          PDFJS.getDocument(talk.publicURL).promise.then((pdf) => {
            pdf.getPage(1).then((page) => {
              const scale = 0.7
              const viewPort = page.getViewport({ scale })

              const canvas = document.getElementById(`canva-${id}`)
              const context = canvas.getContext('2d')
              canvas.height = viewPort.height
              canvas.width = viewPort.width

              page.render({canvasContext: context, viewport: viewPort});
              return null;
            })
          })
          return null;
        })
      }
    </div>
  </div>
)

export const pageQuery = graphql`
  query {
    allFile (filter: {sourceInstanceName: { eq: "talks" } }) {
      edges {
        node {
          extension
          dir
          name
          publicURL
        }
      }
    }
  }  
`