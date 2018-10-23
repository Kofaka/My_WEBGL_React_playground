import React, {Component, Fragment, createRef} from 'react';
import Button from '@material-ui/core/Button';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            animationStart: false,
            errorMessage: '',
        };

        this.animationButton = createRef();
        this.animationCanvas = createRef();
        this.drawingCanvas = createRef();
        this.drawSecondCanvas = createRef();
        this.getRandomColor = this.getRandomColor.bind(this);
        this.getWebGl = this.getWebGl.bind(this);
        this.toggleAnimationStatus = this.toggleAnimationStatus.bind(this);
        this.runAnimation = this.runAnimation.bind(this);
        this.drawSquares = this.drawSquares.bind(this);
    }

    componentDidMount() {
        this.drawSquares();
    }

    getRandomColor() {
        return [Math.random(), Math.random(), Math.random()];
    };

    getWebGl(canvas, noWebGlCb) {
        let result = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!result) {
            noWebGlCb && noWebGlCb();
            this.setState({
                errorMessage: `Failed to get WebGL context.\n Your browser or device may not support WebGL.`
            });
            return;
        }

        result.viewport(0, 0, result.drawingBufferWidth, result.drawingBufferHeight);

        return result;
    }

    toggleAnimationStatus() {
        this.setState({
            animationStart: !this.state.animationStart
        });
    }

    runAnimation() {
        const animationCanvas = this.animationCanvas.current;
        let timer = null;
        let webgl;

        const setTimer = () => timer = setInterval(drawAnimation, 500);
        const clearTimer = () => clearInterval(timer);

        const drawAnimation = () => {
            if (this.state.animationStart) {
                webgl = this.getWebGl(animationCanvas, clearTimer);
                webgl.clearColor(...this.getRandomColor(), 1.0);
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

    drawSquares() {
        const drawCanvas = this.drawingCanvas.current;
        const drawSecondCanvas = this.drawSecondCanvas.current;

        drawCanvas.width = drawCanvas.clientWidth;
        drawCanvas.height = drawCanvas.clientHeight;

        [drawCanvas, drawSecondCanvas].forEach(item => {
            let rendingContext = this.getWebGl(item);

            rendingContext.enable(rendingContext.SCISSOR_TEST);
            rendingContext.scissor(40, 20, 60, 130);

            rendingContext.clearColor(1.0, 1.0, 0.0, 1.0);
            rendingContext.clear(rendingContext.COLOR_BUFFER_BIT);
        });
    };

    render() {
        const animationBlock = (
            <Fragment>
                <canvas ref={this.animationCanvas}>
                    Your browser does not seem to support HTML5 canvas.
                </canvas>

                <Button
                    variant="contained"
                    color="primary"
                    ref={this.animationButton}
                    onClick={() => this.runAnimation()}
                >
                    Press here to {(this.state.animationStart) ? 'stop' : 'start'} the animation
                </Button>
            </Fragment>
        );

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

                        <section>
                            {this.state.errorMessage ? <p>{this.state.errorMessage}</p> : animationBlock}
                        </section>

                        <section>
                            <canvas ref={this.drawingCanvas}>
                                Your browser does not seem to support HTML5 canvas.
                            </canvas>
                        </section>

                        <section>
                            <canvas ref={this.drawSecondCanvas}>
                                Your browser does not seem to support HTML5 canvas.
                            </canvas>
                        </section>
                    </main>
                </div>
            </Fragment>
        );
    }
}

export default App;
