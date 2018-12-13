<!--
<template>
    <div :style="{width:w,height:h}">
        <canvas :id="uid" class="canvas" :data-uid="uid"></canvas>
    </div>

</template>

<script>
    import SignaturePad from 'signature_pad'
    export default {
        name:"vueSignature",
        props:{
            sigOption: {
                type:Object,
                default:()=>{
                    return {
                        backgroundColor:'rgb(255,255,255)',
                        penColor : 'rgb(0, 0, 0)'
                    }
                },
            },
            w:{
                type:String,
                default:"100%"
            },
            h:{
                type:String,
                default:"100%"
            },
            clearOnResize:{
                type:Boolean,
                default:false
            }
        },
        data(){
            return {
                sig:()=>{},
                option:{
                    backgroundColor:'rgb(255,255,255)',
                    penColor : 'rgb(0, 0, 0)'
                },
                uid:""
            }
        },
        created(){
            let _this = this;
            this.uid = "canvas" + _this._uid
            let sigOptions = Object.keys(_this.sigOption);
            for(let item of sigOptions){
                _this.option[item] = _this.sigOption[item]
            }
        },
        methods:{
            draw(){
                let _this = this;
                let canvas = document.getElementById(_this.uid)
                _this.sig = new SignaturePad(canvas,_this.option);
                function resizeCanvas() {
                    let url;
                    if(!_this.isEmpty()){
                        url = _this.save();
                    }
                    let ratio =  Math.max(window.devicePixelRatio || 1, 1);
                    canvas.width = canvas.offsetWidth * ratio;
                    canvas.height = canvas.offsetHeight * ratio;
                    canvas.getContext("2d").scale(ratio, ratio);
                    _this.clear();
                    !_this.clearOnResize && url !== undefined && _this.fromDataURL(url)
                }
                window.addEventListener("resize", resizeCanvas);
                resizeCanvas();
            },
            clear(){
                let _this = this;
                _this.sig.clear();
            },
            save(format){
                let _this = this;
                console.log( _this.sig)
                return format ? _this.sig.toDataURL(format) :  _this.sig.toDataURL()
                // signaturePad.toDataURL(); // save image as PNG
                // signaturePad.toDataURL("image/jpeg"); // save image as JPEG
                // signaturePad.toDataURL("image/svg+xml"); // save image as SVG
            },
            fromDataURL(url){
                let _this = this;
                _this.sig.fromDataURL(url)
            },
            isEmpty(){
                let _this = this;
                return _this.sig.isEmpty();
            },
            undo(){
                let _this = this;
                let data = _this.sig.toData();
                if(data){
                    data.pop()
                    _this.sig.fromData(data);
                }
            },
            addWaterMark(data){
                let _this = this;
                if(!(Object.prototype.toString.call(data) == '[object Object]')){
                    throw new Error("Expected Object, got "+typeof data+".")
                }else{
                    let vCanvas = document.getElementById(_this.uid);
                    let textData = {
                        text:data.text || '',
                        x:data.x || 20,
                        y:data.y || 20,
                        sx:data.sx || 40,
                        sy:data.sy || 40
                    }

                    let ctx = vCanvas.getContext('2d');
                    ctx.font = data.font || '20px sans-serif';
                    ctx.fillStyle = data.fillStyle || "#333";
                    ctx.strokeStyle = data.strokeStyle || "#333";
                    if(data.style == 'all'){
                        ctx.fillText(textData.text,textData.x,textData.y);
                        ctx.strokeText(textData.text,textData.sx,textData.sx);
                    }else if(data.style == 'stroke'){
                        ctx.strokeText(textData.text,textData.sx,textData.sx);
                    }else{
                        ctx.fillText(textData.text,textData.x,textData.y);
                    }
                    _this.sig._isEmpty = false
                }
            }
        },
        mounted(){
            let _this = this;
            this.$nextTick(() => {
                _this.draw()
            });
        }
    }
</script>

<style>
    canvas {
        width: 100%;
        height: 100%;
        border: 1px solid #409EFF;
    }
</style>-->
