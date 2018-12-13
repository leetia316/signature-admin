<template>
    <div>
        <van-nav-bar
                title="创建申请"
                left-text="返回"
                left-arrow
                @click-left="toBack">
        </van-nav-bar>
        <Loading v-show="loading"/>
        <div class="main">
            <van-cell-group >
                <van-field
                        id="myName"
                        v-model="name"
                        required
                        clearable
                        label="流程名称"
                        placeholder="请输入流程名称">
                </van-field>
                <van-cell title="提交失败重新审批">
                    <van-radio-group v-model="failRepeat" >
                        <van-radio name="1" style="float: left">是</van-radio>
                        <van-radio name="2" style="float: right">否</van-radio>
                    </van-radio-group>
                </van-cell>
                <van-cell  required title="审批图片">
                    <span style="float: left;">{{uploadImgName}}</span>
                 <!--   <Button @click="toCamera">选择文件</Button>-->
                    <a onclick="testUpLoad()">选择文件</a>
                  <!--  <button  style='margin-left: 3px;' @click="toPhoto">测试按钮</button>-->
                    <!--<van-uploader :after-read="onRead" :before-read="toCamera" accept="image/gif, image/jpeg" capture="camera">
                        <van-icon name="photograph" />
                    </van-uploader>-->
                </van-cell>
              <!--  <van-field
                        v-model="url"
                        label="params"
                        type="textarea"
                        placeholder=""
                        rows="2"
                        autosize>
                </van-field>
                <van-field
                        id="testW"
                        v-model="msg"
                        label="msg"
                        type="textarea"
                        placeholder=""
                        rows="3"
                        autosize>
                </van-field>-->
                <van-field
                    id="myRemark"
                    v-model="remark"
                    label="备注"
                    type="textarea"
                    placeholder="请输入"
                    rows="3"
                    autosize></van-field>
                <div style="padding: 15px">
                    <van-button size="danger" block @click="toSubmit">提交</van-button>
                </div>
            </van-cell-group>
        </div>
    </div>
</template>

