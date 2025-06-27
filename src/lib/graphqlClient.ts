import { GraphQLClient } from 'graphql-request'

const endpoint = 'https://datastory-cloud-v2.stellate.sh'

export const graphqlClient = new GraphQLClient(endpoint)

// If we needed to add headers, for example, an API key:
// export const graphqlClientWithHeaders = new GraphQLClient(endpoint, {
//   headers: {
//     authorization: `Bearer YOUR_API_KEY`,
//   },
// })
