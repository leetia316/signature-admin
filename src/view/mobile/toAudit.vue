<template>
    <div>
        <van-nav-bar
                title="流程详情"
                left-text="返回"
                right-text="查看表单"
                left-arrow
                @click-right="viewProcessChart"
                @click-left="$router.push('/audit')">
        </van-nav-bar>
        <Loading v-show="loading"/>
        <div class="main">
            <van-cell-group >
                <van-cell title="流程名称"  :value="detailData.pName"></van-cell>
                <van-cell title="申请人"  :value="detailData.applyUser" ></van-cell>
                <van-cell title="申请部门"  :value="detailData.applyDept"></van-cell>
                <van-cell title="申请时间"  :value="detailData.applyDate" ></van-cell>
                <van-cell title="是否通过"  >
                   <!-- <van-switch v-model="pass" />-->
                    <van-radio-group v-model="pass" >
                        <van-radio name="1" style="float: left">是</van-radio>
                        <van-radio name="0" style="float: right">否</van-radio>
                    </van-radio-group>
                </van-cell>
                <van-cell title="上传签名" icon="photo" @click="enterSign" v-show="lastTabIndex">
                </van-cell>
                <van-field
                    v-model="message"
                    label="审批意见"
                    type="textarea"
                    placeholder="请输入审批意见"
                    rows="2"
                    autosize></van-field>
                <div style="padding: 15px" v-show="lastTabIndex">
                    <van-button size="danger" block @click="toApprove">审批</van-button>
                </div>
            </van-cell-group>
        </div>
    </div>
</template>

<script>
    import Toast from "vant/es/toast/index";
    import {getToken} from "../../common/js/common";
    import qs from 'qs'
    import ImagePreview from "vant/es/image-preview/index";
    export default {
        name: "toAudit",
        data(){
            return {
                userId: getToken(),
                procdureId: "",
                procedureStepId: "",
                procedureStepDetailId:"",
                loading: false,
                signShow: false,
                message:  "",
                pass:  "1",
                checked: true,
                detailData:{
                    imgUrl: "",
                    pName: "",
                    applyUser: "",
                    applyDept: "",
                    applyDate: "",
                },
                lastTabIndex: !this.$route.params.tabIndex
            }
        },
        created (){
            console.log(this.$route.params.message);
            console.log(this.$route.params.pass);
            this.getItems();

        },
        methods: {
            viewProcessChart(){
                if(this.detailData.imgUrl){
                    ImagePreview({
                        images: [this.detailData.imgUrl],
                        // startPosition: 1,
                        onClose() {
                            // do something
                        }
                    });
                }else{
                    Toast("没有图片");
                }
            },
            toApprove(){
                // if(this.$route.params.hasUploadImage){
                    let sendData = {
                        userId:this.userId,
                        procedureStepDetailId: this.procedureStepDetailId,
                        procedureStepId: this.procedureStepId,
                        procedureId: this.procdureId,
                        comment: this.message,
                        pass: this.pass === "1"
                    };

                    this.loading = true;
                    this.axios.post('/rxswt/user/approve',qs.stringify(sendData),{
                        headers: {
                            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(res=>{
                        Toast(res.data.message);
                        if(res.data.code === 200){
                            this.$router.push({
                                name: 'audit'
                            });
                            this.$nextTick(()=>{
                                this.loading = false;
                            });
                        }else if(res.data.code === 401){
                            Toast("请上传签名");
                            this.enterSign();
                        }else{
                            Toast(res.data.message);
                            this.loading = false;
                        }
                    }).catch(err=>{
                        this.loading = false;
                    })
                /*}else{
                    Toast("请上传签名图片");
                }*/
            },
            enterSign(){
                this.$router.push({
                    name: 'toSign',
                    params: {
                        procedureDetailId: this.procedureDetailId,
                        pass: this.pass,
                        message: this.message
                    }
                });
            },
            getItems(){
                this.loading = true;
                // 取到路由带过来的参数
                this.procedureDetailId = this.$route.params.procedureDetailId;
                let url = "/rxswt/user/getAuditInfo" + "?userId=" + this.userId + "&procedureDetailId=" + this.procedureDetailId;
                this.axios.get(url,{
                    headers: {
                        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code === 200 && JSON.stringify(res.data.data) !== "{}") {
                        console.log(res.data.data);
                        this.procedureStepDetailId = res.data.data.procedureStepDetailId;
                        this.procedureStepId = res.data.data.procedureStepId;
                        this.procedureId = res.data.data.procdureId;
                        this.detailData.pName = res.data.data.pname;
                        this.detailData.applyUser = res.data.data.applyName;
                        this.detailData.applyDept = res.data.data.applyDept;
                        this.detailData.applyDate =  new Date(res.data.data.applyDate).Format("yyyy-MM-dd hh:mm:ss");
                        this.detailData.imgUrl = res.data.data.accessTarget;
                        this.pass = res.data.data.pass + "";
                        this.message = res.data.data.comment;
                        if(this.$route.params.message){
                            this.message = this.$route.params.message;
                        }
                        if(this.$route.params.pass){
                            this.pass = this.$route.params.pass;
                        }
                    }else if(res.data.code !== 200) {
                        Toast(res.data.message);
                    }
                    this.$nextTick(() => {
                        this.loading = false;
                    })
                }).catch(err => {
                    this.loading = false;
                });
            }
        }
    }
</script>

<style scoped>

</style>