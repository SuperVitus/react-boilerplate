import React from 'react';
import { reduxForm, Field } from 'redux-form/immutable';
import { graphql, compose, gql } from 'providers/api'
import { get } from 'lodash'

import { withCreateSettingMutation } from 'graph/mutations'

class ApolloClientForm extends React.Component {

  render() {
    const { handleSubmit, onSubmit, submitting } = this.props;
    

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field name='key' component='input' type='text' placeholder='key'/>
        <Field name='val' component='input' type='text' placeholder='value'/>
        <input type='submit'/>
      </form>
    );
  }
}

export default compose(
  withCreateSettingMutation,
  reduxForm({
    form: 'ApolliClientPage_CreateSettingForm',
    onSubmit: (val, dispatch, { createSetting, reset }) => {
      console.log({ variables : val.toJS() })
      return createSetting({ variables : val.toJS() })
      .then(r=>dispatch(reset()))
    }
  })
)(ApolloClientForm)