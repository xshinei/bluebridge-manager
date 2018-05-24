<template>
  <i-form-item label="头像:" prop="avatar">
    <div class="upload-list" v-show="avatar">
      <template>
        <img :src="`${AVATAR_URL}/${avatar}`">
        <div class="upload-list-cover">
          <Icon type="ios-trash-outline" @click.native="handleDeleteAvatar"></Icon>
        </div>
      </template>
    </div>
    <Upload
      :on-success="handleUploadSuccess"
      :before-upload="handleUploadBefore"
      :on-format-error="handleUploadFormatError"
      :on-exceeded-size="handleUploadExceededSize"
      :data="{id: userId}"
      :show-upload-list="false"
      :format="IMAGE_TYPE"
      :max-size="MAX_SIZE"
      type="drag"
      :action="UPLOAD_URL"
      :headers="{Authorization: LocalStorage.getItem('token')}"
      name="avatar"
      style="display: inline-block;width:58px;">
      <div class="upload-box">
        <Icon type="camera" size="20"></Icon>
      </div>
    </Upload>
  </i-form-item>
</template>

<script>

  import axios from 'axios';
  import ServerConfig from '../api/server-config';
  import LocalStorage from '../api/local-storage';

  export default {
    props: {
      user: {
        type: String,
        required: true
      },
      userId: {
        type: String,
        default: ''
      },
      avatarName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        avatar: ''
      };
    },
    created() {
      this.UPLOAD_URL = `/${this.user}/upload`;
      this.DELETE_URL = `/${this.user}/delete`;
      this.AVATAR_URL = ServerConfig.AVATAR_URL;
      this.MAX_SIZE = 5120;
      this.IMAGE_TYPE = ['jpg','jpeg','png'];
      this.LocalStorage = LocalStorage;
    },
    mounted() {
      this.$Message.config({
        duration: 3
      });
    },
    methods: {
      /**
       *  上传成功
       * @param res 服务端返回的信息
       */
      handleUploadSuccess(res) {
        if (res.status === 0 && res.result !== '') {
          this.avatar = res.result;

          //触发头像改变事件
          this.$emit('change', this.avatar);

          //显示信息
          this.$Message.success(res.msg);
        }
      },
      /**
       * 上传之前，返回resolve继续上传，返回reject停止上传
       */
      handleUploadBefore() {
        return new Promise((resolve, reject) => {
          if(this.avatar !== '') {
            //显示模态框
            this.$Modal.confirm({
              title: '提示',
              content: '只能上传一张，重复上传将会覆盖上一张!',
              onOk: async () => {
                //点击确定
                try {
                  //删除之前上传的
                  await this.deleteAvatar();

                  resolve();
                }
                catch (err) {
                  reject();
                }
              },
              onCancel: () => {
                //点击取消
                reject();
              }
            });
          }
          else {
            resolve();
          }
        });
      },
      /**
       *  文件类型出错
       * @param file
       */
      handleUploadFormatError(file) {
        this.$Message.error(`文件${file.name} 格式不正确, 请选择png或jpg!`);
      },
      /**
       *  文件大小出错
       * @param file
       */
      handleUploadExceededSize(file) {
        const maxSize = this.MAX_SIZE / 1024;

        this.$Message.error(`文件${file.name} 超出大小限制，最大限制为${maxSize}M!`);
      },
      /**
       *  点击删除文件
       */
      handleDeleteAvatar() {
        this.deleteAvatar((msg) => {
          this.$Message.success(msg);
        });
      },
      /**
       *  删除文件
       */
      async deleteAvatar(callback) {
        try {
          //配置请求参数
          const params = {
            id: this.userId,
            avatar: this.avatar
          };

          //发送请求
          const result = await axios.post(this.DELETE_URL, params);
          const data = result.data;

          if(data.status === 0 && data.result !== '') {
            this.avatar = '';
            typeof callback === 'function' && callback(data.msg);

            return Promise.resolve();
          }

          return Promise.reject('');
        }
        catch (err) {
          console.log(err.message);
        }
      }
    },
    watch: {
      avatarName(newVal) {
        this.avatar = newVal === 'default_avatar.jpg' ? '' : newVal;
      }
    }
  }
</script>

<style scoped>
  .upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .upload-list img {
    width: 100%;
    height: 100%;
  }

  .upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .upload-list:hover .upload-list-cover {
    display: block;
  }

  .upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .upload-box {
    width: 58px;
    height: 58px;
    line-height: 58px;
  }
</style>
