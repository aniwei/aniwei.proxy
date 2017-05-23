import React, { PropTypes } from 'react';
import classnames from 'classnames';

class Tool extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func,
    type: PropTypes.string
  };

  static defaultProps = {
    onSelect: () => {}
  };

  constructor (props) {
    super(props);

    this.state = {
      selected: props.selected || false
    };
  }

  componentWillReceiveProps (nextProps) {
    if ('selected' in nextProps) {
      this.setState({
        selected: nextProps.selected
      });
    }
  }

  onSelect = (e) => {
    const { onSelect, fixed, type } = this.props;

    if (fixed) {
      return this;
    }

    this.setState({
      selected: !this.state.selected
    });

    onSelect(type);
  }

  render () {
    const { type, fixed } = this.props;
    const { selected } = this.state;

    const fillStyle = (selected || fixed ) ? 'fill' : 'line';

    const classes = classnames({
      [`iconfont`]: true,
      [`app__toolbar-item-icon`]: true,
      [`icon-${type}-${fillStyle}`]: true
    });

    return (
      <div className="app__toolbar-tool-text" onClick={this.onSelect}>
        <i className={classes}></i>
      </div>
    );
  }
}

export default Tool;