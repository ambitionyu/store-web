<template>
    <div class="standardTable">
        <div class="tableAlert">
            <Alert
                type="info"
                showIcon
            >
                <template slot="message">
                    已选择 <a style="font-weight: 600;">{{ selectedRowKeys.length }}</a> 项&nbsp;&nbsp;
                    <span v-for="item in needTotalList" style="margin-left: 8px;" :key="item.dataIndex">
                    </span>
                    <a @click="cleanSelectedKeys" style="margin-left: 16px;">
                        清空
                    </a>
                </template>
            </Alert>
        </div>
        <a-table
            :loading="loading"
            :rowKey="rowKey || 'key'"
            :rowSelection="{
                selectedRowKeys: selectedRowKeys,
                onChange: handleRowSelectChange,
                getCheckboxProps: record => ({
                    disabled: record.disabled,
                }),
            }"
            :dataSource="list"
            :columns="columns"
            :pagination="tablePagination"
            @change="handleTableChange"
        >
        </a-table>
      </div>
</template>

<script>
import { Alert} from "ant-design-vue";
export default {
  name: "StandardTable",
  components: {
    Alert,
  },
  props: {

    pagination: {
      type: Object,
      default: () => {
        {
        }
      }//分页参数
    },
    onChange: {//选中项变化发生的回调
      type: Function,
      default: () => {}
    },
    onSelectRow: {
      type: Function,
      default: () => {}
    },
    columns: {
      type: Array,
      default: () => {
        [];
      }
    },
    list: {
      type: Array,
      default: () => {
        [];
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    rowKey: {
      type: String,
      default: ""
    }
  },
  computed: {
    tablePagination() {
      return {
        //showSizeChanger: true,
        //showQuickJumper: true,
        ...this.pagination,
          defaultPageSize:10
      };
    }
  },
  data() {
    return {
      selectedRowKeys: [],
      needTotalList: this.initTotalList(this.columns)
    };
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      this.onChange(pagination, filters, sorter);
    },
    cleanSelectedKeys() {
      this.handleRowSelectChange([], []);
    },
    handleRowSelectChange(selectedRowKeys, selectedRows) {
      let needTotalList = [...this.needTotalList];
      needTotalList = needTotalList.map(item => {
        return {
          ...item,
        };
      });

      if (this.onSelectRow) {
        this.onSelectRow(selectedRows);
      }
      this.selectedRowKeys = selectedRowKeys;
      this.needTotalList = needTotalList;
    },
    initTotalList(columns) {
      const totalList = [];
      columns.forEach(column => {
        if (column.needTotal) {
          totalList.push({ ...column, total: 0 });
        }
      });
      return totalList;
    }
  }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
