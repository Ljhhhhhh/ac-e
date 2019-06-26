import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Input, Row, Col, Form } from "antd";
import { Link } from "react-router-dom";
import exportExcel from '../../utils/excel';
import CardApi from "../../api/card";
import "./index.scss";

const FormItem = Form.Item;
const cardApi = new CardApi();

const Card = () => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const [key, setKey] = useState("");

  useEffect(() => {
    const data = {
      page,
      card_no: key
    };
    cardApi.getList(data).then(res => {
      const { cards, total } = res.data;
      const list = cards.map(card => {
        card.key = card.card_no;
        return card;
      });
      setTotal(total);
      setList(list);
    });
  }, [page, key]);

  const addCard = useCallback(() => {
    cardApi.addCard().then(res => {
      const newList = res.data.list.map(card => {
        card.key = card.card_no;
        return card;
      });
      const allList = [...newList, ...list];
      setList(allList);
      setTotal(total + 100);
    });
  }, [list]);

  const downloadExcel = useCallback(() => {
    const column = [
      {
        title: "服务卡号",
        dataIndex: "card_no",
        key: "card_no"
      },
      {
        title: "激活密码",
        dataIndex: "pwd",
        key: "pwd"
      }
    ];
    exportExcel(column, list)
  }, [list]);

  const columns = [
    {
      title: "服务卡号",
      dataIndex: "card_no",
      key: "card_no"
    },
    {
      title: "激活密码",
      dataIndex: "pwd",
      key: "pwd"
    },
    {
      title: "状态",
      key: "status",
      sorter: (a, b) => a.status - b.status,
      sortDirections: ["descend", "ascend"],
      render: card => {
        const used = +card.status === 1;
        const className = used ? "state-name used" : "state-name";
        return (
          <div>
            <span className={className}>{used ? "已使用" : "未使用"}</span>
          </div>
        );
      }
    }
  ];

  return (
    <div>
      <div className="handle-wrap">
        <div className="search-form">
          <FilterForm setKey={setKey} setPage={setPage} />
        </div>
        <div className="handle-add">
          <Link to="/customer" className="link">
            查看客户表
          </Link>
          <Button type="dashed" icon="plus" onClick={addCard}>
            生成100张
          </Button>
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

  const { setKey, setPage } = props;

  const handleSearch = useCallback(() => {
    validateFields((err, values) => {
      if (!err) {
        const { key } = getFieldsValue();
        setKey(key);
        setPage(1);
      }
    });
  });

  const resetForm = useCallback(() => {
    resetFields();
    setKey("");
    setPage(1);
  }, []);

  return (
    <Row gutter={10}>
      <Form>
        <Col span={4}>
          <FormItem>
            {getFieldDecorator("key", {
              initialValue: "",
              rules: [
                {
                  required: true,
                  message: "请输入卡号"
                }
              ]
            })(<Input placeholder="请输入卡号" />)}
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

export default Card;
