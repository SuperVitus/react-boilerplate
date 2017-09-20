import { graphql, gql, apollo } from 'providers/api';
import { get } from 'lodash'

export const sessionQuery = gql`
query sessionQuery{
  me
}`

export const serverStatusQuery = gql`
query serverStatusQuery{
  serverStatus
}`

// export const withSession = graphql(sessionQuery, { // only use this in a root container
//   props: ({ ownProps, data }) => ({
//     ...ownProps,
//     sessionLoading: get(data,'loading'),
//     session: get(data,'me'),
//     sessionRefetch: get(data,'refetch'),
//   }),
//   options : (props)=>{
//     // console.log(props)
//     return { 
//     variables : {},
//     notifyOnNetworkStatusChange: true,
//     fetchPolicy : 'cache-and-network',
//     // pollInterval: 60*1000, // poll for updates every minute
//   }}
// })
