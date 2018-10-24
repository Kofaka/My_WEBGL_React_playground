import React, {Component, Fragment, createRef} from 'react';
import Button from '@material-ui/core/Button';
import {mat4} from 'gl-matrix';

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
        this.cubeCanvas = createRef();
        this.getWebGl = this.getWebGl.bind(this);
        this.toggleAnimationStatus = this.toggleAnimationStatus.bind(this);
        this.toggleRectanglesAnimationStatus = this.toggleRectanglesAnimationStatus.bind(this);
        this.runAnimation = this.runAnimation.bind(this);
        this.drawSquares = this.drawSquares.bind(this);
        this.animateRectangles = this.animateRectangles.bind(this);
        this.createCube = this.createCube.bind(this);
    }

    componentDidMount() {
        this.drawSquares();
        this.createCube();
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

        if (!webgl) return;

        webgl.enable(webgl.SCISSOR_TEST);
        webgl.clearColor(...color, 1.0);
        position = [0, webgl.drawingBufferHeight];

        const drawAnimation = () => {
            let rectangleSize = [60, 60];
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

    createCube() {
        const initBuffers = gl => {
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            const positions = [
                // Front face
                -1.0, -1.0, 1.0,
                1.0, -1.0, 1.0,
                1.0, 1.0, 1.0,
                -1.0, 1.0, 1.0,

                // Back face
                -1.0, -1.0, -1.0,
                -1.0, 1.0, -1.0,
                1.0, 1.0, -1.0,
                1.0, -1.0, -1.0,

                // Top face
                -1.0, 1.0, -1.0,
                -1.0, 1.0, 1.0,
                1.0, 1.0, 1.0,
                1.0, 1.0, -1.0,

                // Bottom face
                -1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,
                1.0, -1.0, 1.0,
                -1.0, -1.0, 1.0,

                // Right face
                1.0, -1.0, -1.0,
                1.0, 1.0, -1.0,
                1.0, 1.0, 1.0,
                1.0, -1.0, 1.0,

                // Left face
                -1.0, -1.0, -1.0,
                -1.0, -1.0, 1.0,
                -1.0, 1.0, 1.0,
                -1.0, 1.0, -1.0,
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

            const faceColors = [
                [1.0, 1.0, 1.0, 1.0],    // Front face: white
                [1.0, 0.0, 0.0, 1.0],    // Back face: red
                [0.0, 1.0, 0.0, 1.0],    // Top face: green
                [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
                [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
                [1.0, 0.0, 1.0, 1.0],    // Left face: purple
            ];

            let colors = [];
            faceColors.map(color => colors.concat(color, color, color, color));

            const indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

            const indices = [
                0, 1, 2, 0, 2, 3,    // front
                4, 5, 6, 4, 6, 7,    // back
                8, 9, 10, 8, 10, 11,   // top
                12, 13, 14, 12, 14, 15,   // bottom
                16, 17, 18, 16, 18, 19,   // right
                20, 21, 22, 20, 22, 23,   // left
            ];

            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

            const colorBuffer = gl.createBuffer();

            return {
                position: positionBuffer,
                color: colorBuffer,
                indices: indexBuffer,
            };
        };

        const drawScene = (gl, programInfo, buffers) => {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clearDepth(1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            const fieldOfView = 45 * Math.PI / 180;
            const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            const zNear = 0.1;
            const zFar = 100.0;
            const projectionMatrix = mat4.create();

            mat4.perspective(projectionMatrix,
                fieldOfView,
                aspect,
                zNear,
                zFar);

            const modelViewMatrix = mat4.create();

            mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

            {
                const numComponents = 3;
                const type = gl.FLOAT;
                const normalize = false;
                const stride = 0;
                const offset = 0;
                gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
                gl.vertexAttribPointer(
                    programInfo.attribLocations.vertexPosition,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset,
                );
                gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
            }

            {
                const numComponents = 4;
                const type = gl.FLOAT;
                const normalize = false;
                const stride = 0;
                const offset = 0;
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
                gl.vertexAttribPointer(
                    programInfo.attribLocations.vertexColor,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset
                );
                gl.enableVertexAttribArray(
                    programInfo.attribLocations.vertexColor
                );
            }

            gl.useProgram(programInfo.program);

            gl.uniformMatrix4fv(
                programInfo.uniformLocations.projectionMatrix,
                false,
                projectionMatrix
            );
            gl.uniformMatrix4fv(
                programInfo.uniformLocations.modelViewMatrix,
                false,
                modelViewMatrix
            );
            {
                const offset = 0;
                const vertexCount = 4;
                gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
            }
            {
                const vertexCount = 36;
                const type = gl.UNSIGNED_SHORT;
                const offset = 0;
                gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
            }
        };

        const initShaderProgram = (gl, vsSource, fsSource) => {
            const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
            const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

            const shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
                return null;
            }

            return shaderProgram;
        };

        const loadShader = (gl, type, source) => {
            const shader = gl.createShader(type);

            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        };

        const setupCubeAnimation = () => {
            const cubeCanvas = this.cubeCanvas.current;
            const webgl = this.getWebGl(cubeCanvas);

            if (!webgl) return;

            // Vertex shader program
            const vsSource = `
                attribute vec4 aVertexPosition;
                attribute vec4 aVertexColor;
                uniform mat4 uModelViewMatrix;
                uniform mat4 uProjectionMatrix;
                varying lowp vec4 vColor;
                void main(void) {
                  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                  vColor = aVertexColor;
                }
            `;

            // Fragment shader program
            const fsSource = `
                varying lowp vec4 vColor;
                void main(void) {
                  gl_FragColor = vColor;
                }
            `;

            const shaderProgram = initShaderProgram(webgl, vsSource, fsSource);

            const programInfo = {
                program: shaderProgram,
                attribLocations: {
                    vertexPosition: webgl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                    vertexColor: webgl.getAttribLocation(shaderProgram, 'aVertexColor'),
                },
                uniformLocations: {
                    projectionMatrix: webgl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                    modelViewMatrix: webgl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
                },
            };

            const buffers = initBuffers(webgl);

            drawScene(webgl, programInfo, buffers);
        };

        setupCubeAnimation();
    }

    render() {
        const animationBlock = (
            <Fragment>
                <p>You can click the button below to toggle the color animation on or off.</p>
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
            <div className="App">
                <header className="App-header">
                    A simple WebGL program that shows color animation.
                </header>

                <main>
                    <section>
                        <canvas ref={this.cubeCanvas} width="640" height="480">
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

                    <section>
                        <canvas ref={this.drawSecondCanvas}>
                            Your browser does not seem to support HTML5 canvas.
                        </canvas>
                    </section>

                    <section>
                        <canvas ref={this.drawingCanvas}>
                            Your browser does not seem to support HTML5 canvas.
                        </canvas>
                    </section>

                    <section>
                        {this.state.errorMessage ? <p>{this.state.errorMessage}</p> : animationBlock}
                    </section>
                </main>
            </div>
        );
    }
}

export default App;
