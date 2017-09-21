import React from 'react';
import { reduxForm, Field } from 'redux-form/immutable';
import { graphql, compose, gql } from 'providers/api'
import { get } from 'lodash'

import { withCreateSettingMutation } from 'graph/mutations'

import { TextField, SubmitButton } from 'components/FormInputs'

class ApolloClientForm extends React.Component {

  render() {
    const { handleSubmit, onSubmit, submitting } = this.props;
    

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field name='key' component={TextField} label='key' required/>
        <Field name='val' component={TextField} label='value'/>
        <SubmitButton />
      </form>
    );
  }
}

export default compose(
  withCreateSettingMutation,
  reduxForm({
    form: 'ApolloClientPage_CreateSettingForm',
    onSubmit: (val, dispatch, { createSetting, reset }) => {
      console.log(val)
      console.log({ variables : val.toJS() })
      return createSetting({ variables : val.toJS() })
      .then(r=>dispatch(reset()))
    }
  })
)(ApolloClientForm)