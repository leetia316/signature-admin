<template>
    <div>
        <div>
            <span>流程名称：</span>
            <Input placeholder="请输入..." v-model="search" style="width: auto" />
            <Button type="primary" icon="ios-search" style="margin-left: 10px" @click="getItems">搜索</Button>
        </div>
        <div style="margin: 10px;">
           <!-- <Button @click="handleSelectAll(true)">全选</Button>
            <Button style="margin-left: 5px;" @click="handleSelectAll(false)">取消全选</Button>-->
            <Button style="margin-left: 5px;" @click="createForm()">新增</Button>
            <Button style="margin-left: 5px;" @click="handleSubmitProcess()">提交</Button>
            <Button style="margin-left: 5px;" @click="handleEdit()">修改</Button>
            <Button style="margin-left: 5px;" @click="handleDel()">删除</Button>
        </div>
        <Modal v-model="createShow" fullscreen title="新增表单" :loading="loading" footer-hide>
            <slot slot="close"><span style="font-size: 18px;color:darkblue;font-weight: bold">关闭</span></slot>
            <create-form :isCreate="isCreate"> </create-form>
        </Modal>
        <Modal v-model="editShow" fullscreen title="修改表单" :loading="loading" @on-ok="updateForm" footer-hide>
            <slot slot="close"><span style="font-size: 18px;color:darkblue;font-weight: bold">关闭</span></slot>
            <create-form :parentFormItem="parentFormItem" ref="childForm"> </create-form>
        </Modal>
        <Modal v-model="processGridShow" width="80%" draggable scrollable :title="processName">
            <Table border ref="selection" :data="processGridData" :columns="processGridHeader" stripe :loading="showLoadingProcess"></Table>
        </Modal>
        <Modal v-model="auditGridShow" width="65%" draggable scrollable :title="auditName">
            <Table border ref="selection" :data="auditGridData" :columns="auditGridHeader" stripe :loading="showLoadingAudit"></Table>
        </Modal>
        <Modal v-model="showImage" :mask-closable="false" fullscreen>
            <slot slot="close"><span style="font-size: 18px;color:darkblue;font-weight: bold">关闭</span></slot>
            <div style="text-align:center">
                <img :src=processImageUrl  alt="无法展示该图片" >
               <!-- <Button @click="rotateImage(processImageUrl)">旋转</Button>-->
            </div>
        </Modal>
        <Table border ref="selection" :data="items" :columns="tableColumns1" stripe @on-select="selectRow" @on-select-cancel ="selectRow" :loading="showLoading"></Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;" v-show="!noResult">
                <Page :total="total" :current="pageNo" @on-change="changePage"></Page>
            </div>
        </div>
    </div>
