import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import H1 from 'components/H1';
import messages from './messages';
import List from './List';
import ListItem from './ListItem';
import ListItemTitle from './ListItemTitle';

import { serverStatusQuery } from 'graph/queries'

import { graphql, compose, gql } from 'providers/api'
import { get } from 'lodash'

class ApolloClientPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { serverStatus, serverStatusLoading } = this.props
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
            { !!serverStatusLoading ? <p>Loading</p> : <div>
              <p> Node Status : { serverStatus.nodeStatus } </p>
              <p> Name : { serverStatus.name } </p>
              <p> Uptime : { serverStatus.uptime } </p>
              <p> Version : { serverStatus.version } </p>
              <p> Id : { serverStatus.id } </p>
              <p> Consumed Memory : { serverStatus.consumedMemoryMB } MB </p>
              <p> Event Loop Delay : { serverStatus.consumedMemoryMB } s </p>
              <p> Task Queue Depth : { serverStatus.resqueTotalQueueLength } Tasks </p>
            </div>
            }
              {/* { JSON.stringify(this.props.data.serverStatus) } */}
              {/* <FormattedMessage {...messages.scaffoldingMessage} /> */}
          </ListItem>
        </List>
      </div>
    );
  }
}

export default compose(
  graphql(serverStatusQuery,{ 
    props: ({ ownProps, data }) => ({
      ...ownProps,
      serverStatus: get(data,'serverStatus') || {},
      serverStatusLoading: get(data,'loading'),
      serverStatusRefetch: get(data,'refetch'),
    }),
    options : {
      pollInterval: 5*1000, // poll for updates every five seconds
    }
  })
)(ApolloClientPage)