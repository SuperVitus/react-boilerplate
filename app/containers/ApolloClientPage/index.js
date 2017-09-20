import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import H1 from 'components/H1';
import messages from './messages';
import List from './List';
import ListItem from './ListItem';
import ListItemTitle from './ListItemTitle';

import { serverStatusQuery, settingsQuery } from 'graph/queries'

import { graphql, compose, gql } from 'providers/api'
import { get, map, keys } from 'lodash'

import Form from './Form'

class ApolloClientPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount(props){
    console.log(this.props.setting)
    this.unsubscribe = this.props.settings.subscribeToMore({
      document: gql`subscription {
        SettingCreated { dataValues }
      }`,
      updateQuery: (previousResult, { subscriptionData, variables }) => {
        const newSetting = subscriptionData.data[keys(subscriptionData.data)[0]].dataValues
        return { ...previousResult, getSettings : [newSetting,...previousResult.getSettings] };
      }
    });
  }

  render() {
    const { serverStatus, settings } = this.props
    const serverStatusData = get(serverStatus,'serverStatus') || {}

    return (
      <div>
        <Helmet
          title="Apollo Client Page"
          meta={[
            { name: 'description', content: 'Apollo Client page of React.js Boilerplate application' },
          ]}
        />
        <H1>
          <FormattedMessage {...messages.header} />
        </H1>
        <List>
          <ListItem>
            <ListItemTitle>
              <FormattedMessage {...messages.serverStatusMessage} />
            </ListItemTitle>
            { !!serverStatus.loading ? <p>Loading</p> : <div>
              <p> Node Status : { serverStatusData.nodeStatus } </p>
              <p> Name : { serverStatusData.name } </p>
              <p> Uptime : { serverStatusData.uptime } </p>
              <p> Version : { serverStatusData.version } </p>
              <p> Id : { serverStatusData.id } </p>
              <p> Consumed Memory : { serverStatusData.consumedMemoryMB } MB </p>
              <p> Event Loop Delay : { serverStatusData.consumedMemoryMB } ms </p>
              <p> Task Queue Depth : { serverStatusData.resqueTotalQueueLength } Tasks </p>
            </div>
            }
          </ListItem>
          <ListItem>
            <ListItemTitle>
              Settings (Mutations)
            </ListItemTitle>
            <Form />
            { settings.loading == false && map(settings.getSettings,set=><p>{ set.key }: { set.val}</p>) }
          </ListItem>
        </List>
      </div>
    );
  }
}

export default compose(
  graphql(serverStatusQuery,{ 
    name : 'serverStatus',
    options : {
      pollInterval: 10*1000,
    }
  }),
  graphql(settingsQuery,{ 
    name : 'settings',
    // options : {}
  })
)(ApolloClientPage)