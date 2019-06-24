import React from "react";
import { Row, Col, Form, Input, Button, message, Radio } from "antd";
import UserApi from "../../api/user";
import Storage from "../../utils/storage";
import { withRouter } from "react-router";
import "./index.scss";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const userApi = new UserApi();
const storage = new Storage();

const Layout = {
  xs: 20,
  md: 13,
}

const Login = props => {
  const { getFieldDecorator, validateFields, getFieldsValue } = props.form;
  const handleSubmit = () => {
    validateFields((err, values) => {
      if (!err) {
        const data = getFieldsValue();
        userApi.login(data).then(res => {
          if (res.status === 0) {
            res.data.role = Math.random(0, 1) >= 0.5 ? 1 : 0;
            storage.setStorage("userinfo", res.data);
            message.success("登录成功");
            props.history.replace("/");
          }
        });
      } else {
        console.log(err);
        Object.keys(err).forEach(v => {
          message.error(err[v].errors[0].message);
        });
        return false;
      }
    });
  };

  return (
    <div className="form-content">
      
      <Row type="flex" justify="center">
        <Col {...Layout} >
          <Form layout="vertical">
            <Row type="flex" justify="space-between">
              <Col span={12}>
                <FormItem label="姓名">
                  {getFieldDecorator("username", {
                    initialValue: "",
                    rules: [
                      {
                        required: true,
                        message: "姓名不能为空"
                      },
                      {
                        min: 2,
                        max: 4,
                        message: "长度不在范围内"
                      },
                      {
                        pattern: /^[\u4E00-\u9FA5A-Za-z]+$/,
                        message: "请输入姓名"
                      }
                    ]
                  })(<Input placeholder="请输入姓名" />)}
                </FormItem>
              </Col>
              <Col offset={2} span={10}>
                <FormItem label="性别">
                  {getFieldDecorator("sex", {
                    initialValue: 0
                  })(
                    <RadioGroup>
                      <Radio value={0}>男</Radio>
                      <Radio value={1}>女</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>
            <FormItem label="身份证号">
              {getFieldDecorator("identity", {
                initialValue: "",
                rules: [
                  {
                    required: true,
                    message: "身份证号不能为空"
                  },
                  {
                    pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    message: "请输入正确的身份证号"
                  }
                ]
              })(<Input placeholder="请输入身份证号" />)}
            </FormItem>
            <FormItem label="服务卡号">
              {getFieldDecorator("card_no", {
                initialValue: "",
                rules: [
                  {
                    required: true,
                    message: "服务卡号不能为空"
                  },
                  {
                    pattern: /\d{12}/,
                    message: "服务卡号有误"
                  }
                ]
              })(<Input placeholder="请输入服务卡号" />)}
            </FormItem>
            <FormItem label="激活密码">
              {getFieldDecorator("pwd", {
                initialValue: "",
                rules: [
                  {
                    required: true,
                    message: "激活密码不能为空"
                  },
                  {
                    pattern: /\d{8}/,
                    message: "激活密码有误"
                  }
                ]
              })(<Input placeholder="请输入激活密码" />)}
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={handleSubmit}>
                激活
              </Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <FindInfo getFieldDecorator={getFieldDecorator} validateFields={validateFields} getFieldsValue={getFieldsValue} />
    </div>
  );
};

const FindInfo = props => {
  const { getFieldDecorator, validateFields, getFieldsValue } = props;

  const handleSubmit = () => {
    validateFields((err, values) => {
      if (!err) {
        const data = getFieldsValue();
        userApi.login(data).then(res => {
          if (res.status === 0) {
            res.data.role = Math.random(0, 1) >= 0.5 ? 1 : 0;
            storage.setStorage("userinfo", res.data);
            message.success("登录成功");
            props.history.replace("/");
          }
        });
      } else {
        console.log(err);
        Object.keys(err).forEach(v => {
          message.error(err[v].errors[0].message);
        });
        return false;
      }
    });
  };

  return (
    <Row type="flex" justify="center">
      <Col {...Layout} ><hr/></Col>
      <Col {...Layout} >
        <h2>查询信息</h2>
      </Col>
      <Col {...Layout} >
      <Form>
        <FormItem label="服务卡号">
          {getFieldDecorator("card_no", {
            initialValue: "",
            rules: [
              {
                required: true,
                message: "服务卡号不能为空"
              },
              {
                pattern: /\d{12}/,
                message: "服务卡号有误"
              }
            ]
          })(<Input placeholder="请输入服务卡号" />)}
        </FormItem>
        <FormItem>
          <Button type="dashed" onClick={handleSubmit}>
            查询
          </Button>
        </FormItem>
      </Form>
      </Col>
    </Row>
  );
};

export default withRouter(Form.create()(Login));
