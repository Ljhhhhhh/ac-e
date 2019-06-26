import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Input, message } from "antd";
import {Link} from 'react-router-dom'
import CustomerApi from "../../api/customer";
import {formatTime} from '../../utils'
import './index.scss'

const FormItem = Form.Item;
const customerApi = new CustomerApi();

const Info = props => {
  const [userinfo, setUserinfo] = useState({})

  return (
    <Row type="flex" justify="center" >
      <Col md={13} xs={24}>
        <FindInfo setUserinfo={setUserinfo} state={props.location.state} />
      </Col>
      {
        userinfo.username ? (<Col md={13} xs={24}>
          <div className="userinfo">
            <p><span>姓名：</span><em>{userinfo.username}</em></p>
            <p><span>性别：</span><em>{!!userinfo.sex ? '女' : '男'}</em></p>
            <p><span>身份证号：</span><em>{userinfo.identity}</em></p>
            <p><span>服务卡号：</span><em>{userinfo.card_no}</em></p>
            <p><span>服务密码：</span><em>{userinfo.pwd}</em></p>
            <p><span>到期时间：</span><em>{formatTime(userinfo.exp_time)}</em></p>
          </div>
        </Col>) : null
      }
    </Row>
  );
};

let FindInfo = props => {
  const { getFieldDecorator, validateFields, getFieldsValue } = props.form;

  const [cardNo, setCardNo] = useState('')

  useEffect(() => {
    if (props.state && props.state.card_no) {
      setCardNo(props.state.card_no)
    }
  }, [])

  useEffect(() => {
    if (!cardNo) return;
    customerApi.getInfo(cardNo).then(res => {
      if (res.code === 0) {
        props.setUserinfo(res.data.userinfo);
      } else {
        message.info(res.msg)
      }
    })
  }, [cardNo])

  const handleSubmit = () => {
    validateFields((err, values) => {
      if (!err) {
        const {key} = getFieldsValue();
        setCardNo(key);
        // customerApi.getInfo(key).then(res => {
        //   if (res.code === 0) {
        //     props.setUserinfo(res.data.userinfo);
        //   } else {
        //     message.info(res.msg)
        //   }
        // })
      } else {
        Object.keys(err).forEach(v => {
          message.error(err[v].errors[0].message);
        });
        return false;
      }
    });
  };

  return (
    <Form >
      <FormItem label="服务卡号">
        {getFieldDecorator("key", {
          initialValue: "",
          rules: [
            {
              required: true,
              message: "服务卡号不能为空"
            }
          ]
        })(<Input placeholder="请输入服务卡号" />)}
      </FormItem>
      <FormItem>
        <Button type="dashed" onClick={handleSubmit}>
          查询
        </Button>
        <Link style={{marginLeft: '20px'}} to='/'>去激活</Link>
      </FormItem>
    </Form>
  );
};

FindInfo = Form.create()(FindInfo);

export default Info;
