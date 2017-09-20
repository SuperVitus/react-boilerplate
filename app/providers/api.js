import { ApolloClient, compose as _compose, gql as _gql, graphql as _graphql, createNetworkInterface } from 'react-apollo';
import { createBatchingNetworkInterface } from 'apollo-client';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

import { connect as _connect } from 'react-redux';

import { SubmissionError } from 'redux-form/immutable';

import * as Axios from 'axios';
import { isString, get, clone } from 'lodash'
 
// Use this to point to a local API instance on a local development machine, and an external instance for all other hosts, if you wish.
// This could/should probably be moved to some sort of Webpack options
export const api_host = (location.hostname === 'localhost') ? 'http://localhost:8080' : 'https://api.hostname.com';
const wsClient = new SubscriptionClient((location.hostname === 'localhost') ? 'ws://localhost:5000/subscriptions' : 'https://api.hostname.com', {
  reconnect: true
});

const networkInterface = createNetworkInterface({
  // batchInterval: 100,
  timeout: 10000, // not sure if this is even a real option
  uri: api_host + '/api/graph',
  method: 'POST',
  query: request => networkInterface.query(request).catch(e => console.error(e.message, e))
});

networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};
      }
      const token = localStorage.getItem('AUTH_TOKEN');
      if (token  && typeof token !== 'undefined' && token !== 'null') {
        req.options.headers['Authorization'] = `Bearer ${token}`;
        req.options.headers['Referer'] = null;
        next();
      }else{
        next();
        // if(window.location.pathname.split('/')[1] !== 'auth') _browserHistory.push('/auth/login');
      }
    },
  }
]);

const logErrors = {
  applyAfterware(res, next) {
    console.log(res)
    if (!res||!res.response) {
      // response.clone().text().then(bodyText => {
        console.error(`Network Error: ${res}`);
        // console.error(`Network Error: ${response.status} (${response.statusText}) - ${bodyText}`);
        next();
      // });
    } else {
      next()
    }
    // else {
    //   response.clone().json().then(({ errors }) => {
    //     if (errors) {
    //       console.error('GraphQL Errors:', errors.map(e => e.message));
    //     }
    //     next();
    //   });
    // }
  },
};

const responseHandler = {
  applyAfterware(response, next) {

    // var response = get(res,'responses[0]')

    if(response.status==401){
      if(window.location.pathname !== '/auth/login'){
        localStorage.setItem('AUTH_TOKEN',null)
        window.setTimeout(()=>window.location = '/auth/login',500)
        next()
      }
    }else{
      next();
    }
    // if (!response.ok) {
    //   clone(response).text().then(bodyText => {
    //     console.error(`Network Error: ${response.status} (${response.statusText}) - ${bodyText}`);
    //     next();
    //   });
    // } else {
    //   clone(response).json().then(({ errors }) => {
    //     if (errors) {
    //       console.error('GraphQL Errors:', errors.map(e => e.message));
    //     }
    //     next();
    //   });
    // }
  },
};

networkInterface.useAfter([responseHandler, logErrors]);

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

// by default, this client will send queries to `/graphql` (relative to the URL of your app)
export const apollo = new ApolloClient({
  networkInterface : networkInterfaceWithSubscriptions,
  dataIdFromObject: (r) => r['uuid'],
  // shouldBatch: true,
});

const createAxiosHeaders = ()=>{
  const token = localStorage.getItem('AUTH_TOKEN');
  if (isString(token)) {
    return {
      // Authorization: `Bearer ${token}`,
    }
  }else{
    return {}
  }
}

export const axios_config = (opts)=>Object.assign({},opts||{},{
  baseURL: api_host + '/api',
  headers: createAxiosHeaders(),
  timeout: 10000,
  transformResponse: [function (data) {
    var parsedResponse = {}
    try{ parsedResponse = JSON.parse(data) } catch(e){};
    // console.log(parsedResponse)
    if(parsedResponse && parsedResponse.error){
      throw parsedResponse.error.errors?parsedResponse.error.errors:parsedResponse.error
      // throw new SubmissionError(parsedResponse.error)
      // const errorMessage = get(parsedResponse,'error.message')
      // if(!errorMessage) _toastr.error('uh oh!',errorMessage?errorMessage:'there was a server error')
      // throw new SubmissionError(parsedResponse.error)
    }else{
      return parsedResponse;
    }
  }],

});

export const axios = (method,url,data)=>{
  var client = Axios.create(axios_config())
  return data?client[method](url,data):client[method](url)
}

export const axiosPostForm = (url,data)=>{
  var client = Axios.create(axios_config())
  return client['post'](url,data)
  .catch(err=>{
    throw new SubmissionError(err.errors?get(err.errors,'[0].message')?get(err.errors,'[0].message'):err.errors:err)
  })
}

// export const graphPostForm = (url,data)=>{
//   var client = Axios.create(axios_config())
//   return client['post'](url,data)
//   .catch(err=>{
//     throw new SubmissionError(err.errors?get(err.errors,'[0].message')?get(err.errors,'[0].message'):err.errors:err)
//   })
// }

export const gql = _gql
export const graphql = _graphql
export const connect = _connect
export const compose = _compose