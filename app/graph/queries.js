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

export const settingsQuery = gql`
query settingsQuery{
  getSettings
}`
