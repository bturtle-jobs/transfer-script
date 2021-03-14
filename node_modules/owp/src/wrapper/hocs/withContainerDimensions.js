import React, { PureComponent } from 'react';

export default function withContainerDimensions(WrappedComponent) {
    return class extends PureComponent {
        state = {};
        ref = React.createRef(null);

        componentDidMount() {
            this.updateDimensions();
            window.addEventListener('resize', this.updateDimensions);
        }

        componentWillUnmount() {
            window.removeEventListener('resize', this.updateDimensions);
        }

        getCurrentDimensions = () => {
            if (!this.ref.current) {
                return {};
            }

            return {
                width: this.ref.current.offsetWidth,
                height: this.ref.current.offsetHeight,
            };
        };

        updateDimensions = () => {
            this.setState(this.getCurrentDimensions());
        };
        render() {
            return <WrappedComponent ref={this.ref} dimensions={this.state} {...this.props} />;
        }
    };
}
