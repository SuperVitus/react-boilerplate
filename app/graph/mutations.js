import { graphql, gql, apollo } from 'providers/api';
import { get } from 'lodash'

const createSettingMutation = gql`
mutation SettingCreate($key:String!,$val:Json!){
  SettingCreate(key:$key,val:$val){ id val UserId }
}`

export const withCreateSettingMutation = graphql(createSettingMutation,{ name : 'createSetting' })
