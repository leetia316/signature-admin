<template>
    <div style="display: flex">
        <div>
            <img :src="require('./pic.jpg')" id="img" style="display: none"/>
        </div>
        <div class="canvas-container" v-show="isShowCanvas">
            <canvas id="canvas"></canvas>
            <div id="container">
                <canvas id="canvasbg"></canvas>
            </div>
        </div>
        <Card :bordered="false"  dis-hover>
            <p slot="title">操作</p>
            <div style="margin-left: 10px;border-left: 1px solid red;padding: 10px">
                <img id="sign" style="width: 100px;height: 50px"/>
                <vueSignature ref="signature" :sigOption="option" :w="'150px'" :h="'100px'"></vueSignature>
                <button @click="save">保存</button>
                <button @click="clear">清除</button>
                <button @click="rotate">旋转</button>
            </div>
        </Card>
    </div>
</template>

<script>
    import VueSignature from "./vue-signature";
    const throttle = function throttle(fun, delay) { //节流
        let last, deferTimer
        return function (args) {
            let that = this
            let _args = arguments
            let now = +new Date()
            if (last && now < last + delay) {
                clearTimeout(deferTimer)
                deferTimer = setTimeout(function () {
                    last = now
                    fun.apply(that, _args)
                }, delay)
            }else {
                last = now
                fun.apply(that,_args)
            }
        }
    }
    function debounce(fun, delay) {  //去抖
        return function (args) {
            let that = this
            let _args = args
            clearTimeout(fun.id)
            fun.id = setTimeout(function () {
                fun.call(that, _args)
            }, delay)
        }
    }

    export default {
        name: "index",
        components: {VueSignature},
        data() {
            const validateUpload = (rule, value, callback) => {
                callback();
            };
            return {
                startX: 0,
                startY: 0,
                cW: 0,
                cH: 0,
                option: {
                    penColor: "rgb(0, 0, 0)",
                },
                imageUrl: "",
                isShowCanvas: false,
                userId:{userId:1}
            };
        },
        computed: {},

        created() {
        },

        mounted() {
            document.getElementById('img').onload = () => {
                this.convertImageToCanvas(document.getElementById('img'))
            }
        },


        methods: {
            rotate(){
                let canvas = document.getElementById("canvas");
                let context = canvas.getContext('2d');
                let image = document.getElementById('img');
                let x = canvas.width/2; //画布宽度的一半
                let y = canvas.height/2;//画布高度的一半
                context.clearRect(0,0, canvas.width, canvas.height);//先清掉画布上的内容
                context.translate(x,y);//将绘图原点移到画布中点
                context.rotate(Math.PI/2);//旋转角度
                context.translate(-x,-y);//将画布原点移动
                context.drawImage(image,0,0);//绘制图片
            },
            // 把image 转换为 canvas对象
            convertImageToCanvas(image) {
                this.isShowCanvas = true;
                // 创建canvas DOM元素，并设置其宽高和图片一样
                let canvas = document.getElementById("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                console.log(image.height)
                // 坐标(0,0) 表示从此处开始绘制，相当于偏移。
                canvas.getContext("2d").drawImage(image, 0, 0);
                let context = canvas.getContext('2d')
                let canvasbg = document.getElementById("canvasbg");
                canvasbg.width = image.width;
                canvasbg.height = image.height;
                let ctx = canvasbg.getContext("2d");
                ctx.lineWidth = 1;
                ctx.fillStyle = "#ffffff";
                let start = false;
                let x1, y1, x2, y2;
                const test = function (x,y) {
                    console.log("X:" +x + ", Y:" +y);
                    ctx.clearRect(x1, y1,x - x1,y - y1);
                    // ctx.strokeRect(x1, y1,e.offsetX - x1,e.offsetY - y1);
                    ctx.fillRect(x1, y1,x - x1,y - y1);
                }
                const drawRect = throttle(test,100)
                canvasbg.addEventListener('mousemove', (e) => {
                    if (start) {
                        drawRect(e.offsetX, e.offsetY)
                    }
                });
                canvasbg.addEventListener('mousedown', (e)=> {
                    console.log("mouse down:");
                    start = true;
                    x1 = e.offsetX;
                    y1 = e.offsetY;
                    this.startX = x1;
                    this.startY = y1;
                });
                canvasbg.addEventListener('mouseup', (e)=> {
                    x2 = e.offsetX;
                    y2 = e.offsetY;
                    // ctx.stroke();
                    start = false;
                    console.log("x1,y1,x2,y2:" + x1 + "," + y1 + "," + x2 + "," + y2);
                    this.cW = x2 - x1;
                    this.cH =  y2 - y1;
                    // context.lineWidth = 1;
                    // context.strokeRect(this.startX, this.startY, this.cW, this.cH);
                });
            },
            save() {
                let _this = this;
                console.log(_this.$refs.signature)
                let png = _this.$refs.signature.save()
                // let jpeg = _this.$refs.signature.save('image/jpeg')
                // let svg = _this.$refs.signature.save('image/svg+xml');
                let canvas = document.getElementById("canvas");
                let context = canvas.getContext('2d');
                let sign = document.getElementById('sign')
                sign.src = png;
                sign.onload = () => {
                    console.log( this.startX+'---'+ this.startY+'---'+ this.cW+'---'+ this.cH)
                    context.drawImage(sign, this.startX, this.startY, this.cW, this.cH);
                    document.getElementById('canvasbg').getContext('2d').drawImage(sign, this.startX, this.startY, this.cW, this.cH);
                }

                console.log(png);
                // console.log(jpeg)
                // console.log(svg)
            },
            clear() {
                let _this = this;
                _this.$refs.signature.clear();
            },
            reset(){
                this.convertImageToCanvas(document.getElementById('img'));
                this.startX = 0;
                this.startY = 0;
            }
        }
    }
</script>

<style scoped>
    canvas {
        width: auto;
        height: auto;
        border: none;
        box-sizing: border-box;
    }

    #img {
        width: 210mm;
        height: 297mm;
    }

    .canvas-container {
        /*width: 48%;*/
        position: relative
    }

    #container {
        width: 50%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 100;
    }

    /*#canvas {*/
    /*width: 100%;*/
    /*height: 100%;*/
    /*}*/

    /*#canvasbg {*/
    /*width: 100%;*/
    /*height: 100%;*/
    /*}*/
    #canvasbg{
        transition: all .8s ease-in-out;
    }
    #canvasbg:hover {
        background-color: rgba(206, 206, 206, 0.56);
        cursor: crosshair;
    }
</style>