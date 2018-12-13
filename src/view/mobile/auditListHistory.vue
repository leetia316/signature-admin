<template>
    <div>
        <div>
            <van-nav-bar
                :title= "myTitle"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft">
            </van-nav-bar>
        </div>
        <div>
            <form action="/">
                <van-search
                    v-model="search"
                    show-action
                    @search="getItems"
                >
                <div slot="action" @click="getItems">搜索</div>
                </van-search>
            </form>
        </div>
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
                    <div style=" display: flex;">
                        <div style="width:95%">
                            <div style="float: left;padding:5px 0;font-size: 22px;font-weight: bold">
                                <span>{{item.pname}}</span>
                            </div>
                            <div style="clear:both;line-height:24px;padding:5px 0;font-size: 14px">
                                <span style="float:left;">申请人：{{item.applyUser}}</span>
                                <span style="float:right;">时间： {{item.applyDate}}</span>
                            </div>
                        </div>
                    </div>
                </van-cell>
            </van-list>
        </div>
        </div>
</template>

<script>
    import Toast from "vant/es/toast/index";

    export default {
        name: "auditListHistory",
        data() {
            return {
                myTitle: "已审批列表(0)",
                search: "",
                list: [],
                loading: false,
                finished: false
            };
        },
        created() {
            this.getItems();
        },
        methods: {
            getItems(){
                this.loading = true;
                this.List = [];
                let url = "/rxswt/user/getAuditList" + "?userId=1&isAudited=true";
                this.axios.get(url,{
                    headers: {
                        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code === 200 && res.data.data.length > 0) {
                        this.myTitle = "已审批列表(" + res.data.data.length + ")";
                        res.data.data.forEach((val,ind) => {
                            let item = {};
                            item.applyDate = new Date(val.applyDate).Format("yyyy-MM-dd hh:mm:ss");
                            item.applyDept = val.applyDept;
                            item.applyUser = val.applyUser;
                            item.pname = val.pname;
                            item.procdureId = val.procdureId;
                            this.list.push(item);
                        });
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
                this.$router.back()
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