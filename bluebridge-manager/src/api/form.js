export const config = {
  username: {
    regexp: /^[a-zA-Z]\w{5,12}$/,
    text: '只能以字母开头,包含字符 数字 下划线, 长度为5 - 12'
  },
  password: {
    regexp: /^(\w){6,15}$/,
    text: '6-15个字母、数字、下划线'
  },
  email: {
    regexp: /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/,
    text: '邮箱格式不正确'
  },
  name: {
    regexp:  /^[\u4E00-\u9FA5\uf900-\ufa2d]{2,4}$/ ,
    text: '2-4个中文'
  }
};


