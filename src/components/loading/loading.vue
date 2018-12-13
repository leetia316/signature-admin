<template>
    <div class="loading">
        <img src="./loading.gif" width="35" height="35">
        <p>{{text}}</p>
    </div>
</template>

<script>
    export default {
        props: {
            text: {
                type: String,
                default: '加载中...'
            }
        }
    }
</script>

<style scoped>

    .loading {
        width: 100%;
        height:100%;
        z-index: 1999;
        top:0;
        left:0;
        position:absolute;
        color:#9f9f9f;
        /*height: 40px;*/
        text-align: center;
    }
    img {
        margin-top: 50%;
        /*display: block;*/
    }
        p{
            padding: 15px 0;
            color:gray;
            font-size:14px;
        }

</style>
