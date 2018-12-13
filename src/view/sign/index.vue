<template>
    <div>
      <!--  <div>
            <img :src="require('./pic.jpg')" id="img" style="display: none"/>
        </div>-->
        <Spin size="large" fix v-show="showLoading"></Spin>
        <div style="display: flex">
            <div style="overflow:auto;width: 50%">
                <Card :bordered="false" dis-hover>
                    <p slot="title">审批流程</p>
                    <i-form ref="formItem" :model="formItem" :label-width="75" :rules="ruleValidate">
                        <Form-item label="流程名称" prop="name">
                            <i-input v-model="formItem.name" placeholder="请输入流程名称..."></i-input>
                        </Form-item>
                        <Form-item label="审批图片"  prop="img">
                            <Upload
                                :model="formItem.file"
                                ref="uploadButton"
                                :data= userId
                                :format="['jpg','jpeg','png']"
                                :max-size="2048"
                                :on-format-error="handleFormatError"
                                :on-exceeded-size="handleMaxSize"
                                :on-success="handleSuccess"
                                :before-upload = "handleBeforeUpload"
                                :on-error="handleError"
                                :on-remove="handleRemove"
                                :show-upload-list="true"
                                action="/rxswt/user/uploadSign">
                               <!-- action="//jsonplaceholder.typicode.com/posts/"-->
                               <!-- <div style="padding: 2px 0">
                                    <Icon type="ios-cloud-upload" size="28" style="color: #3399ff"></Icon>
                                    <p>Click or drag files here to upload</p>
                                </div>-->
                                <Button icon="ios-cloud-upload-outline">上传文件</Button>
                            </Upload>
                            <div v-if="formItem.file !== null">当前文件: {{ formItem.file.name }}</div>
                        </Form-item>
                       <!-- <Form-item label="提交失败重新审批">
                            <Radio-group v-model="formItem.failRepeat" >
                                <Radio label="1">是</Radio>
                                <Radio label="0">否</Radio>
                            </Radio-group>
                        </Form-item>
                        <Form-item label="备注">
                            <i-input v-model="formItem.remark" type="textarea" :autosize="{minRows: 2,maxRows: 3}" placeholder="请输入..."></i-input>
                        </Form-item>-->
                        <Form-item >
                            <i-button @click="handleSubmit('formItem')" type="primary">保存</i-button>
                            <i-button @click="resetForm('process')" style="margin-left: 8px">重置</i-button>
                        </Form-item>
                        <Form-item label="审批步骤" v-show="showStepEdit">
                            <i-input style="width: 200px" v-model="stepName" placeholder="请输入步骤名称..." clearable ></i-input>
                            <Radio-group style="margin-left: 10px;" v-model="auditType" >
                                <Radio label="leader">领导审批</Radio>
                               <!-- <Radio label="dept">部门审批</Radio>-->
                            </Radio-group>
                            <Button @click="addStep" style="padding:2px 4px 2px 8px;margin-left: 10px" custom-icon="iconfont icon-tianjiajiahaowubiankuang"></Button>
                            <Scroll height="400" style="border: 1px solid #EDEEF0;">
                                <Collapse v-for="(step,ind) of steps" v-if="!step.show">
                                    <Panel name="ind" >
                                         {{step.name}}
                                        <div slot="content" >
                                            <Button @click="addPeople(ind)">添加{{auditName}}</Button>
                                            <div style="margin-left: 10px">
                                                <ul v-for="(person,index) of step.procedureStepDetailEntityList" v-if="!person.show">
                                                    <li >
                                                        <div style="line-height: 30px">
                                                            <span>{{auditName}}</span>
                                                            <Select  placement="top" filterable size="small" style="width: 100px;margin-right:3px;" placeholder="请选择部门" @on-change="findUserByDept(arguments,ind,index,person.personSelect)">
                                                                <Option  v-for="deptEntry of auditDeptList" :value="deptEntry.key">{{deptEntry.but}}</Option>
                                                            </Select>
                                                            <Select :ref="person.personSelect" :not-found-text="SelNoFundText" clearable placement="top" v-model="person.refUserId" filterable size="small" style="width: 100px;margin-right:3px;" placeholder="请选择审批人">
                                                                <Option  v-for="auditEntry of person.auditUserList" :value="auditEntry.email">{{auditEntry.but}}</Option>
                                                            </Select>
                                                            <Divider type="vertical" />
                                                            <span>x：</span><i-input v-model="person.signX" size="small" clearable style="width: 50px;margin-right:3px;"></i-input>
                                                            <span>y：</span><i-input v-model="person.signY" size="small" clearable style="width: 50px;margin-right:3px;"></i-input>
                                                            <Button style="padding:0 5px;"  custom-icon="iconfont icon-tongyi" @click="applyCoordinate(ind,index,'sign')"></Button>
                                                            <Divider type="vertical" />
                                                            <span style="margin-left: 5px">意见：</span>
                                                            <span>x：</span><i-input v-model="person.commentX"  size="small" clearable style="width: 50px;margin-right:3px;"></i-input>
                                                            <span>y：</span><i-input v-model="person.commentY" size="small" clearable style="width: 50px;margin-right:3px;"></i-input>
                                                            <Button style="padding:0 5px;" custom-icon="iconfont icon-tongyi" @click="applyCoordinate(ind,index,'comment')"></Button>
                                                            <!--<i-input style="width: 200px" v-model="person.name" placeholder="请框选签名区域..."></i-input>-->
                                                            <Button style="padding:1px 5px;float: right;margin: 1px" custom-icon="iconfont icon-shanchu"  @click="deletePeople(ind,index)"></Button>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <Button @click.stop="deleteStep(ind)" style="float: right;padding:1px 5px;margin: 5px;" custom-icon="iconfont icon-shanchu"></Button>
                                    </Panel>
                                </Collapse>
                            </Scroll>

                        </Form-item>
                        <Form-item v-show="showStepEdit">
                            <i-button @click="handleSubmitSteps" type="primary">保存</i-button>
                            <i-button @click="resetForm('step')" style="margin-left: 8px">重置</i-button>
                        </Form-item>
                    </i-form>
                </Card>
            </div>
            <div style="width: 50%">
                <Card :bordered="false" dis-hover >
                    <p slot="title">
                        <span>审批图片</span>
                        <span v-show="showStepEdit" style="float:right;margin-right: 5%;font-size: large;color: gray">当前选择坐标：(x: {{startX}} ,y: {{startY}})</span>
                    </p>
                    <div>
                         <!--require('./pic.jpg')-->
                    </div>
                    <div align="center" class="canvas-container" v-show="isShowCanvas">
                        <img :src="imageUrl" id="img" style=" width: auto;height: auto"/>
                        <canvas id="canvas" style="display: none"></canvas>
                        <div id="container" v-show="showStepEdit">
                            <canvas id="canvasbg"></canvas>
                        </div>
                    </div>
                </Card>
            </div>
            <div v-show="showStepEdit">
                <Card :bordered="false" dis-hover>
                    <p slot="title">操作</p>
                    <div style="margin-left: 10px;border-left: 1px solid red;padding: 10px">
                       <!-- <img id="sign" style="width: 100px;height: 50px"/>
                        <vueSignature ref="signature" :sigOption="option" :w="'150px'" :h="'100px'"></vueSignature>
                        <button @click="save">保存</button>
                        <button @click="clear">清除</button>-->
                        <div><Button @click="reset">重绘</Button></div>
                        <div style="margin-top: 10px"><Button @click="rotate('90')">旋转90</Button></div>
                        <div style="margin-top: 10px"><Button @click="rotate('180')">旋转180</Button></div>
                        <div style="margin-top: 10px"><Button @click="rotate('270')">旋转270</Button></div>
                    </div>
                </Card>
            </div>

        </div>

    </div>
