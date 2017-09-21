import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import TextField from 'material-ui/TextField';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit,
  },
});

class _TextField extends React.Component {
  render() {
    console.log(this.props)
    const { label, meta : { error }, classes, input, ...custom } = this.props
    // const { active, asyncValidating, autoFilled, dirty, error, form, initial, invalid, pristine, submitFailed, submitting, touched, valid, visited, warning } = meta
    return (
      <TextField
        error={error}
        label={label}
        classes={classes}
        {...input}
        {...custom}
      />
    );
  }
}

_TextField.propTypes = {};

export default withStyles(styles)(_TextField)