<script>
    import Toast from "vant/es/toast/index";
    import {getToken} from "../../common/js/common";
    import qs from 'qs'
    let strPercent = "", strSuccess = "";
    let failRepeat_global = "1";
    window.testUpLoad = function(){
       /* let fileData = JSON.parse(localStorage.getItem('Filemsg'));
        if(fileData){
            this.afterUpload(fileData);
        }*/
      let failR = (failRepeat_global === "1");
       let name = document.getElementById("myName").value;
        if(!name){
            alert('请输入流程名称!');
            return;
        }
        // let str = encodeURI("http://210.12.193.17:8977/rxswt/procedure/mobileAdd?userId=" + this.userId + "&name=" + this.name + "&failRepeat=" + parseFloat(this.failRepeat) + "&id=" + this.fileId);
        let str = encodeURI("http://210.12.193.17:8977/rxswt/procedure/mobileAdd?userId=" + JSON.parse(localStorage.getItem("userInfo")).id + "&name=" + name + "&failRepeat=" + failR + "&id=" +  (localStorage.getItem("fileId") || ""));
        // let str =  encodeURI("http://210.12.193.17:8977/rxswt/procedure/mobileAdd?userId=1&name=1&failRepeat=true");
        let params = {
            "mediaType":"1",
            "url":str,
            "success":"uploadResultCallBackSuccess",
            "fail":"upError",
            "percent":"upPercent"
        };
        new RuixinApi().selectResourceAndUpload(params);
    };
    window.afterUploadWin = function (msg) {  //注册全局方法
        Toast("上传成功");
        localStorage.setItem('Filemsg', JSON.stringify(msg))
    };
    window.uploadResultCallBackSuccess = function (msg) {
        Toast("上传成功");
        Toast.clear();
       /* strSuccess += JSON.stringify(msg);
        document.getElementById("testW").innerText = strSuccess;*/
        localStorage.setItem('Filemsg', JSON.stringify(msg));
    };
    window.upError = function (msg) {
        Toast("上传失败");
        localStorage.removeItem('Filemsg');
    };
    window.upPercent = function(msg){
        // let percentData = JSON.parse(msg);
     /*   strPercent += JSON.stringify(msg);
      document.getElementById("myRemark").innerText = strPercent;*/
         Toast.loading({
            mask: false,
            type: 'loading',
            duration: 0,
            forbidClick: true,
            loadingType: 'spinner',
            message: '上传中...'
        });
        /*if(percentData.percent === 1){
            Toast.clear();
        }*/
    };
    export default {
        name: "createForm",
        data(){
            return {
                url: "",
                msg:"",
                sendData:"",
                userId: getToken(),
                loading: false,
                signShow: false,
                id: null,
                fileId: "",
                name: '',
                file:null,
                failRepeat: "1",
                remark: '',
                isUploadImg: false,
                uploadImgName: "",
                ruixin : new RuixinApi()
            }
        },
        created (){

        },
        destroyed (){
            Toast.clear();
        },
        watch: {
            "fileId":function(newV,oldV){
                localStorage.setItem("fileId",newV);
            },
            "failRepeat": function(newV,oldV){
                failRepeat_global = newV;
            }
        },
        methods: {
            toBack(){
                if(this.$route.params.processId){
                    this.$router.push({
                        name: 'myApplyDetail',
                        params: {
                            processId: this.$route.params.processId
                        }
                    });
                }else{
                    this.$router.back();
                }
            },
            test(){
                window.location.href="http://10.88.148.91:8080/audit"
            },
            onRead (file){
                /*if(file){
                    this.isUploadImg = true;
                    this.uploadImgName = file.file.name;
                    this.file = file.file;
                }else{
                    Toast("文件选择失败");
                }*/

            },
            toPhoto (){
                window.upPercent();
                // this.ruixin.selectResource({'success':'afterUpload'});
               /* window.upSuccess2(
                    {"result":0,"data":{"result":0,"errorDesc":"59304b30463f4514a7ea460d20be2428","data":{"result":"0","fileid":"59304b30463f4514a7ea460d20be2428"},"filePath":"http://10.22.143.9:8977/files/c4ca4238a0b92382/src/1252fd370f1c43668961378fa4c4cfe7.jpg","fileid":"59304b30463f4514a7ea460d20be2428"},"errMsg":"selectResourceAndUpload:ok"}
                );*/
                // this.$router().push("/toPhoto");
            },
            afterUpload(data){
                this.fileId = data.data.data.fileid;
                this.isUploadImg = true;
                // this.file = data.filePath;
            },
            toCamera(){
                /*this.ruixin.selectResource({
                    "success":'afterUploadWin'
                });*/
                let fileData = JSON.parse(localStorage.getItem('Filemsg'));
                if(fileData){
                    this.afterUpload(fileData);
                }
                let str = encodeURI("http://210.12.193.17:8977/rxswt/procedure/mobileAdd?userId=" + this.userId + "&name=" + this.name + "&failRepeat=" + parseFloat(this.failRepeat) + "&id=" + this.fileId);
                // let str =  encodeURI("http://210.12.193.17:8977/rxswt/procedure/mobileAdd?userId=1&name=1&failRepeat=true");
                let params = {
                    "mediaType":"1",
                    "url":str,
                    "success":"upSuccess2",
                    "fail":"upError",
                    "percent":"upPercent"
                };
                this.url = JSON.stringify(params);
                this.ruixin.selectResourceAndUpload(params);
            },
            toSubmit(){
                let procedureEntity = {};
                let fileData = JSON.parse(localStorage.getItem('Filemsg'));
                if(fileData){
                    this.afterUpload(fileData);
                }
                if(!this.fileId || !this.name){
                    return this.$Message.error('请检查必填项!');
                }
            // this.msg = JSON.stringify(fileData);
                procedureEntity.id = this.fileId;
                procedureEntity.name = this.name;
                procedureEntity.remark = this.remark;
                procedureEntity.failRepeat = parseFloat(this.failRepeat);
            // this.sendData = JSON.stringify(procedureEntity);
                this.loading = true;
                this.axios.post('/rxswt/procedure/update',procedureEntity,{
                    headers: {
                        'Content-Type':'application/json; charset=UTF-8'
                    }
                }).then(res=>{
                    if(res.data.code === 200){
                        let _this = this;
                        Toast("保存成功");
                        setTimeout(function(){
                            _this.$router.push("/myApply");
                        },1000)
                    }else{
                        Toast("保存失败");
                    }
                    this.$nextTick(()=>{
                        this.loading = false;
                    });
                }).catch(err=>{
                    this.$Message.warning(err);
                })
               /* let file = this.file;
                let formdata1 = new FormData();
                formdata1.append('file',file,file.name || "");
                formdata1.append("userId",this.userId);
                formdata1.append("name",this.name);
                formdata1.append("failRepeat",this.failRepeat === "1");
                formdata1.append("remark",this.remark);
                let config = {
                    headers:{'Content-Type':'multipart/form-data'}
                };  //添加请求头
                this.loading = true;
                this.axios.post('/rxswt/procedure/add',formdata1,config).then(res=>{
                    if(res.data.code === 200){
                        Toast(res.data.message);
                        let data = res.data.data;
                        this.$router.push("/myApply");
                    }else{
                        Toast(res.data.message);
                    }
                    this.$nextTick(()=>{
                        this.loading = false;
                    });
                }).catch(err=>{
                    this.loading = false;
                })*/
            }

        }
    }
</script>

<style scoped>

</style>