import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import Query from './Query';
import * as api from 'service';
import { Table, Popconfirm, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { TJobListReply } from 'service/api/configurationService';

const defaultParams = { offset: 0, limit: 10 };
const columns: ColumnsType<TJobListReply> = [
  {
    title: 'Job ID',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
  },
  {
    title: 'Job名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '业务数据名称',
    dataIndex: 'dataName',
    key: 'dataName',
    width: 120,
    render: (val, row) => {
      return row?.storage?.target || '--';
    },
  },
  {
    title: '业务数据来源',
    dataIndex: 'source',
    key: 'source',
    align: 'center',
    render: (val, row) => {
      return row?.dataSource?.kind || '--';
    },
  },
  {
    title: '周期',
    dataIndex: 'intervalValue',
    key: 'intervalValue',
  },
  {
    title: '模型版本',
    dataIndex: 'modelVersion',
    key: 'modelVersion',
    align: 'center',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
];

// 可用流程列表
const ProcessList: FC = () => {
  const [searchParams, setSearchParams] = useState(defaultParams);
  const [dataSource, setDataSource] = useState<TJobListReply[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const getProcessList = useCallback(
    async (params = searchParams) => {
      setTableLoading(true);
      const resData = await api.config.getJobsByPage(params);
      setDataSource(resData);
      setTableLoading(false);
    },
    [searchParams]
  );

  const getProcessCount = useCallback(async () => {
    const resData = await api.config.getJobCount();
    setTotal(resData);
  }, []);

  const handleDelete = useCallback(
    async (jobId: number) => {
      await api.config.delJobById(jobId);
      message.success('删除成功');
      getProcessList(searchParams);
      getProcessCount();
    },
    [getProcessCount, getProcessList, searchParams]
  );

  useEffect(() => {
    getProcessList();
    getProcessCount();
  }, [getProcessCount, getProcessList]);

  const _columns = useMemo<ColumnsType<TJobListReply>>(() => {
    return [
      ...columns,
      {
        title: '操作',
        dataIndex: 'operations',
        fixed: 'right',
        render: (val, row) => {
          return (
            <div className="table-actions">
              {/* <span style={{ marginRight: 5 }} onClick={handleSwithJobStatus}>
              停止
            </span> */}
              <Popconfirm
                title="你确定要删除当前Job吗?"
                okText="确定"
                cancelText="取消"
                onConfirm={() => handleDelete(row.id)}
              >
                <span>删除</span>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
  }, [handleDelete]);

  return (
    <Conatiner>
      <h2>业务数据Job列表</h2>
      <Query />
      <Table
        rowKey="id"
        dataSource={dataSource}
        columns={_columns}
        loading={{ spinning: tableLoading, tip: '数据加载中...' }}
        pagination={{
          total,
          showTotal: (total) => `共 ${total} 条数据`,
          onChange: (page) => {
            const params = {
              ...searchParams,
              offset: searchParams.limit * (page - 1),
            };
            setSearchParams(params);
          },
          onShowSizeChange: (current, pageSize) => {
            const params = {
              offset: 0,
              limit: pageSize,
            };
            setSearchParams(params);
          },
        }}
      ></Table>
    </Conatiner>
  );
};

const Conatiner = styled.div`
  .table-actions {
    span {
      color: #2c84d2;
      &:hover {
        cursor: pointer;
      }
    }
  }
`;

export default ProcessList;
