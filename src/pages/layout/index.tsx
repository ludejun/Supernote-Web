import React from 'react';
import 'quill-react-commercial/dist/quill-react-commercial.min.css';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}
