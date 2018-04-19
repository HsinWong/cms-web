<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="用户名" prop="username">
            <Input v-model="formValidate.username" readonly></Input>
        </FormItem>
        <FormItem label="昵称" prop="nickname">
            <Input v-model="formValidate.nickname"></Input>
        </FormItem>
        <FormItem label="邮箱地址" prop="email">
            <Input v-model="formValidate.email"></Input>
        </FormItem>
        <FormItem label="手机号" prop="mobile">
            <Input v-model="formValidate.mobile"></Input>
        </FormItem>
        <FormItem label="性别" prop="sex">
            <RadioGroup v-model="formValidate.sex">
                <Radio label="男">男</Radio>
                <Radio label="女">女</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">确认修改</Button>
            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</template>

<script>
    import Util from '../libs/util';

    export default {
        name: 'profile',
        data() {
            const validateMobile = (rule, value, callback) => {
                if (value !== '') {
                    if (!/^1\d{10}$/.test(value)) {
                        callback(new Error('只能为11位数字'));
                    }
                }
                callback();
            };

            return {
                formValidate: {
                    username: '',
                    nickname: '',
                    email: '',
                    mobile: '',
                    sex: '',
                },
                ruleValidate: {
                    username: [],
                    nickname: [
                        {required: true, message: '昵称不能为空', trigger: 'change'},
                    ],
                    email: [
                        {type: 'email', message: '格式不正确', trigger: 'change'},
                    ],
                    mobile: [
                        {validator: validateMobile, trigger: 'change'},
                    ],
                    sex: [
                        {required: true, message: '请选择性别', trigger: 'change'},
                    ],
                }
            };
        },
        methods: {
            init() {
                let currentUser = this.$store.state.currentUser;
                this.formValidate.username = currentUser.username;
                this.formValidate.nickname = currentUser.nickname;
                this.formValidate.email = currentUser.email;
                this.formValidate.mobile = currentUser.mobile;
                this.formValidate.sex = currentUser.sex;
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        Util.ajax.patch('/users/' + Util.getTokenInfo().userId, this.formValidate)
                            .then(response => {
                                this.$store.commit('updateCurrentUser', this.formValidate);
                                this.$Message.info('操作成功！');
                            })
                            .catch(error => console.log(error));
                    }
                });
            },
            handleReset(name) {
                this.init();
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
