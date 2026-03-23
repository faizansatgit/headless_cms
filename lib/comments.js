import graphqlRequest from "./graphqlRequest";
import { assertSafeSlugForGraphql } from "./graphqlInputGuards";

const MAX_AUTHOR = 100;
const MAX_EMAIL = 254;
const MAX_CONTENT = 10_000;

function assertValidCommentInput(body) {
    if (!body || typeof body !== "object") {
        throw new Error("Invalid request body");
    }
    const postId = parseInt(body.postId, 10);
    if (!Number.isFinite(postId) || postId < 1 || postId > 2147483647) {
        throw new Error("Invalid post");
    }
    const author = String(body.author ?? "").trim().slice(0, MAX_AUTHOR);
    const authorEmail = String(body.authorEmail ?? "")
        .trim()
        .slice(0, MAX_EMAIL);
    const content = String(body.content ?? "").slice(0, MAX_CONTENT);
    if (!author || !authorEmail || !content) {
        throw new Error("Author, email, and message are required");
    }
    return { author, authorEmail, content, postId };
}

export async function createComment(body) {
    const input = assertValidCommentInput(body);
    const mutation = {
        query: `mutation createComment(
            $author: String!,
            $authorEmail: String!,
            $clientMutationId: String!,
            $commentOn: Int!,
            $content: String!
        ) {
            createComment(
                input: {
                    author: $author,
                    authorEmail: $authorEmail,
                    clientMutationId: $clientMutationId,
                    content: $content,
                    commentOn: $commentOn
                }
            ) {
                success
            }
        }`,
        variables: {
            author: input.author,
            authorEmail: input.authorEmail,
            clientMutationId: `next-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            commentOn: input.postId,
            content: input.content,
        },
    };

    return graphqlRequest(mutation);
}

export async function getComments(slug) {
    const safeSlug = assertSafeSlugForGraphql(slug);
    const query = {
        query: `query getComments {
            post(id: "${safeSlug}", idType: SLUG) {
              comments(where: {parentIn: "null"}) {
                nodes {
                  content
                  author {
                    node {
                      name
                      avatar {
                        url
                        height
                        width
                      }
                    }
                  }
                  date
                  parentId
                  id
                }
              }
              commentCount
            }
          }`
    };

    const resJson = await graphqlRequest(query);
    const post = resJson.data.post;

    return {
       comments: post.comments,
       commentCount: post.commentCount,
    }
}