<template>
    <div>
        <div>
            <span>姓名：</span>
            <Input placeholder="请输入..." style="width: auto;margin: 10px" />
            <span>角色：</span>
            <Input placeholder="请输入..." style="width: auto;margin: 10px" />
            <span>部门：</span>
            <Input placeholder="请输入..." style="width: auto;margin: 10px" />
            <Button type="primary" icon="ios-search" style="margin-left: 10px" >搜索</Button>
        </div>
        <div style="margin: 10px;">
            <Button @click="handleSelectAll(true)">全选</Button>
            <Button style="margin-left: 5px;" @click="handleSelectAll(false)">取消全选</Button>
            <Button style="margin-left: 5px;" @click="handleCreate()">新增</Button>
            <Button style="margin-left: 5px;" @click="handleEdit()">修改</Button>
            <Button style="margin-left: 5px;" @click="handleDel()">删除</Button>
        </div>
        <Table border ref="selection"
               :data="tableData1"
               :columns="tableColumns1" stripe
               @on-select="selectRow"
               @on-select-cancel ="selectRow"></Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="100" :current="1" @on-change="changePage"></Page>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                selectedRow: [],
                tableData1: this.mockTableData1(),
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
                        title: '姓名',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '角色',
                        align: 'center',
                        key: 'status',
                        render: (h, params) => {
                            return h('div', '测试角色');
                        }
                    },
                    {
                        title: '部门',
                        align: 'center',
                        key: 'createUser',
                        render: (h, params) => {
                            return h('div', '测试部门');
                        }
                    },
                    {
                        title: '备注',
                        align: 'center',
                        key: 'remark',
                        render: (h, params) => {
                            return h('div', 'Almost' + params.row.time + 'days');
                        }
                    },
                    {
                        title: '创建时间',
                        align: 'center',
                        key: 'update',
                        render: (h, params) => {
                            return h('div', this.formatDate(this.tableData1[params.index].update));
                        }
                    }
                ]
            }
        },
        methods: {
            selectRow(selection, row){
                this.selectedRow = selection;
            },
            handleCreate(){

            },
            handleEdit(){
                if(this.selectedRow.length !== 1){
                    this.$Message.warning("请选择一条数据");
                }else{

                }
            },
            updateForm(){
                if(this.selectedRow.length === 0){
                    this.$Message.warning("请选择数据");
                }else{
                    alert("请求服务");
                }
            },
            handleDel(){
                if(this.selectedRow.length === 0){
                    this.$Message.warning("请选择数据");
                }
            },
            handleSelectAll (status) {
                this.$refs.selection.selectAll(status);
            },
            mockTableData1 () {
                let data = [];
                for (let i = 0; i < 10; i++) {
                    data.push({
                        name: 'Business' + Math.floor(Math.random () * 100 + 1),
                        status: Math.floor(Math.random () * 3 + 1),
                        createUser: ['City', 'People', 'Cost', 'Life', 'Entertainment'],
                        people: [
                            {
                                n: 'People' + Math.floor(Math.random () * 100 + 1),
                                c: Math.floor(Math.random () * 1000000 + 100000)
                            },
                            {
                                n: 'People' + Math.floor(Math.random () * 100 + 1),
                                c: Math.floor(Math.random () * 1000000 + 100000)
                            },
                            {
                                n: 'People' + Math.floor(Math.random () * 100 + 1),
                                c: Math.floor(Math.random () * 1000000 + 100000)
                            }
                        ],
                        remark: "备注",
                        time: Math.floor(Math.random () * 7 + 1),
                        update: new Date()
                    })
                }
                return data;
            },
            formatDate (date) {
                const y = date.getFullYear();
                let m = date.getMonth() + 1;
                m = m < 10 ? '0' + m : m;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                return y + '-' + m + '-' + d;
            },
            changePage () {
                // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
                this.tableData1 = this.mockTableData1();
            }
        }
    }
</script>