</template>
<script>
    import CreateForm from "./index";
    import {getToken} from "../../common/js/common";
    import qs from 'qs'
    export default {
        components: {CreateForm},
        data () {
            return {
                isCreate: false,
                showImage: false,
                processImageId: "",
                processImageUrl: "",
                updateBtn: false,
                loading: true,
                parentFormItem: {
                    formItem: {
                        name: '',
                        file:null,
                        failRepeat: "1",
                        remark: ''
                    },
                    steps: [],
                    imageUrl: "",
                },
                pageApi: '/rxswt/procedure/list',
                pageNo: 1,
                pageSize: 10,
                total: 0,
                showLoading: true,
                showLoadingProcess: false,
                showLoadingAudit: false,
                search: '',
                noResult: false,
                selectedRow: [],
                auditGridShow: false,
                auditGridData: [],
                auditName: "",
                editShow: false,
                createShow: false,
                processGridShow: false,
                processName: "",
                processGridData: [],
                auditGridHeader: [
                    {
                        title: '审批人',
                        align: 'center',
                        key: 'refUserName'
                    },
                    {
                        title: '是否通过',
                        align: 'center',
                        key: 'pass',
                        render: (h, params) => {
                            let val = "";
                            switch (params.row.pass) {
                                case 0:
                                    val = "否";
                                    break;
                                case 1:
                                    val = "是";
                                    break;
                            }
                            return h('div', val);
                        }
                    },
                    {
                        title: '审批意见',
                        align: 'center',
                        key: 'comment'
                    },
                    {
                        title: '创建时间',
                        align: 'center',
                        key: 'createDate',
                        render: (h, params) => {
                            let val = params.row.createDate ? new Date(params.row.createDate).Format("yyyy-MM-dd hh:mm:ss"): "";
                            return h('div', val);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        // width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.removeAudit(params.row.id)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                    ],
                processGridHeader: [
                    {
                        title: '步骤序号',
                        // width: 150,
                        align: 'center',
                        key: 'order'
                    },
                    {
                        title: '步骤名称',
                        // width: 150,
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '创建人',
                        // width: 150,
                        align: 'center',
                        key: 'createUserId'
                    },
                    {
                        title: '创建时间',
                        align: 'center',
                        // width: 150,
                        key: 'createDate',
                        render: (h, params) => {
                            let val = params.row.createDate ? new Date(params.row.createDate).Format("yyyy-MM-dd hh:mm:ss"): "";
                            return h('div', val);
                        }
                    },
                   /* {
                        title: '备注',
                        // width: 150,
                        align: 'center',
                        key: 'remark'
                    },*/
                    {
                        title: '操作',
                        key: 'action',
                        // width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.viewAuditPerson(params.row.id, params.row.name)
                                        }
                                    }
                                }, '查看审批人'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.removeProcess(params.row.id)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                items: [],
                tableColumns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '流程名称',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'submit',
                        filters: [
                            {
                                label: '未提交',
                                value: 1
                            },
                            {
                                label: '已提交',
                                value: 2
                            },
                            {
                                label: '退回',
                                value: 3
                            },
                            {
                                label: '审批完成',
                                value: 4
                            }
                        ],
                        filterMultiple: false,
                        filterMethod (value, row) {
                            if (value === 1) {
                                return row.submit === 0;
                            } else if (value === 2) {
                                return row.submit === 1;
                            }else if (value === 3) {
                                return row.submit === 2;
                            }else if (value === 4) {
                                return row.submit === 9;
                            }
                        },
                        render: (h, params) => {
                            let val = "";
                            let color = "";
                            switch (params.row.submit) {
                                case 0:
                                    val = "未提交";
                                    color = 'primary';
                                    break;
                                case 1:
                                    val = "已提交";
                                    color = 'warning';
                                    break;
                                case 2:
                                    val = "退回";
                                    color = 'error';
                                    break;
                                case 9:
                                    val = "审批完成";
                                    color = 'success';
                                    break;
                            }

                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, val);
                        }
                    },
                    {
                        title: '创建人',
                        align: 'center',
                        key: 'applyUser'
                    },
                    {
                        title: '提交失败重新审批',
                        align: 'center',
                        key: 'failRepeat',
                        render: (h, params) => {
                            let val = params.row.submit  ?'否':'是';
                            return h('div', val);
                        }
                    },
                    {
                        title: '备注',
                        align: 'center',
                        key: 'remark'
                    },
                    {
                        title: '创建时间',
                        align: 'center',
                        key: 'createDate',
                        render: (h, params) => {
                            let val = params.row.createDate ? new Date(params.row.createDate).Format("yyyy-MM-dd hh:mm:ss"): "";
                            return h('div', val);
                        }
                    },
                    {
                        title: '修改时间',
                        align: 'center',
                        key: 'updateDate',
                        render: (h, params) => {
                            let val = params.row.updateDate ? new Date(params.row.updateDate).Format("yyyy-MM-dd hh:mm:ss"): "";
                            return h('div', val);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.viewProcess(params.row.id, params.row.name)
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.processImageUrl = "";
                                            if(params.row.accessTarget !== ""){
                                                this.showImage = true;
                                                this.processImageUrl = params.row.accessTarget;
                                                this.processImageId = params.row.id;
                                            }else{
                                                this.$Message.info("没有流程图片");
                                            }
                                            // this.viewProcessImage(params.row.id)
                                        }
                                    }
                                }, '预览')
                            ]);
                        }
                    }
                ]
            }
        },
        created() {
            if(getToken() && localStorage.getItem("userInfoPC")){
                this.getItems()
            }else{
                let _this = this;
                this.$Message.error("会话失效");
                localStorage.clear();
                setTimeout(function(){
                    _this.$router.push("login");
                },1500);
            }
        },
        methods: {
            createForm(){
                this.isCreate = !this.isCreate;
                this.createShow = true;
                /*this.$router.push('index');
                this.$emit('changeNode',"2");*/
                // localStorage.setItem("defautChosen", "2");
            },
            rotateImage(){
                this.axios.post("/rxswt/procedure/rotate?procedureId=" + this.processImageId + "&userId=" + getToken() + "&trangel=90").then(res => {
                    if (res.data.code === 200) {
                        this.processImageUrl = res.data.data.accessTarget;
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            removeAudit(procedureStepDetailId){
                this.showLoadingAudit = true;
                this.axios.post("/rxswt/procedure/deleteStepDetail?procedureStepDetailId=" + procedureStepDetailId + "&userId=" + getToken()).then(res => {
                    this.showLoadingAudit = false;
                    if (res.data.code === 200) {
                        this.$Message.info("删除成功");
                    }else{
                        this.$Message.error("删除失败，" + res.data.message);
                    }
                }).catch(err => {
                    this.showLoadingAudit = false;
                    console.log(err)
                })
            },
            removeProcess(procedureStepId){
                this.showLoadingProcess = true;
                this.axios.post("/rxswt/procedure/deleteStep?procedureStepId=" + procedureStepId + "&userId=" + getToken()).then(res => {
                    this.showLoadingProcess = false;
                    if (res.data.code === 200) {
                        this.$Message.info("删除成功");
                    }else{
                        this.$Message.error("删除失败，" + res.data.message);
                    }
                }).catch(err => {
                    this.showLoadingProcess = false;
                    console.log(err)
                })
            },
            viewProcess(processId, processName){
                this.processGridShow = true;
                this.processName = "流程名称：" + processName;
                this.getProcessItems(processId);
            },
            viewAuditPerson(auditId, auditName){
                this.auditGridShow = true;
                this.auditName = "步骤名称：" + auditName;
                this.getAuditItems(auditId);
            },
            selectRow(selection, row){
                this.selectedRow = selection;
            },
            handleSubmitProcess(){
                if(this.selectedRow.length !== 1){
                    this.$Message.warning("请选择一条数据");
                }else{
                    let ids = [];
                    this.selectedRow.forEach(value => {
                        ids.push(value.id);
                    });
                    let sendData = {
                        userId:getToken(),
                        id: ids.toString()
                    };
                    this.showLoading = true;
                    this.axios.post('/rxswt/procedure/submit',qs.stringify(sendData),{
                        headers: {
                            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(res=>{
                        if(res.data.code === 200){
                            let data = res.data.data;
                            this.$Message.info("提交成功");
                            this.getItems();
                            this.$nextTick(()=>{
                                this.showLoading = false;
                            });
                        }else{
                            this.$Message.warning(res.data.message);
                            this.showLoading = false;
                        }
                    }).catch(err=>{
                        this.showLoading = false;
                    })
                }
            },
            handleEdit(){
                if(this.selectedRow.length !== 1){
                    this.$Message.warning("请选择一条数据");
                }else{
                    //查询有无步骤
                    let url = "/rxswt/procedure/listSteps" + "?procedureId=" + this.selectedRow[0].id;
                    this.showLoading = true;
                    this.axios.get(url,{
                        headers: {
                            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(res => {
                        res = res.data;
                        this.parentFormItem.imageUrl = this.selectedRow[0]. accessOrigin;
                        this.parentFormItem.formItem = {
                            name: this.selectedRow[0].name,
                            failRepeat: this.selectedRow[0].failRepeat + "",
                            remark: this.selectedRow[0].remark,
                            id: this.selectedRow[0].id,
                            accessOrigin : this.selectedRow[0].accessOrigin,
                            accessTarget : this.selectedRow[0].accessTarget,
                            applyUser : this.selectedRow[0].applyUser,
                            ext : this.selectedRow[0].ext,
                            origin : this.selectedRow[0].origin,
                            target : this.selectedRow[0].target,
                            userId : this.selectedRow[0].userId,
                            userUploadImg : this.selectedRow[0].userUploadImg,
                            submit : this.selectedRow[0].submit,
                            showStepEdit : false
                        };
                        if (res.data.procedureSteps.length === 0) {
                            this.parentFormItem.formItem.showStepEdit = true;
                        }
                        // console.log(this.selectedRow[0]);
                        this.parentFormItem.steps = [];
                        this.editShow = true;
                        this.$nextTick(() => {
                            this.showLoading = false;
                        })
                    }).catch(err => {
                        this.showLoading = false;
                    });
                }
            },
            updateForm(){
                if(this.selectedRow.length === 0){
                    this.$Message.warning("请选择数据");
                }else{
                    let sendData = this.selectedRow[0];
                    let procedureEntity = {};
                    procedureEntity.accessOrigin = sendData.accessOrigin;
                    procedureEntity.accessTarget = sendData.accessTarget;
                    procedureEntity.ext = sendData.ext;
                    procedureEntity.applyUser = sendData.applyUser;
                    procedureEntity.id = sendData.id;
                    procedureEntity.origin = sendData.origin;
                    procedureEntity.target = sendData.target;
                    procedureEntity.userId = sendData.userId;
                    procedureEntity.userUploadImg = sendData.userUploadImg;
                    procedureEntity.submit = sendData.submit;
                    procedureEntity.name = this.$refs.childForm.formItem.name;
                    procedureEntity.remark = this.$refs.childForm.formItem.remark;
                    procedureEntity.failRepeat = parseFloat(this.$refs.childForm.formItem.failRepeat);
                    // let procedureEntity = Object.assign({},sendData,this.$refs.childForm.formItem);
                    this.axios.post('/rxswt/procedure/update',procedureEntity,{
                        headers: {
                            'Content-Type':'application/json; charset=UTF-8'
                        }
                    }).then(res=>{
                        this.loading = false;
                        if(res.data.code === 200){
                            this.editShow = false;
                            this.$Message.info("修改成功");
                            this.getItems();
                        }else{
                            this.$Message.warning(res.data.message);
                        }
                    }).catch(err=>{
                        this.$Message.warning(err);
                    })
                }
            },
            handleDel(){
                if(this.selectedRow.length !== 1){
                    this.$Message.warning("请选择一条数据");
                }else{
                    let ids = [];
                    this.selectedRow.forEach(value => {
                        ids.push(value.id);
                    });
                    let sendData = {
                        userId:getToken(),
                        procedureId: ids.toString()
                    };
                    this.showLoading = true;
                    this.axios.post('/rxswt/procedure/deleteProcedure',qs.stringify(sendData),{
                        headers: {
                            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(res=>{
                        if(res.data.code === 200){
                            this.$Message.info("删除成功");
                            this.getItems();
                            this.$nextTick(()=>{
                                this.showLoading = false;
                            });
                        }else{
                            this.$Message.warning(res.data.message);
                            this.showLoading = false;
                        }
                    }).catch(err=>{
                        this.showLoading = false;
                    })
                }
            },
            handleSelectAll (status) {
                this.$refs.selection.selectAll(status);
            },
            getItems () {
                this.items = [];
                this.showLoading = true;
                getToken();
                let url = this.pageApi + "?page=" + this.pageNo + "&size=" + this.pageSize + "&name=" + this.search + "&userId=" + getToken();
                this.axios.get(url,{
                    headers: {
                        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(res => {
                    res = res.data;
                    if (res.data.content.length === 0) {
                        this.noResult = true;
                        /*this.$Message.info({
                            content: '无搜索结果！',
                            duration: 2,
                            closable: true
                        });*/
                    }else{
                        this.total = Number(res.data.totalEmelents);
                        this.items = res.data.content;
                    }
                    this.$nextTick(() => {
                        this.showLoading = false;
                    })
                }).catch(err => {
                    this.showLoading = false;
                })
            },
            getProcessItems (processId) {
                this.showLoadingProcess = true;
                let url = "/rxswt/procedure/listSteps" + "?procedureId=" + processId;
                this.axios.get(url,{
                    headers: {
                        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(res => {
                    res = res.data;
                    if (res.data.procedureSteps.length === 0) {
                        this.noResult = true;
                        this.processGridData = [];
                        this.$Message.info({
                            content: '无搜索结果！',
                            duration: 2,
                            closable: true
                        });
                    }else{
                        this.processGridData = res.data.procedureSteps;
                        this.processGridData.forEach((v) => {
                            v.createUserId = res.data.procedure.applyUser;
                        })
                    }
                    this.$nextTick(() => {
                        this.showLoadingProcess = false;
                    })
                }).catch(err => {
                    this.showLoadingProcess = false;
                })
            },
            getAuditItems (auditId) {
                this.showLoadingAudit = true;
                let url = "/rxswt/procedure/listStepDetail" + "?procedureStepId=" + auditId;
                this.axios.get(url,{
                    headers: {
                        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(res => {
                    res = res.data;
                    if (res.data.length === 0) {
                        this.noResult = true;
                        this.auditGridData = [];
                        this.$Message.info({
                            content: '无搜索结果！',
                            duration: 2,
                            closable: true
                        });
                    }else{
                        this.auditGridData = res.data;
                    }
                    this.$nextTick(() => {
                        this.showLoadingAudit = false;
                    })
                }).catch(err => {
                    this.showLoadingAudit = false;
                })
            },
            changePage (page) {
                this.pageNo = page;
                this.getItems();
            }
        }
    }
</script>