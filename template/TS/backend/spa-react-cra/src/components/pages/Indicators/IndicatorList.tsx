import React, { FC, useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import * as api from 'service';
import { Table, Popconfirm, Tag, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { TIndicatorListReply } from 'service/api/configurationService';

const defaultParams = { offset: 0, limit: 10 };
const columns: ColumnsType<TIndicatorListReply> = [
  {
    title: 'Job ID',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    fixed: 'left',
    width: 80,
  },
  {
    title: '指标名',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: '中文名',
    dataIndex: 'chineseName',
    key: 'chineseName',
    width: 160,
  },
  {
    title: '触发方式',
    dataIndex: 'triggerMode',
    key: 'triggerMode',
    width: 120,
  },
  {
    title: '周期',
    dataIndex: 'intervalValue',
    key: 'intervalValue',
    width: 120,
    align: 'center',
  },
  {
    title: 'sql语句',
    dataIndex: 'sql',
    key: 'sql',
    width: 300,
  },
  {
    title: '标签',
    dataIndex: 'labelColumns',
    key: 'labelColumns',
    render: (labelColumns: Array<string>) => {
      return (
        labelColumns &&
        labelColumns.map((label, index) => {
          return <Tag key={index}>{label}</Tag>;
        })
      );
    },
  },
];

// 指示器列表
const IndicatorList: FC = () => {
  const [searchParams, setSearchParams] = useState(defaultParams);
  const [dataSource, setDataSource] = useState<TIndicatorListReply[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const getIndicatorsList = useCallback(
    async (params = searchParams) => {
      setTableLoading(true);
      const resData = await api.config.getIndicatorsByPage(params);
      setDataSource(resData);
      setTableLoading(false);
    },
    [searchParams]
  );

  const getIndicatorsCount = useCallback(async () => {
    const resData = await api.config.getIndicatorCount();
    setTotal(resData);
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      await api.config.delIndicatorsById(id);
      message.success('删除成功');
      getIndicatorsList();
      getIndicatorsCount();
    },
    [getIndicatorsCount, getIndicatorsList]
  );

  useEffect(() => {
    getIndicatorsList();
    getIndicatorsCount();
  }, [getIndicatorsList, getIndicatorsCount]);

  const _columns = useMemo<ColumnsType<TIndicatorListReply>>(() => {
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
              {'internal' === row.sourceType && (
                <Popconfirm
                  title="你确定要删除当前指标吗?"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => handleDelete(row.id)}
                >
                  <span>删除</span>
                </Popconfirm>
              )}
            </div>
          );
        },
      },
    ];
  }, [handleDelete]);

  return (
    <Conatiner>
      <h2>指标数据Job列表</h2>
      <Table
        rowKey="id"
        dataSource={dataSource}
        columns={_columns}
        loading={{ spinning: tableLoading, tip: '数据加载中...' }}
        scroll={{ x: 1200 }}
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
          onShowSizeChange: (current, size) => {
            const params = {
              offset: 0,
              limit: size,
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

export default IndicatorList;
