import graphqlRequest from "./graphqlRequest";
import {
    assertSafeEndCursor,
    assertSafeSlugForGraphql,
    normalizePostListTaxonomy,
} from "./graphqlInputGuards";

export async function getPostList(endCursor = null, taxonomy = null) {
  const cursor = assertSafeEndCursor(endCursor);
  const tax = normalizePostListTaxonomy(taxonomy);
  const afterArg = cursor ? `after: "${cursor}", ` : "";

  let condition = `${afterArg}first: 5, where: {orderby: {field: DATE, order: DESC}}`;

  if (tax) {
    condition = `${afterArg}first: 5, where: {orderby: {field: DATE, order: DESC}, ${tax.key}: "${tax.value}"}`;
  }

    const query = {
        query: `query getAllPosts {
            posts(${condition}) {
              nodes {
                date
                slug
                title
                excerpt(format: RENDERED)
                featuredImage {
                  node {
                    mediaDetails {
                      file
                      sizes {
                        sourceUrl
                        width
                        height
                      }
                    }
                  }
                }
                categories {
                  nodes {
                    name
                    slug
                  }
                }
              }
              pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
              }
            }
          }`
    };

    const resJson = await graphqlRequest(query);
    const allPosts = resJson.data.posts;

    return allPosts;
}

export async function getSinglePost(slug) {
    const query = {
        query: `query getSinglePost {
            post(id: "${slug}", idType: SLUG) {
              content(format: RENDERED)
              date
              excerpt(format: RENDERED)
              modified
              slug
              title(format: RENDERED)
              databaseId
              featuredImage {
                node {
                  mediaDetails {
                    sizes {
                      sourceUrl
                      width
                      height
                    }
                  }
                }
              }
              categories {
                nodes {
                  name
                  slug
                }
              }
            }
          }`
    };

    const resJson = await graphqlRequest(query);
    const singlePost = resJson.data.post;

    return singlePost;
}

export async function getPostSlugs() {
    const query = {
        query: `query getPostSlugs {
            posts {
              nodes {
                slug
              }
            }
          }`
    };

    const resJson = await graphqlRequest(query);
    const slugs = resJson.data.posts.nodes;
    return slugs;
}

export async function getCategorySlugs() {
  const query = {
    query: `query getCategorySlugs {
      categories {
        nodes {
          slug
        }
      }
    }`
  };

  const resJson = await graphqlRequest(query);
  const categories = resJson.data.categories.nodes;

  return categories;
}

export async function getCategoryDetails(categoryName) {
  const safeCategory = assertSafeSlugForGraphql(categoryName);
  const query = {
    query: `query getCategoryDetails {
      category(id: "${safeCategory}", idType: SLUG) {
        count
        name
        slug
      }
    }`
  };

  const resJson = await graphqlRequest(query);
  const categoryDetails = resJson.data.category;

  return categoryDetails;
}
