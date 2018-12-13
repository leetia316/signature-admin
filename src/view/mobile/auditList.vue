<template>
    <div>
        <Loading v-show="globalLoading"/>
        <div>  <!--left-text="返回"
                @click-left="onClickLeft"-->
            <van-nav-bar
                title= "电子签字"
                right-text="我的申请"
                @click-right="onClickRight">
            </van-nav-bar>
        </div>
        <van-tabs type="card" v-model="tabIndex" swipeable @click="changeTab">
            <van-tab title="待审批"></van-tab>
            <van-tab title="已审批"></van-tab>
        </van-tabs>
        <!--<div >
            <form action="/">
                <van-search
                    v-model="search"
                    show-action
                    @search="getItems"
                >
                <div slot="action" @click="getItems">搜索</div>
                </van-search>
            </form>
        </div>-->
        <div>
            <van-list
                v-model="loading"
                :finished="finished"
                @load="onLoad"
            >
                <van-cell
                    v-for="(item,index) in list"
                    :key="index"
                    >
                    <div style=" display: flex;" @click="goToAudit(item.procedureDetailId)">
                        <div style="width:95%">
                            <div style="float: left;padding:5px 0;font-size: 22px;font-weight: bold">
                                <span>{{item.pname}}</span>
                            </div>
                            <div style="clear:both;line-height:24px;padding:5px 0;font-size: 14px">
                                <span style="float:left;">申请人：{{item.applyUser}}</span>
                                <span style="float:right;">时间： {{item.applyDate}}</span>
                            </div>
                        </div>
                        <div style="width:5%;text-align:center;">
                            <van-icon style="padding-top: 100%" size="22px" name="arrow"></van-icon>
                        </div>
                    </div>
                </van-cell>
            </van-list>
        </div>
        </div>
</template>

<script>
    import Toast from "vant/es/toast/index";
    import {setToken} from "../../common/js/common";
    import {getToken} from "../../common/js/common";
    export default {
        name: "auditList",
        data() {
            return {
                tabIndex: 0,
                myTitle: "待审批列表(0)",
                search: "",
                list: [],
                loading: false,
                globalLoading: false,
                finished: false
            };
        },
        created() {
            let tokenInfo = this.getUrlParam("token");
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if(!tokenInfo && !getToken()){
                Toast("无用户权限");
                this.finished = true;
            }else{
                //获取用户信息
                if(!getToken() || !userInfo){
                    let url = "/rxswt/user/getUserInfo" + "?token=" + tokenInfo;
                    this.axios.get(url,{
                        headers: {
                            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(res => {
                        if (res.data.code === 200) {
                            localStorage.setItem('userInfo', JSON.stringify(res.data.data));
                            setToken(res.data.data.id);
                            this.getItems();
                        }else{
                            Toast(res.data.message);
                            this.globalLoading = true;
                            this.finished = true;
                        }
                        this.$nextTick(() => {
                            this.loading = false;
                        })
                    }).catch(err => {
                        this.loading = false;
                    });
                }else{
                    this.getItems();
                }

            }

        },
        methods: {
            changeTab(index, title) {
                this.list = [];
                this.getItems();
            },
            getUrlParam(name) {
                let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                let r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            },
            goToAudit(procedureDetailId) {
                this.$router.push({
                    name: 'toAudit',
                    params: {
                        procedureDetailId: procedureDetailId,
                        tabIndex: this.tabIndex
                    }
                })
            },
            getItems(){
                this.loading = true;
                this.List = [];
                let isAudit = this.tabIndex === 1;
                let url = "/rxswt/user/getAuditList" + "?userId=" +  getToken() + "&isAudited=" + isAudit;
                this.axios.get(url,{
                    headers: {
                        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(res => {
                    this.finished = true;
                    if (res.data.code === 200 && res.data.data.length > 0) {
                        this.myTitle = "待审批列表(" + res.data.data.length + ")";
                        res.data.data.forEach((val,ind) => {
                            let item = {};
                            item.applyDate = new Date(val.applyDate).Format("yyyy-MM-dd hh:mm:ss");
                            item.applyDept = val.applyDept;
                            item.applyUser = val.applyUser;
                            item.pname = val.pname;
                            item.procdureId = val.procdureId;
                            item.procedureDetailId = val.procedureDetailId;
                            this.list.push(item);
                        });
                    }else if(res.data.code === 200 && res.data.data.length === 0){
                        Toast("暂无数据");
                    }
                    this.$nextTick(() => {
                        this.loading = false;
                    })
                }).catch(err => {
                    this.loading = false;
                });
            },
            onClickLeft() {
                this.$router.push("/index")
            },
            onClickRight() {
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