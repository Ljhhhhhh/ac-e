import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Input, Row, Col, Form } from "antd";
import { Link } from "react-router-dom";
// import { withRouter } from "react-router";
import exportExcel from '../../utils/excel';
import CustomerApi from "../../api/customer";
import {formatTime} from '../../utils'

const FormItem = Form.Item;
const customerApi = new CustomerApi();

const Customer = () => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const [cardNo, setCardNo] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const data = {
      page,
      card_no: cardNo,
      username
    };
    customerApi.fetchList(data).then(res => {
      const { customer, total } = res.data;
      const list = customer.map(card => {
        card.key = card.card_no;
        card.sex = card.sex === 0 ? '男' : '女'
        card.exp_time = formatTime(card.exp_time)
        return card;
      });
      setTotal(total);
      setList(list);
    });
  }, [page, cardNo, username]);

  const downloadExcel = useCallback(() => {
    const column = [
      {
        title: "姓名",
        dataIndex: "username",
        key: "username"
      },
      {
        title: "性别",
        dataIndex: "sex",
        key: "sex"
      },
      {
        title: "身份证",
        dataIndex: "identity",
        key: "identity",
      },
      {
        title: "服务卡号",
        dataIndex: "card_no",
        key: "card_no"
      },
      {
        title: "到期时间",
        dataIndex: "exp_time",
        key: "exp_time"
      }
    ];
    exportExcel(column, list, '用户表')
  }, [list]);

  const columns = [
    {
      title: "姓名",
      dataIndex: "username",
      key: "username"
    },
    {
      title: "性别",
      dataIndex: "sex",
      key: "sex"
    },
    {
      title: "身份证",
      dataIndex: "identity",
      key: "identity",
    },
    {
      title: "服务卡号",
      dataIndex: "card_no",
      key: "card_no"
    },
    {
      title: "到期时间",
      dataIndex: "exp_time",
      key: "exp_time"
    },
  ];

  return (
    <div>
      <div className="handle-wrap">
        <div className="search-form">
          <FilterForm setCardNo={setCardNo} setPage={setPage} setUsername={setUsername} />
        </div>
        <div className="handle-add">
          <Link to="/card" className="link">
            查看卡号表
          </Link>
          <Button type="primary" icon="download" onClick={downloadExcel}>
            导出
          </Button>
        </div>
      </div>
      <Table
        pagination={{
          current: page,
          total: total,
          pageSize: 100,
          onChange: p => {
            setPage(p);
          }
        }}
        bordered
        columns={columns}
        dataSource={list}
      />
    </div>
  );
};

let FilterForm = props => {
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  } = props.form;

  const { setCardNo, setPage, setUsername } = props;

  const handleSearch = useCallback(() => {
    validateFields((err, values) => {
      if (!err) {
        const { card_no, username } = getFieldsValue();
        setCardNo(card_no);
        setUsername(username)
        setPage(1);
      }
    });
  });

  const resetForm = useCallback(() => {
    resetFields();
    setCardNo("");
    setUsername("");
    setPage(1);
  }, []);

  return (
    <Row gutter={10}>
      <Form>
        <Col span={4}>
          <FormItem>
            {getFieldDecorator("username", {
              initialValue: ""
            })(<Input placeholder="请输入用户姓名" />)}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem>
            {getFieldDecorator("card_no", {
              initialValue: ""
            })(<Input placeholder="请输入服务卡号" />)}
          </FormItem>
        </Col>
      </Form>
      <Button
        className="search-btn"
        icon="search"
        type="primary"
        onClick={handleSearch}>
        搜索
      </Button>
      <Button className="search-btn" icon="reload" onClick={resetForm}>
        重置
      </Button>
    </Row>
  );
};

FilterForm = Form.create()(FilterForm);

export default Customer;