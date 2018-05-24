import axios from 'axios';

export default class Table {
  constructor(vm, properties, buttons, conditions, getList, getCount) {
    this.vm = vm;
    this.properties = properties;
    this.buttons = buttons;
    this.conditions = conditions;
    this.getList = getList.bind(vm);
    this.getCount = getCount.bind(vm);

    this.loading = false;
    this.deleteList = [];
    this.columns = [];

    this.initColumns();
  }

  static Type = {
    View: 'primary',
    Edit: 'success',
    Del: 'error'
  };

  /**
   * 表格增加一列标题
   * @param {string} afterColumnTitle  新增列之后的列标题, 确定插入的位置
   * @param {string} currentColumnTitle  新增的列标题
   * @param {function} render  vue实例的render函数
   */
  addColumn(afterColumnTitle, currentColumnTitle, render) {
    let afterIndex = -1;

    //遍历columns找出afterColumnTitle所对应的下标
    for(let i = 0; i < this.columns.length; i++) {
      if(afterColumnTitle === this.columns[i].title) {
        afterIndex = i;

        break;
      }
    }

    //如果下标存在, 则在对应位置插入
    if(afterIndex !== -1) {
      let column = {
        title: currentColumnTitle,
        align: 'center',
        render: render
      };

      this.columns.splice(afterIndex, 0, column);
    }
  }

  /**
   * 为某一列添加过滤功能
   * @param {string} currentColumnTitle   当前列标题
   * @param {array} filters 过滤值数组
   */
  addFilterRemote(currentColumnTitle, filters) {
    //通过title确定下标
    let currentIndex = this.findIndexByTitle(currentColumnTitle);

    //如果下标存在
    if(currentIndex !== -1) {
      filters = filters.map(filter => {
        return {
          label: filter,
          value: filter
        };
      });

      //原先的属性
      let pre = this.columns[currentIndex];

      //待增加的属性
      let next = {
        filters,
        filterMultiple: false,  //不支持多值过滤
        filterRemote: (value) => {
          let key = this.columns[currentIndex].key;
          this.conditions[key] = !value.length ? '' : value[0];
          this.getList();
          this.getCount();
        }
      };

      //合并属性
      this.columns[currentIndex] = Object.assign({}, pre, next);

    }
  }

  /**
   * 通过title确定下标
   * @param {string} title
   * @return {number} 对应的下标, 否则为-1
   */
  findIndexByTitle(title) {
    //遍历columns找出title所对应的下标
    for(let i = 0; i < this.columns.length; i++) {
      if(title === this.columns[i].title) {
        return i;
      }
    }

    return -1;
  }

  /**
   * 初始化列标题
   */
  initColumns() {
    //首列固定  是否支持全选
    this.columns.push({
      type: 'selection',
      width: 60,
      align: 'center'
    });

    //根据properties数组确定各列的标题
    this.properties.forEach(property => {
      let column = {
        title: property.title,
        key: property.key,
        align: 'center'
      };

      if(property.width) {
        column.width = property.width;
      }

      this.columns.push(column);
    });

    //尾列  表示操作的按钮(详细, 编辑, 删除)
    this.columns.push({
      title: '操作',
      align: 'center',
      render: (h, params) => {
        let buttons = [];
        this.buttons.forEach(button => {
          buttons.push(this.createButton(h, button.type, button.handleClick.call(this.vm, params)));
        });

        return h('div', buttons);
      }
    });
  }

  /**
   * 根据type类型创建按钮元素
   * @param {function} h vue实例中的createElement函数
   * @param {string} type  按钮的类型
   * @param {function} handleClick 按钮的点击回调函数
   */
  createButton(h, type, handleClick) {
    return h('Button', {
      props: {
        type: Table.Type[type],
        size: 'small'
      },
      style: {
        marginRight: '5px'
      },
      on: {
        click: () => {
          handleClick();
        }
      }
    }, type);
  }

  /**
   *
   * @param selection
   * @param row
   */
  handleTableSelect(selection, row) {
    this.deleteList.push(row.Id);
  }

  /**
   *
   * @param selection
   * @param row
   */
  handleTableSelectCancel(selection, row) {
    this.deleteList.forEach((item, index) => {
      if(item === row.Id) {
        this.deleteList.splice(index, 1);
      }
    });
  }

  /**
   *
   * @param selection
   */
  handleTableSelectAll(selection) {
    this.deleteList = selection.map(item => {
      return item.Id;
    });
  }

  /**
   *
   * @param selection
   */
  handleTableSelectChange(selection) {
    if(selection.length === 0) {
      this.deleteList = [];
    }
  }

  deleteOne(row, router) {
    this.vm.$Modal.confirm({
      title: '提示',
      content: '您确定要删除吗？',
      onOk: async () => {
        const params = {
          list: [row.Id]
        };

        const result = await axios.post(`/${router}/remove`, params);
        const data = result.data;

        if(data.status === 0 && data.result) {
          this.vm.$Message.success(data.msg);
          this.afterDelete(row.Id);
        }
      }
    });
  }

  deleteMore(router) {
    if(this.deleteList.length === 0) {
      this.vm.$Notice.warning({
        title: '请至少选择一行！'
      });
    }
    else {
      this.vm.$Modal.confirm({
        title: '提示',
        content: '您确定要删除吗？',
        onOk: async () => {
          const params = {
            list: this.deleteList
          };

          const result = await axios.post(`/${router}/remove`, params);
          const data = result.data;

          this.vm.$Message.success(data.msg);
          for(let item of data.result) {
            this.afterDelete(item);
          }
        }
      });
    }
  }

  afterDelete(id) {
    if(id) {
      this.vm.data.forEach((item, index) => {
        if(id === item.Id) {
          this.vm.data.splice(index, 1);
        }
      });

      this.vm.total--;
    }
    else {
      this.deleteList.forEach(item => {
        this.afterDelete(item);
      });

      this.vm.total -= this.deleteList.length;
      this.deleteList = [];
    }
  }
}
