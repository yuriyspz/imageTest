import React from "react"
import { GatsbyImage, withArtDirection } from "gatsby-plugin-image"
import { StaticQuery, graphql, Link } from "gatsby"

export function Image({ imgName, className, alt, fallBackImage }) {
    return (
        <StaticQuery
            query={graphql`
            {
                allFile(filter: {absolutePath: {regex: "/pricing/"}}) {
                    edges {
                      node {
                        childImageSharp {
                          gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
                        }
                      }
                    }
                  }
            }
            `}
            render={data => {
                let imgData
                if (imgName && typeof imgName === "string") imgData = data.allFile.edges.find((element) => element.node.childImageSharp.gatsbyImageData.images.fallback.src.split('/').pop() === imgName).node.childImageSharp.gatsbyImageData
                if (imgName && typeof imgName === 'object') {
                    let defaultImage = data.allFile.edges.find((element) => element.node.childImageSharp.gatsbyImageData.images.fallback.src.split('/').pop() === fallBackImage).node.childImageSharp.gatsbyImageData
                    let responsiveImages = imgName.map(item => {
                        let qimage = data.allFile.edges.find((element) => element.node.childImageSharp.gatsbyImageData.images.fallback.src.split('/').pop() === item.imageName).node.childImageSharp.gatsbyImageData
                        return (
                            {
                                media: `(min-width:${item.minBreakpoint})`,
                                image: qimage
                            }
                        )
                    })
                    imgData = withArtDirection(defaultImage, responsiveImages)
                }


                return (
                    <GatsbyImage
                        className={className}
                        alt={alt}
                        image={imgData}
                    />
                )
            }}
        />
    )
}

const pageContent = {
    "heroImage": {
        "fallBackImage": "pricing_image_fallback.png",
        "responsiveImages": [
            {
                "imageName": "pricing_image.png",
                "minBreakpoint": "1270px"
            },
            {
                "imageName": "pricing_image_tablet.png",
                "minBreakpoint": "768px"
            },
            {
                "imageName": "pricing_image_mobile.png",
                "minBreakpoint": "320px"
            }
        ]
    },
}
export default function Pricing() {
    return (
        <span className="pricing-wrap">
            <div className="breadcrumb">
                <div className="container">
                    <ul className="breadcrumb-item">
                        <li><Link to="/">Home</Link></li>
                        <li><Link>Pricing</Link></li>
                    </ul>
                </div>
            </div>

            <section className="pricing-hero" >
                <div className="container">
                    <div className="pricing-inner">
                        <div className="right-image-col">
                            <Image imgName={pageContent.heroImage.responsiveImages} fallBackImage={pageContent.heroImage.fallBackImage} alt={pageContent.heroImageAlt} />
                        </div>
                    </div>
                </div>
            </section>
        </span>
    )
}