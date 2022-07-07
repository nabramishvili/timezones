import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Divider, Input, Space, Table } from 'antd';
import { PAGE_OPTIONS, PAGE_SIZE } from '../../../common/constants';
import { deleteTimezone, getAllTimezones, getTimezones } from './actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  convertPagination,
  dashboardLink,
  getCurrentDateTime,
  getInitialTablePagination,
  showSuccess,
  updateAntdTableFiltersUrl
} from '../../../common/utils';
import { messages } from '../../../common/utils';
import { getColumns } from './columns';
import qs from 'qs';
import { Button } from 'antd';
import {
  ClearOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { TIMEZONES_PAGE_URI, USERS_PAGE_URI } from '../../../common/pages';
import { Helmet } from 'react-helmet';

let browserTime = getCurrentDateTime();
let prevParams = null;

export const TimezonesList = ({ user, history, match, action }) => {
  const processDelete = (id) => {
    setLoading(true);
    deleteTimezone(id)
      .then(() => {
        showSuccess(messages.t('general.operation_success'));
        fetchData(prevParams);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const resetPagination = getInitialTablePagination();
  let canceled = false;
  const initialColumns = getColumns(messages, processDelete);
  const [columns, setColumns] = useState([...initialColumns]);
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState(resetPagination);
  const [loading, setLoading] = useState(true);
  const [prevSorter, setSorter] = useState(null);
  const [search, setSearch] = useState(undefined);

  useEffect(() => {
    const uriParams = qs.parse(history.location.search, {
      ignoreQueryPrefix: true
    });
    const currentPage = uriParams.page ? parseInt(uriParams.page) : 1;
    const initialPagination = {
      current: currentPage,
      pageSize: PAGE_SIZE,
      pageSizeOptions: PAGE_OPTIONS
    };
    const sortby = uriParams.sortby || undefined;
    const order = uriParams.order || undefined;
    const search = uriParams.search || undefined;
    if (order && sortby) {
      const tempColumns = [...columns];
      const filteredColumn = tempColumns.filter(
        (x) => x.dataIndex === sortby
      )[0];
      filteredColumn.sortOrder = order === 'asc' ? 'ascend' : 'descend';
      setColumns(tempColumns);
    }

    fetchData({ pagination: initialPagination, sortby, order, search });

    return () => {
      canceled = true;
    };
  }, []);

  const processSearch = () => {
    const options = { ...prevParams, search };
    options.pagination = { ...resetPagination };
    fetchData(options);
  };

  const resetSearch = () => {
    setSearch(undefined);
    if (prevParams.search) {
      fetchData({ ...prevParams, search: undefined });
    }
  };

  const fetchData = (params = {}) => {
    setLoading(true);
    const data = convertPagination({ ...params });
    let id = user.id;
    if (match.params.userId) {
      id = match.params.userId;
    }

    let fetchMethod = () => getTimezones(id, data);
    if (action && action === 'all') {
      fetchMethod = () => getAllTimezones(data);
    }

    fetchMethod()
      .then((response) => {
        if (canceled) return;
        browserTime = getCurrentDateTime();
        setTableData(response.data);
        setLoading(false);
        setPagination({
          ...params.pagination,
          total: response.meta ? response.meta.total : 0
        });
        setSorter({ sortby: params.sortby, order: params.order });
        prevParams = params;
        updateAntdTableFiltersUrl(params, history);
      })
      .catch(() => {
        if (!canceled) {
          setLoading(false);
        }
      });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    const options = {
      pagination: pagination,
      sortby: sorter.order ? sorter.field : undefined,
      order: sorter.order
        ? sorter.order === 'ascend'
          ? 'asc'
          : 'desc'
        : undefined
    };
    if (
      options.order !== prevSorter.order ||
      options.sortby !== prevSorter.sortby
    ) {
      setColumns(initialColumns);
      options.pagination = { ...resetPagination };
    }
    if (search) {
      options.search = search;
    }
    fetchData(options);
  };

  return (
    <>
      <Helmet>
        <title>{messages.t('timezones.title_page_list')}</title>
      </Helmet>
      <div className={'scrollable-space'}>
        <Space className={'table-filters-container'}>
          <Space>
            <Input
              disabled={loading}
              placeholder={messages.t('timezones.search_title')}
              value={search}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  processSearch();
                }
              }}
              onChange={(e) => setSearch(e.target.value)}
              prefix={<SearchOutlined />}
            />
            <Button
              icon={<ClearOutlined />}
              disabled={loading}
              onClick={resetSearch}
            />
            <Button disabled={loading} onClick={processSearch}>
              {messages.t('general.search')}
            </Button>
          </Space>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              disabled={loading}
              onClick={() => fetchData(prevParams)}
            >
              {messages.t('general.reload')}
            </Button>
            <Link
              to={
                !match.params.userId
                  ? dashboardLink(TIMEZONES_PAGE_URI + '/add')
                  : dashboardLink(
                      USERS_PAGE_URI +
                        `/${match.params.userId}` +
                        TIMEZONES_PAGE_URI +
                        '/add'
                    )
              }
            >
              <Button
                icon={<PlusOutlined />}
                disabled={loading}
                type={'primary'}
              >
                {messages.t('general.add_new')}
              </Button>
            </Link>
          </Space>
        </Space>
      </div>
      <Divider />
      <Table
        data-test={'timezonesTable'}
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={tableData}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        fetchData={fetchData}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.user
});

TimezonesList.propTypes = {
  user: PropTypes.object.isRequired,
  history: PropTypes.object,
  match: PropTypes.object,
  user_id: PropTypes.number,
  action: PropTypes.string
};

export default connect(mapStateToProps)(TimezonesList);
export { browserTime };
