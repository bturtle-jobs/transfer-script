import React, { PureComponent } from 'react';

export default function withWindowDimensions(WrappedComponent) {
    return class extends PureComponent {
        state = {};

        get hasWindow() {
            return typeof window !== 'undefined';
        }

        componentDidMount() {
            this.updateDimensions();
            window.addEventListener('resize', this.updateDimensions);
        }

        componentWillUnmount() {
            window.removeEventListener('resize', this.updateDimensions);
        }

        getCurrentDimensions = () => {
            if (!this.hasWindow) {
                return {
                    width: null,
                    height: null,
                };
            }

            return {
                width: window.innerWidth,
                height: window.innerHeight,
            };
        };

        updateDimensions = () => {
            this.setState(this.getCurrentDimensions());
        };
        render() {
            return <WrappedComponent dimensions={this.state} {...this.props} />;
        }
    };
}
