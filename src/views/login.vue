<template>
    <Row type="flex" justify="center" align="middle" class-name="fillPage bg">
        <Col :xs="{ span: 12, offset: 4 }" :sm="{ span: 8, offset: 9 }" :md="{ span: 6, offset: 11 }"
             :lg="{ span: 5, offset: 12 }">
        <Card>
            <p slot="title">
                <Icon type="log-in"></Icon>
                欢迎登录
            </p>
            <Form ref="form" :model="form" :rules="rule">
                <FormItem prop="username">
                    <Input type="text" v-model.trim="form.username" placeholder="用户名">
                    <Icon type="person" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" v-model="form.password" placeholder="密码">
                    <Icon type="locked" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('form')" long>登录</Button>
                </FormItem>
            </Form>
        </Card>
        </Col>
    </Row>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    username: '',
                    password: ''
                },
                rule: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('操作成功！');
                    } else {
                        this.$Message.error('操作失败！');
                    }
                });
            }
        }
    };
</script>

<style scoped>
    .bg {
        background: url('../images/login-bg.jpg') center;
        background-size: cover;
    }
</style>
