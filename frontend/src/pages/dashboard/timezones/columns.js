import { calculateDateDifference, dashboardLink } from '../../../common/utils';
import { browserTime } from './TimezonesList';
import { Button, Space, Tag, Popconfirm } from 'antd';
import React from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { TIMEZONES_PAGE_URI } from '../../../common/pages';

export const getColumns = (messages, deleteAction) => [
  {
    title: messages.t('general.name'),
    dataIndex: 'name',
    sorter: true,
    render: (name) => `${name}`,
    width: '20%'
  },
  {
    title: messages.t('timezones.city'),
    dataIndex: 'city',
    sorter: true,
    render: (city) => `${city}`,
    width: '20%'
  },
  {
    title: messages.t('timezones.gmt_offset'),
    dataIndex: 'offset',
    sorter: true,
    render: (offset) => `${offset}`,
    width: '15%'
  },
  {
    title: messages.t('timezones.timezone_time'),
    dataIndex: 'date_timezone',
    render: (date) => {
      return <Tag color={'blue'}>{date}</Tag>;
    },
    width: '15%'
  },
  {
    title: messages.t('timezones.browser_time'),
    dataIndex: 'id',
    render: () => {
      return <Tag color={'blue'}>{browserTime}</Tag>;
    },
    width: '15%'
  },
  {
    title: messages.t('timezones.difference_browser'),
    dataIndex: 'id',
    render: (id, obj) => {
      let diff = calculateDateDifference(
        browserTime,
        obj.date_timezone
      ).toString();
      if (diff) {
        let color = 'green';
        if (diff[0] === '-') {
          color = 'red';
        }
        return (
          <Tag color={color} style={{ width: '60px', textAlign: 'center' }}>
            {diff}
          </Tag>
        );
      }
    },
    width: '10%'
  },
  {
    title: messages.t('general.actions'),
    dataIndex: 'id',
    render: (id) => {
      return (
        <Space>
          <Link to={dashboardLink(TIMEZONES_PAGE_URI + `/view/${id}`)}>
            <Button icon={<SearchOutlined />} />
          </Link>
          <Link
            to={{
              pathname: dashboardLink(TIMEZONES_PAGE_URI + `/edit/${id}`),
              referrer: window.location.pathname
            }}
          >
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title={messages.t('general.confirm')}
            onConfirm={() => deleteAction(id)}
            okText={messages.t('general.yes')}
            cancelText={messages.t('general.no')}
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      );
    },
    width: '20%'
  }
];