</template>

<script>
    import VueSignature from "./vue-signature";
    import {setToken} from "../../common/js/common";
    import {getToken} from "../../common/js/common";
    import qs from 'qs'
    import * as Vue from "vue";
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
        props: {
            parentFormItem: {
                type: Object
            },
            isCreate:{
                type: Boolean
            }
        },
        data() {
            const validateUpload = (rule, value, callback) => {
                callback();
            };
            return {
                isSaved: false,
                startX: 0,
                startY: 0,
                cW: 0,
                cH: 0,
                option: {
                    penColor: "rgb(0, 0, 0)",
                },
                showStepEdit: true,
                auditList: [{key:"",but:""}],
                auditUserList: [],
                auditDeptList: [],
                auditType: "leader",
                auditName: "",
                imageUrl: "",
                isShowCanvas: false,
                userId:{userId:getToken()},
                showLoading:false,
                isUploadImg: false,
                formItem: {
                    id: null,
                    name: '',
                    file:null,
                    failRepeat: "1",
                    remark: '',
                    procedureId: ""
                },
                steps:[],
                stepName:"",
                userInfo: null,
                ruleValidate: {
                    name: [
                        { required: true, message: '流程名称不能为空', trigger: 'blur' }
                    ],
                    img: [
                        {required:true,  validator: validateUpload, trigger: 'blur' }
                    ]
                },
                userEmailIdMap:{},
                SelNoFundText: ""
            };
        },
        watch :{
            'isCreate':function (newItem, oldItem){
                this.resetForm('process');
                this.resetForm('step');
            },
            'auditType':function(newItem, oldItem){
                this.steps = [];
                if(newItem === "leader"){
                    this.auditName = "审批人";
                    this.auditList = this.auditUserList;
                }else{
                    this.auditName = "审批部门";
                    this.auditList = this.auditDeptList;
                }
            },
            'parentFormItem.imageUrl':function (newItem, oldItem){
                this.imageUrl = newItem;
            },
            'parentFormItem.formItem':function (newItem, oldItem){
                this.formItem.name = newItem.name;
                this.formItem.failRepeat = newItem.failRepeat + "";
                this.formItem.remark = newItem.remark;
                this.formItem.id = newItem.id;
                this.formItem.accessOrigin = newItem.accessOrigin;
                this.formItem.accessTarget = newItem.accessTarget;
                this.formItem.applyUser = newItem.applyUser;
                this.formItem.ext = newItem.ext;
                this.formItem.origin = newItem.origin;
                this.formItem.target = newItem.target;
                this.formItem.userId = newItem.userId;
                this.formItem.userUploadImg = newItem.userUploadImg;
                this.formItem.submit = newItem.submit;
                this.formItem.procedureId = newItem.id;

                this.showStepEdit = newItem.showStepEdit;
                this.isUploadImg = newItem.userUploadImg;
                // this.isCreate = false;
            },
            'parentFormItem.steps':function (newItem, oldItem){
                this.steps = newItem;
            },
            'imageUrl':function(newItem, oldItem){
                let _this = this;
                setTimeout(function(){
                    _this.convertImageToCanvas(document.getElementById('img'));
                },1000);
            },
            'formItem.file':function(newItem, oldItem){
                if(newItem !== oldItem){
                    this.isSaved = false;
                }
            },
            'formItem.name':function(newItem, oldItem){
                if(newItem !== oldItem){
                    this.isSaved = false;
                }
            },
            'formItem.failRepeat':function(newItem, oldItem){
                if(newItem !== oldItem){
                    this.isSaved = false;
                }
            },
            'formItem.remark':function(newItem, oldItem){
                if(newItem !== oldItem){
                    this.isSaved = false;
                }
            }
        },
        computed: {

        },

        created() {
            let auditData = JSON.parse(localStorage.getItem("auditUserList"));
            let auditDeptData = JSON.parse(localStorage.getItem("auditDeptList"));
            if(this.getUserInfo()){
                let _this = this;
                if(auditData && auditDeptData){
                    this.auditUserList = auditData;
                    this.auditDeptList = auditDeptData;
                    return;
                }
                this.userInfo = JSON.parse(localStorage.getItem("userInfoPC"));
                this.showLoading = true;
                this.axios.all([
                    this.axios.get("/rxswt/user/getDeptList",{
                        headers: {
                            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }),
                    this.axios.get('/rxswt/user/getAllUserList?deptId='+ '&email=',{
                        headers: {
                            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    })
                ]).then(this.axios.spread(function (deptResp, userResp) {
                    if(deptResp.data.code === 200 && deptResp.data.data.length > 0){
                        deptResp.data.data.forEach(function (value,index) {
                            _this.auditDeptList.push({
                                key: value.id,
                                but: value.deptName
                            });
                        });
                        localStorage.setItem("auditDeptList",JSON.stringify(_this.auditDeptList))
                    }
                    if(userResp.data.code === 200 && userResp.data.data.length > 0){
                        userResp.data.data.forEach(function (value,index) {
                            _this.userEmailIdMap[value.email] = value.id;
                            _this.auditUserList.push({
                                key: value.id,
                                but: value.name,
                                email: value.email
                            });
                        });
                        _this.auditList = _this.auditUserList;
                        localStorage.setItem("auditUserList",JSON.stringify(_this.auditUserList))
                    }
                    this.$nextTick(() => {
                        this.showLoading = false;
                    })
                })).catch(err => {
                    this.showLoading = false;
                });
            }else{
                /*let _this = this;
                this.$Message.error("会话失效");
                localStorage.clear();
                setTimeout(function(){
                    _this.$router.push("login");
                },1500);*/
            }
        },

        mounted() {

        },
        methods: {
            findUserByDept(arg, stepId,personId, personSelect){
                let value = arg[0];
                let _this = this;
                this.$refs[personSelect][0].clearSingleSelect();//清空选项
                _this.steps[stepId].procedureStepDetailEntityList[personId].auditUserList = [];
                this.SelNoFundText = "加载中...";
                this.axios.get('/rxswt/user/getAllUserList?deptId='+ value + '&email=',{
                    headers: {
                        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(res=>{
                    if(res.data.code === 200 && res.data.data.length > 0){
                        let tempArr = [];
                        res.data.data.forEach(function (value,index) {
                            _this.userEmailIdMap[value.email] = value.id;
                            tempArr.push({
                                key: value.id,
                                but: value.name,
                                email: value.email
                            });
                        });
                        _this.steps[stepId].procedureStepDetailEntityList[personId].auditUserList = tempArr;
                    }
                    this.$nextTick(() => {
                        this.SelNoFundText = "";
                        this.showLoading = false;
                    })
                });
            },
            getUserInfo(){
                //获取用户信息
                // setToken("1");  //测试用
                return !(!getToken || !localStorage.getItem("userInfoPC"));
            },
            resetForm(type){
                if(type === "process"){
                    this.isUploadImg = false;
                    this.formItem = {
                        name: '',
                        file:null,
                        failRepeat: "1",
                        remark: '',
                        procedureId: ""
                    };
                    this.imageUrl = "";
                }else{
                    this.steps = [];
                    this.stepName = "";
                }
            },
            handleSubmit (name) {
                let url = '/rxswt/procedure/add';
                let config = {
                    headers:{'Content-Type':'multipart/form-data'}
                };
                let file = null;
                let formdata1 = {};
                if(this.isSaved){
                    return this.$Message.info('请不要重复提交');
                }
                //添加请求头
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if(!this.isUploadImg){
                            return this.$Message.error('请上传审批图片!');
                        }
                        if(this.formItem.id){
                            formdata1.name = this.formItem.name;
                            formdata1.failRepeat = this.formItem.failRepeat;
                            formdata1.remark = this.formItem.remark;
                            formdata1.id = this.formItem.id;
                            formdata1.accessOrigin = this.formItem.accessOrigin;
                            formdata1.accessTarget = this.formItem.accessTarget;
                            formdata1.applyUser = this.formItem.applyUser;
                            formdata1.ext = this.formItem.ext;
                            formdata1.origin = this.formItem.origin;
                            formdata1.target = this.formItem.target;
                            formdata1.userId = this.formItem.userId;
                            formdata1.userUploadImg = this.formItem.userUploadImg;
                            formdata1.submit = this.formItem.submit;
                            // formdata1.append("id",this.formItem.id);
                            url = '/rxswt/procedure/update';
                            config = {
                                headers: {
                                    'Content-Type':'application/json; charset=UTF-8'
                                }
                            };
                        }else{
                            file = this.formItem.file;
                            formdata1 = new FormData();
                            formdata1.append('file',file,file.name);
                            formdata1.append("userId",this.userId.userId);
                            formdata1.append("name",this.formItem.name);
                            formdata1.append("failRepeat",this.formItem.failRepeat === "1");
                            formdata1.append("remark",this.formItem.remark);
                        }
                        this.showLoading = true;
                        this.axios.post(url,formdata1,config).then(res=>{
                            if(res.data.code === 200){
                                this.isSaved = true;
                                this.$Message.info("保存成功");
                                let data = res.data.data;
                                this.imageUrl = data.accessOrigin;
                                this.formItem.procedureId = data.id;
                            }else{
                                this.$Message.warning(res.data.message);
                            }
                            this.$nextTick(()=>{
                                this.showLoading = false;
                            });
                        }).catch(err=>{
                            this.showLoading = false;
                        })

                    } else {
                        this.$Message.error('请检查必填项!');
                    }
                })
            },
            handleSubmitSteps(){
                let that = this,sendData = [];
                let subFlag = false, personCheckFlag = false, userFlag = false;
                if(!this.formItem.procedureId){
                    return this.$Message.warning("请先创建流程");
                }
                if(this.steps.length === 0){
                    this.$Message.warning("请填写审批步骤");
                }else{
                    this.steps.forEach(sVal => {
                        let tempArr = [];
                        if(sVal.show){
                            return false;
                        }
                        if(!sVal.procedureId){
                            userFlag = true;
                            return this.$Message.error("流程id为空,请重新上传");
                        }
                        sVal.procedureStepDetailEntityList.forEach((value,index) => {
                            let tempObj = [];
                            if(!value.show){
                                value.signX = value.signX && parseFloat(value.signX);
                                value.signY = value.signX && parseFloat(value.signY);
                                value.commentX = value.commentX && parseFloat(value.commentX);
                                value.commentY = value.commentY && parseFloat(value.commentY);
                                if( !value.refUserId || !that.userEmailIdMap[value.refUserId]){
                                    userFlag = true;
                                    return this.$Message.warning("请检查审批人");
                                }
                                if(!value.refUserId.trim()){
                                    personCheckFlag = true;
                                    return false;
                                }
                                if(!value.signX || !value.signY){
                                    subFlag = true;
                                    return false;
                                }
                                tempObj = {
                                    commentX: value.commentX,
                                    commentY: value.commentY,
                                    refUserId: that.userEmailIdMap[value.refUserId],
                                    signX: value.signX,
                                    signY: value.signY,
                                    status: value.status,
                                };
                                tempArr.push(tempObj);
                            }
                            // value.refUserId = that.userEmailIdMap[value.refUserId];
                        });
                        sendData.push(
                            {
                                enable: sVal.enable,
                                name: sVal.name,
                                order: sVal.order,
                                procedureId: sVal.procedureId,
                                procedureStepDetailEntityList: tempArr,
                                remark: sVal.remark,
                                type: sVal.type,
                                typeCount: sVal.typeCount,
                            }
                        );
                    });
                    if(userFlag){
                        return;
                    }
                    if(personCheckFlag){
                        this.$Message.warning("请选择审批人");
                        return
                    }else if(subFlag){
                        this.$Message.warning("请选择有效的审批人坐标");
                        return
                    }
                    this.showLoading = true;
                    this.axios.post('/rxswt/procedure/addStep?userId=' + getToken(),sendData,{
                        headers: {
                            'Content-Type':'application/json; charset=UTF-8'
                        }
                    }).then(res=>{
                        if(res.data.code === 200){
                            let _this = this;
                            let data = res.data.data;
                            this.$Message.info(res.data.message);
                            setTimeout(() => {
                               /* this.$emit('changeNode',"1");
                                _this.$router.push("processList");*/
                               location.reload(true);
                            },1000);
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
            addPeople(stepInd){
                this.steps[stepInd].procedureStepDetailEntityList.push({
                    // key: this.steps[stepInd].procedureStepDetailEntityList.length,
                    // deptId:"",
                    refUserId:"",
                    status:1,
                    signX:null,
                    signY:null,
                    commentX:null,
                    commentY:null,
                    auditUserList: this.auditUserList,
                    personSelect: "personSelect" + new Date().getTime(),
                    show: false
                });
            },
            deletePeople(stepInd, personInd){
                // this.steps[stepInd].procedureStepDetailEntityList.splice(personInd,1);
                this.$set(this.steps[stepInd].procedureStepDetailEntityList[personInd],"show",true);
            },
            addStep(){
                if(!this.formItem.procedureId){
                    return this.$Message.warning("请先创建流程");
                }else if(!this.stepName){
                    return this.$Message.warning({
                        content: "步骤名称不能为空!",
                        duration: 1
                    });
                }
                    this.steps.push({
                    show:false,
                    enable: 1,
                    type:1,
                    typeCount:1,
                    // key: this.steps.length,
                    order: this.steps.length + 1,
                    name: this.stepName,
                    remark: "string",
                    procedureId: this.formItem.procedureId/*'8a960f8966bf159e0166e2fcc7ab0006'*/,
                    procedureStepDetailEntityList: [{show:false,personSelect:"personSelect" + new Date().getTime(), auditUserList: this.auditUserList,status:1,/*deptId:"",*/refUserId:"",signX:null,signY:null,commentX:null,commentY:null}],
                });
            },
            deleteStep(stepInd){
                // this.steps.splice(stepInd,1);
                this.$set(this.steps[stepInd],"show",true);
            },
            applyCoordinate(stepInd, personInd, type){
                if(type === "sign"){
                    this.steps[stepInd].procedureStepDetailEntityList[personInd].signX = parseFloat(this.startX);
                    this.steps[stepInd].procedureStepDetailEntityList[personInd].signY = parseFloat(this.startY);
                }else{
                    this.steps[stepInd].procedureStepDetailEntityList[personInd].commentX = parseFloat(this.startX);
                    this.steps[stepInd].procedureStepDetailEntityList[personInd].commentY = parseFloat(this.startY);
                }
            },
            // 把image 转换为 canvas对象
            convertImageToCanvas(image) {
                this.isShowCanvas = true;
                // 创建canvas DOM元素，并设置其宽高和图片一样
                let canvas = document.getElementById("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                // 坐标(0,0) 表示从此处开始绘制，相当于偏移。
                canvas.getContext("2d").drawImage(image, 0, 0);
                console.log(canvas);
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
                  /*  let container = document.getElementsByClassName("canvas-container");
                    console.log("scrollX：" + container.scrollLeft());
                    console.log("scrollX：" + container.scrollTop());*/
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
            rotate(label){
                if(!this.imageUrl){
                    return;
                }
                this.showLoading = true;
                this.axios.post("/rxswt/procedure/rotate?procedureId=" + this.formItem.procedureId + "&userId=" + getToken() + "&trangel=" + label).then(res => {
                    if (res.data.code === 200) {
                        this.imageUrl = res.data.data.accessTarget;
                        let canvas = document.getElementById("canvas");
                        let context = canvas.getContext('2d');
                        let image = document.getElementById('img');
                        let x = canvas.width/2; //画布宽度的一半
                        let y = canvas.height/2;//画布高度的一半
                        context.clearRect(0,0, canvas.width, canvas.height);//先清掉画布上的内容
                        context.translate(x,y);//将绘图原点移到画布中点
                        context.rotate(label );//旋转角度+ Math.PI/2
                        context.translate(-x,-y);//将画布原点移动
                        context.drawImage(image,0,0);//绘制图片
                    }else{
                        this.$Message.warning(res.data.message);
                    }
                    this.$nextTick(()=>{
                        this.showLoading = false;
                    });
                }).catch(err => {
                    console.log(err)
                })

            },
            clear() {
                let _this = this;
                _this.$refs.signature.clear();
            },
            reset(){
                if(!this.imageUrl){
                    return;
                }
                this.convertImageToCanvas(document.getElementById('img'));
                this.startX = 0;
                this.startY = 0;
            },
            handleSuccess (res, file, fileList) {
                if(res.code === 200){
                    this.$Message.info("上传成功");
                    this.convertImageToCanvas(document.getElementById('img'));
                }else{
                    this.$Message.error(res.message);
                }
            },
            handleBeforeUpload (file) {
                this.handleClearFiles();
                // 创建一个 FileReader 对象
                /*let reader = new FileReader();
                // readAsDataURL 方法用于读取指定 Blob 或 File 的内容
                // 当读操作完成，readyState 变为 DONE，loadend 被触发，此时 result 属性包含数据：URL（以 base64 编码的字符串表示文件的数据）
                // 读取文件作为 URL 可访问地址
                reader.readAsDataURL(file);
                const _this = this;
                reader.onloadend = function (e) {
                    file.url = reader.result;
                    // _this.uploadList.push(file)
                    _this.imageUrl = reader.result;
                }*/
                this.isUploadImg = true;
                this.formItem.file = file;
                return false;
            },
            handleClearFiles () {   // 再次点击上传之前，清空之前已上传文件
                this.$refs.uploadButton.clearFiles();
                this.isUploadImg = false;
            },
            handleRemove(file){
                this.imageUrl = "";
                let c = document.getElementById("canvasbg");
                let cxt = c.getContext("2d");
                c.height = cxt.height;
                this.isShowCanvas = false;
            },
            handleError (err, file) {
                this.$Message.info('上传失败' );
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
            },
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
        overflow-x: scroll;
        height: 730px;
        position: relative
    }

    #container {
        width: 100%;
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

    .layout-content{
        min-height: 200px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
</style>