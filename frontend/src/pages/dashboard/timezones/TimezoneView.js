import React, { useEffect, useState } from 'react';
import { getTimezone } from './actions';
import { connect } from 'react-redux';
import {
  startDashboardLoading,
  stopDashboardLoading
} from '../../../state/actions/uiActions';
import { Card, Col, Row } from 'antd';
import styles from './Timezone.module.css';
import PropTypes from 'prop-types';
import {
  getCurrentDateTime,
  getCurrentDateTimeWithGmtOffset,
  getCurrentUtcDateTime,
  messages
} from '../../../common/utils';
import { Helmet } from 'react-helmet';
import { Tag } from 'antd';
import { ClockCircleOutlined, CompassOutlined } from '@ant-design/icons';

export const TimezoneView = (props) => {
  const { match, startDashboardLoading, stopDashboardLoading } = props;
  const [data, setData] = useState({});
  const [times, setTimes] = useState({
    utc: getCurrentUtcDateTime(true),
    browser: getCurrentDateTime(true),
    timezone: ''
  });

  useEffect(() => {
    startDashboardLoading();
    let mounted = true;
    getTimezone(match.params.timezoneId).then((res) => {
      if (!mounted) return;
      setData(res.data);
      stopDashboardLoading();
    });
    return () => {
      mounted = false;
      stopDashboardLoading();
    };
  }, []);

  useEffect(() => {
    let interval = -1;
    let mounted = true;
    if (data && data.offset) {
      interval = setInterval(() => {
        if (!mounted) return;
        const utc = getCurrentUtcDateTime(true);
        const browser = getCurrentDateTime(true);
        const timezone = getCurrentDateTimeWithGmtOffset(data.offset, true);
        setTimes({ utc, browser, timezone });
      }, 500);
    }
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [data]);

  return (
    <>
      <Helmet>
        <title>{messages.t('timezones.title_page_view')}</title>
      </Helmet>
      <Row type={'flex'} justify={'left'} aling={'left'}>
        <Col xs={24} md={10}>
          <Card
            bordered={false}
            title={data.name}
            hidden={!data.name}
            data-test={'timezoneViewCard'}
          >
            <div className={styles.timezoneItem}>
              {messages.t('timezones.city')} /{' '}
              {messages.t('timezones.gmt_offset')}
              <Tag icon={<CompassOutlined />} className={styles.timeTag}>
                {data.city} {data.offset}
              </Tag>
            </div>
            <div className={styles.timezoneItem}>
              {messages.t('timezones.utc_time')}
              <Tag
                icon={<ClockCircleOutlined />}
                color="#55acee"
                className={styles.timeTag}
              >
                {times.utc}
              </Tag>
            </div>
            <div className={styles.timezoneItem}>
              {messages.t('timezones.timezone_time')}
              <Tag
                icon={<ClockCircleOutlined />}
                color="#55acee"
                className={styles.timeTag}
              >
                {times.timezone ? times.timezone : data.date_timezone + ':00'}
              </Tag>
            </div>
            <div className={styles.timezoneItem}>
              {messages.t('timezones.browser_time')}
              <Tag
                icon={<ClockCircleOutlined />}
                color="#55acee"
                className={styles.timeTag}
              >
                {times.browser}
              </Tag>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

TimezoneView.propTypes = {
  match: PropTypes.object,
  startDashboardLoading: PropTypes.func,
  stopDashboardLoading: PropTypes.func
};

const mapActionsToProps = {
  startDashboardLoading,
  stopDashboardLoading
};

export default connect(null, mapActionsToProps)(TimezoneView);
