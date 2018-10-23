import React, {Component, Fragment, createRef} from 'react';
import Button from '@material-ui/core/Button';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            animationStart: false,
        };

        this.animationButton = createRef();
        this.animationCanvas = createRef();
        this.toggleAnimationStatus = this.toggleAnimationStatus.bind(this);
        this.runAnimation = this.runAnimation.bind(this);
    }

    toggleAnimationStatus() {
        this.setState({
            animationStart: !this.state.animationStart
        });
    }

    runAnimation() {
        const canvas = this.animationCanvas.current;
        let timer = null;
        let webgl;

        const setTimer = () => timer = setInterval(drawAnimation, 500);
        const clearTimer = () => clearInterval(timer);

        const drawAnimation = () => {
            if (this.state.animationStart) {
                if (!webgl) {
                    webgl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

                    if (!webgl) {
                        clearTimer();
                        console.log(`Failed to get WebGL context.\n Your browser or device may not support WebGL.`);
                        return;
                    }

                    webgl.viewport(0, 0, webgl.drawingBufferWidth, webgl.drawingBufferHeight);
                }

                webgl.clearColor(Math.random(), Math.random(), Math.random(), 1.0);
                webgl.clear(webgl.COLOR_BUFFER_BIT)
            }
        };

        if (this.state.animationStart) {
            this.toggleAnimationStatus();
            clearTimer();

        } else if (!this.state.animationStart) {
            this.toggleAnimationStatus();
            setTimer();
            drawAnimation();
        }
    }

    render() {
        return (
            <Fragment>
                <div className="App">
                    <header className="App-header">
                        A simple WebGL program that shows color animation.
                    </header>

                    <main>
                        <p>
                            You can click the button below to toggle the color animation on or off.
                        </p>

                        <canvas ref={this.animationCanvas}>
                            Your browser does not seem to support HTML5 canvas.
                        </canvas>

                        <Button
                            variant="contained"
                            color="primary"
                            id="animation-onoff"
                            ref={this.animationButton}
                            onClick={() => this.runAnimation()}
                        >
                            Press here to {(this.state.animationStart) ? 'stop' : 'start'} the animation
                        </Button>
                    </main>
                </div>
            </Fragment>
        );
    }
}

export default App;
