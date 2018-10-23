import React, {Component, Fragment, createRef} from 'react';
import Button from '@material-ui/core/Button';

import './App.css';

const getRandomColor = () => [Math.random(), Math.random(), Math.random()];
const setTimer = (timer, cb, interval = 500) => setInterval(cb, interval);
const clearTimer = (timer) => clearInterval(timer);

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            animationStart: false,
            rectanglesAnimationStart: false,
            errorMessage: '',
        };

        this.animationButton = createRef();
        this.drawThirdCanvasAnimationButton = createRef();
        this.animationCanvas = createRef();
        this.drawingCanvas = createRef();
        this.drawSecondCanvas = createRef();
        this.drawThirdCanvas = createRef();
        this.getWebGl = this.getWebGl.bind(this);
        this.toggleAnimationStatus = this.toggleAnimationStatus.bind(this);
        this.toggleRectanglesAnimationStatus = this.toggleRectanglesAnimationStatus.bind(this);
        this.runAnimation = this.runAnimation.bind(this);
        this.animateRectangles = this.animateRectangles.bind(this);
        this.drawSquares = this.drawSquares.bind(this);
    }

    componentDidMount() {
        this.drawSquares();
    }

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

    toggleRectanglesAnimationStatus() {
        this.setState({
            rectanglesAnimationStart: !this.state.rectanglesAnimationStart
        });
    }

    runAnimation() {
        const animationCanvas = this.animationCanvas.current;
        let timer = null;
        let webgl;

        const drawAnimation = () => {
            if (this.state.animationStart) {
                webgl = this.getWebGl(animationCanvas, clearTimer);
                webgl.clearColor(...getRandomColor(), 1.0);
                webgl.clear(webgl.COLOR_BUFFER_BIT)
            }
        };

        if (this.state.animationStart) {
            this.toggleAnimationStatus();
            clearTimer(timer);

        } else if (!this.state.animationStart) {
            this.toggleAnimationStatus();
            setTimer(timer, drawAnimation);
            drawAnimation();
        }
    }

    drawSquares() {
        const drawCanvas = this.drawingCanvas.current;
        const drawSecondCanvas = this.drawSecondCanvas.current;

        drawCanvas.width = drawCanvas.clientWidth;
        drawCanvas.height = drawCanvas.clientHeight;

        [drawCanvas, drawSecondCanvas].forEach(item => {
            let renderingContext = this.getWebGl(item);

            renderingContext.enable(renderingContext.SCISSOR_TEST);
            renderingContext.scissor(40, 20, 60, 130);

            renderingContext.clearColor(1.0, 1.0, 0.0, 1.0);
            renderingContext.clear(renderingContext.COLOR_BUFFER_BIT);
        });
    };

    animateRectangles() {
        const drawThirdCanvas = this.drawThirdCanvas.current;
        let webgl = this.getWebGl(drawThirdCanvas);
        let color = getRandomColor();
        let position = null;
        let timer = null;

        webgl.enable(webgl.SCISSOR_TEST);
        webgl.clearColor(...color, 1.0);
        position = [0, webgl.drawingBufferHeight];

        const drawAnimation = () => {
            let rectangleSize = [60,60];
            let rectangleVelocity = 3.0;

            if (this.state.rectanglesAnimationStart) {
                webgl.scissor(...position, ...rectangleSize);
                webgl.clear(webgl.COLOR_BUFFER_BIT);

                position[1] -= rectangleVelocity;

                if (position[1] < 0) {
                    position = [
                        Math.random() * webgl.drawingBufferWidth - rectangleSize[0],
                        webgl.drawingBufferHeight,
                    ];
                    rectangleVelocity = 1.0 + 6.0 * Math.random();
                    webgl.clearColor(...getRandomColor(), 1.0);
                }
            }
        };

        if (this.state.rectanglesAnimationStart) {
            this.toggleRectanglesAnimationStatus();
            clearTimer(timer);

        } else if (!this.state.rectanglesAnimationStart) {
            this.toggleRectanglesAnimationStatus();
            setTimer(timer, drawAnimation, 17);
            drawAnimation();
        }
    }

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

                        <section>
                            <canvas ref={this.drawThirdCanvas}>
                                Your browser does not seem to support HTML5 canvas.
                            </canvas>

                            <Button
                                variant="contained"
                                color="primary"
                                ref={this.drawThirdCanvasAnimationButton}
                                onClick={() => this.animateRectangles()}
                            >
                                Press here to {(this.state.rectanglesAnimationStart) ? 'stop' : 'start'} the animation
                            </Button>
                        </section>
                    </main>
                </div>
            </Fragment>
        );
    }
}

export default App;
