<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="用户名">
            <Input :value="formValidate.username" readonly></Input>
        </FormItem>
        <FormItem label="旧密码" prop="oldPassword">
            <Input type="password" v-model="formValidate.oldPassword"></Input>
        </FormItem>
        <FormItem label="新密码" prop="newPassword">
            <Input type="password" v-model="formValidate.newPassword"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="confirmPassword">
            <Input type="password" v-model="formValidate.confirmPassword"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">确认修改</Button>
            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</template>

<script>
    import Util from '../../libs/util';
    import qs from 'qs';

    export default {
        name: 'password',
        data() {
            const validateNewPassword = (rule, value, callback) => {
                if (value.length < 5) {
                    callback(new Error('密码最少5位'));
                } else {
                    this.$refs.formValidate.validateField('confirmPassword');
                    callback();
                }
            };

            const validateConfirmPassword = (rule, value, callback) => {
                if (value !== '') {
                    if (value !== this.formValidate.newPassword) {
                        callback(new Error('两次输入密码不一样'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };

            return {
                formValidate: {
                    username: '',
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                },
                ruleValidate: {
                    oldPassword: [
                        {required: true, min: 5, message: '密码最少5位', trigger: 'change'},
                    ],
                    newPassword: [
                        {validator: validateNewPassword, trigger: 'change'},
                    ],
                    confirmPassword: [
                        {validator: validateConfirmPassword, trigger: 'change'},
                    ],
                }
            };
        },
        methods: {
            init() {
                let currentUser = this.$store.state.currentUser;
                this.formValidate.username = currentUser.username;
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        Util.ajax.post('/modifyPassword', qs.stringify({
                            oldPassword: this.formValidate.oldPassword,
                            newPassword: this.formValidate.newPassword,
                        }))
                            .then(response => {
                                if (response.status === 200) {
                                    this.$Message.info('操作成功！');
                                }
                                else {
                                    this.$Message.error(response.data.message);
                                }
                            })
                            .catch(error => console.log(error));
                    }
                });
            },
            handleReset(name) {
                this.$refs[name].resetFields();
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => vm.init());
        }
        ,
    }
    ;
</script>

<style scoped>

</style>
