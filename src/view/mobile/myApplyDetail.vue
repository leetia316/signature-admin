<template>
    <div>
        <div>
            <van-nav-bar
                :title= "processName"
                left-text="返回"
                left-arrow
                right-text="查看表单"
                @click-right="viewChart"
                @click-left="onClickLeft">
            </van-nav-bar>
        </div>
        <van-collapse  disabled v-model="activeNames" v-for="(processItem,index) of processList" @change="findAuditPerson(activeNames, index, processItem.id)">
            <van-collapse-item  :name="index" border>
            <div slot="title">步骤名称：{{processItem.name}}
                <van-tag style="float: right" type="primary" v-if="processItem.proccess === 1">提交审批</van-tag>
                <van-tag style="float: right" type="warning" v-else-if="processItem.proccess !== 1">未审批</van-tag>
            <div v-show="processItem.showFlag" style="margin-left: 5%;font-size: 16px;border-bottom: 1px solid gainsboro; padding: 5px;" v-for="personItem of processItem.auditList">
                <div style="display: flex">
                    <div style="width:80%">
                        <div style="float: left;">
                            <span style=""><span style="color: green">审批人：</span>{{personItem.refUserName}}</span>
                        </div>
                    </div><br/>
                    <div style="width:20%;text-align:center;justify-content:center;display:flex;-webkit-align-items:center;
                            align-items:center;">
                        <van-tag type="primary" v-if="personItem.pass === 1">通过</van-tag>
                        <van-tag type="danger" v-else-if="personItem.pass === 0">不通过</van-tag>
                        <van-tag type="warning" v-else>未审批</van-tag>
                    </div>
                </div>
                <div style="">
                    <span style=""><span style="color: darkred">意见：</span>{{personItem.comment}}</span>
                </div>
            </div>
            </div>
        </van-collapse-item>
        </van-collapse>
<!--        <div>

            <van-list
                v-model="loading"
                :finished="finished"
                @load="onLoad"
            >

                <van-cell
                    v-for="(item,index) in list"
                    :key="index"
                    >

                    &lt;!&ndash;<div style=" display: flex;" @click="viewMyApply(item.procdureId)">
                        <div style="width:85%">
                            <div style="float: left;padding:5px 0;font-size: 22px;font-weight: bold">
                                <span>{{item.pname}}</span>
                            </div>
                        </div>
                        <div style="width:15%;text-align:center;justify-content:center;display:flex;-webkit-align-items:center;
                            align-items:center;">
                            <van-tag type="primary">审批中</van-tag>
                           &lt;!&ndash; <van-tag type="danger">待提交</van-tag>
                            <van-tag type="success">审批完成</van-tag>&ndash;&gt;
                        </div>
                    </div>&ndash;&gt;
                </van-cell>
            </van-list>
        </div>-->
        <div style="padding: 15px;position:fixed;bottom:10px;width:100%">
            <van-button size="danger" block @click="toCreateForm">创建申请</van-button>
        </div>
        </div>
</template>

<script>
    import {getToken} from "../../common/js/common";
    import Toast from "vant/es/toast/index";
    import ImagePreview from "vant/es/image-preview/index";

    export default {
        name: "myApplyDetail",
        data() {
            return {
                acceptTarget:"",
                processName:"",
                processId: "",
                activeNames: [],
                list: [],
                loading: false,
                finished: false,
                processList: [],
                auditList: []
            };
        },
        created() {
            if(!this.$route.params.processId){
                Toast("流程id不存在");
            }else{
                this.processId = this.$route.params.processId;
                this.getItems();
            }
        },
        methods: {
            toCreateForm(){
                this.$router.push({
                    name: 'createForm',
                    params: {
                        processId: this.processId,
                    }
                });
            },
            viewChart(){
                if(this.acceptTarget){
                    ImagePreview({
                        images: [this.acceptTarget],
                        // startPosition: 1,
                        onClose() {
                            // do something
                        }
                    });
                }else{
                    Toast("没有图片");
                }
            },
            findAuditPerson(activeNames, index, auditId){
                let isExist = false;
                for(let i = 0; i < activeNames.length; i++){
                    if(index === activeNames[i]){
                        isExist = true;
                    }
                }
                this.processList[index].showFlag = !isExist;
                if(this.processList[index].auditList.length > 0){
                    return false;
                }
                    let url = "/rxswt/procedure/listStepDetail" + "?procedureStepId=" + auditId;
                    this.axios.get(url,{
                        headers: {
                            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(res => {
                        this.finished = true;
                        if (res.data.code === 200 && res.data.data.length > 0) {
                            this.processList[index].auditList = res.data.data;
                            if(res.data.data.length === 0){
                                Toast("暂无步骤审批人");
                            }
                        }
                        this.$nextTick(() => {
                            this.loading = false;
                        })
                    }).catch(err => {
                        this.loading = false;
                    });
                // }

            },
            getItems(){
                this.loading = true;
                this.processList = [];
                let url = "/rxswt/procedure/listSteps" + "?procedureId=" + this.processId + "&mobile=true";
                this.axios.get(url,{
                    headers: {
                        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(res => {
                    this.finished = true;
                    if (res.data.code === 200 && res.data.data.procedure) {
                        this.processName = res.data.data.procedure.name;
                        this.acceptTarget = res.data.data.procedure.accessTarget;
                        if(res.data.data.procedureSteps.length > 0){
                            res.data.data.procedureSteps.forEach(value => {
                                value.auditList = [];
                            });
                            this.processList = res.data.data.procedureSteps;
                        }else{
                            Toast("暂无步骤");
                        }
                        /*res.data.data.forEach((val,ind) => {
                            let item = {};
                            item.applyDate = new Date(val.applyDate).Format("yyyy-MM-dd hh:mm:ss");
                            item.applyDept = val.applyDept;
                            item.applyUser = val.applyUser;
                            item.pname = val.pname;
                            item.procdureId = val.procdureId;
                            this.list.push(item);
                        });*/
                    }else{
                        Toast(res.data.message);
                    }
                    this.$nextTick(() => {
                        this.loading = false;
                    })
                }).catch(err => {
                    this.loading = false;
                });
            },
            onClickLeft() {
                this.$router.push("/myApply");
            },
            onLoad() {
                // 异步更新数据
                setTimeout(() => {
                    /*for (let i = 0; i < 10; i++) {
                        this.list.push(this.list.length + 1);
                    }*/
                    // 加载状态结束
                    // this.loading = false;

                    // 数据全部加载完成
                    /*if (this.list.length >= 40) {
                        this.finished = true;
                    }*/
                }, 500);
            }
        }
    }
</script>

<style scoped>

</style>