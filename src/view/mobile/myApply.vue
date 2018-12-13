<template>
    <div>
        <div>
            <van-nav-bar
                title= "我的申请"
                left-text="返回"
                right-text="我的签字"
                left-arrow
                @click-left="onClickLeft"
                @click-right="onClickRight">
            </van-nav-bar>
        </div>
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
        <div style="margin-bottom: 20%">
            <van-list
                v-model="loading"
                :finished="finished"
                @load="onLoad"
            >
                <van-cell
                    v-for="(item,index) in list"
                    :key="index"
                    >
                    <div style=" display: flex;" @click="viewMyApply(item.id)">
                        <div style="width:80%">
                            <div style="float: left;padding:5px 0;font-size: 22px;font-weight: bold">
                                <span>{{item.pname}}</span>
                            </div>
                            <div style="clear:both;line-height:24px;padding:5px 0;font-size: 14px">
                                <span style="float:left;">申请时间： {{item.applyDate}}</span>
                            </div>
                        </div>
                        <div style="width:20%;text-align:center;justify-content:center;display:flex;-webkit-align-items:center;
                            align-items:center;">
                            <van-tag type="primary" v-if="item.showState === 1">审批中</van-tag>
                            <van-tag type="success" v-else-if="item.showState === 9">审批完成</van-tag>
                            <van-tag type="warning" v-else-if="item.showState === 2">退回</van-tag>
                            <van-tag type="danger" v-else="item.showState === 0">待提交</van-tag>
                        </div>
                    </div>
                </van-cell>
            </van-list>
            <div v-show="showEmpty" style="text-align: center">无更多内容</div>
        </div>
        <div style="padding: 15px;position:fixed;bottom:10px;width:100%">
            <van-button size="danger" block @click="$router.push('/createForm')">创建申请</van-button>
        </div>
        </div>
</template>

<script>
    import {getToken} from "../../common/js/common";
    import Toast from "vant/es/toast/index";
    export default {
        name: "myApply",
        data() {
            return {
                showEmpty:false,
                page: 1,
                list: [],
                loading: false,
                finished: false
            };
        },
        created() {
            // this.getItems();
        },
        methods: {
            viewMyApply(id){
                this.$router.push({
                    name: 'myApplyDetail',
                    params: {
                        processId: id
                    }
                });
            },
            getItems(){
                this.loading = true;
                this.List = [];
                let url = "/rxswt/procedure/list" + "?userId=" + getToken() + "&page=" + this.page + "&size=" + 20;
                this.axios.get(url,{
                    headers: {
                        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code === 200 && res.data.data.content.length > 0) {
                        res.data.data.content.forEach((val,ind) => {
                            let item = {};
                            item.applyDate = new Date(val.createDate).Format("yyyy-MM-dd hh:mm:ss");
                            item.pname = val.name;
                            item.showState = val.submit;
                            item.id = val.id;
                            this.list.push(item);
                        });
                        if(res.data.data.content.length < 20){
                            this.finished = true;
                        }
                    }else{
                        this.showEmpty = true;
                        this.finished = true;
                    }
                    this.$nextTick(() => {
                        this.loading = false;
                    })
                }).catch(err => {
                    this.loading = false;
                });
            },
            onClickLeft() {
                this.$router.push("/audit");
            },
            onClickRight() {
                this.$router.push("/sign");
            },
            onLoad() {
                // 异步更新数据
                setTimeout(() => {
                    this.getItems();
                    this.page++;
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