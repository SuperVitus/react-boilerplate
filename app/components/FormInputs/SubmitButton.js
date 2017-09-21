import React from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit,
  },
});

class _SubmitButton extends React.Component {
  render(){
    return <Button raised color="primary" type="submit" {...this.props}>{ this.props.children ? this.props.children[0] : 'Submit' }</Button>
  }
} 
export default withStyles(styles)(_SubmitButton)
