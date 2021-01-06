class HVue {
  constructor(options) {
    // 保存选项
    this.$options = options
    this.$data = options.data

    // 数据响应式处理
    observe(this.$data)

    // 代理data到hvue实例上
    proxy(this)

    // 编译
    new Compile(options.el, this)
  }
}

class Compile {
  constructor(el, vm) {
    this.$el = document.querySelector(el)
    this.$vm = vm

    // 根据dom渲染
    this.compile(this.$el)
  }

  /**
   * 遍历el dom树
   * @param {Object} el el dom树
   */
  compile(el) {
    el.childNodes.forEach(node => {
      if (this.isElement(node)) { // 如果是元素
        // console.log("编译元素", node.nodeName);

        // 处理属性和子节点
        this.compileElement(node)

        // 递归子节点
        if (node.childNodes && node.childNodes.length) {
          this.compile(node)
        }
      } else if (this.isInter(node)) { // 如果是文本
        console.log("编译插值表达式", node.textContent);

        // 获取表达式的值并赋值给node
        this.compileText(node)
      }
    })
  }

  /**
   * 判断节点是不是元素（标签）
   * @param {Object} node 节点
   */
  isElement(node) {
    return node.nodeType === 1
  }

  /**
   * 判断节点是不是文本 {{xxx}}
   * @param {Object} node 节点
   */
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }

  /**
   * 判断是否是一个指令
   * @param {String} attr 属性名称
   */
  isDir(attr) {
    return attr.startsWith('h-')
  }


  update(node, exp, dir) {
    // init
    // 每一个指令都有一个updater方法，比如h-text有textUpdater方法，该方法接收2个参数，node和值
    const fn = this[dir + 'Updater']
    fn && fn(node, this.$vm[exp])

    // update: 创建watcher
    new Watcher(this.$vm, exp, function(val) {
      fn && fn(node, val)
    })
  }

  /**
   * 处理元素的所有动态属性
   * @param {Object} node 节点
   */
  compileElement(node) {
    // node.attributes是一个类数组对象 需先转换成数组
    Array.from(node.attributes).forEach(attr => {
      console.log(attr)
      const attrName = attr.name
      const exp = attr.value

      // 判断是否是一个指令
      if (this.isDir(attrName)) {
        // 执行指令处理函数
        // h-text 关心text
        const dir = attrName.substring(2)
        this[dir] && this[dir](node, exp)
      }
    })
  }

  // 编译文本
  compileText(node) {
    this.update(node, RegExp.$1, 'text')
  }

  // h-text处理函数
  text(node, exp) {
    this.update(node, exp, 'text')
  }

  textUpdater(node, val) {
    node.textContent = val
  }

  // h-html处理函数
  html(node, exp) {
    this.update(node, exp, 'html')
  }

  htmlUpdater(node, val) {
    node.innerHTML = val
  }
}

/**
 * 递归遍历obj， 动态拦截obj的所有的key
 * @param {Object} obj 
 */
function observe(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // 每出现一个对象 创建一个Observer实例
  new Observer(obj)
}

/**
 * 代理data到hvue实例上
 * @param {Object} vm 上下文 this
 */
function proxy(vm) {
  Object.keys(vm.$data).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key]
      },
      set(v) {
        vm.$data[key] = v
      }
    })
  })
}

/**
 * 判断obj传入的类型，并做响应式处理
 */
class Observer {
  constructor(obj) {
    this.value = obj

    if (Array.isArray(obj)) {
      // todo
    } else {
      this.walk(obj)
    }
  }

  /**
   * 将对象响应式处理
   * @param {Object} obj 传入的对象
   */
  walk(obj) {
    Object.keys(obj).forEach(k => {
      defineReactive(obj, k, obj[k])
    })
  }
}


class Watcher {
  constructor(vm, key, updateFn) {
    // hvue实例
    this.vm = vm
    // 依赖key
    this.key = key
    // 更新函数
    this.updateFn = updateFn

    // 读取key的值，触发get 收集依赖
    Dep.target = this
    this.vm[this.key]
    Dep.target = null
  }

  // 更新
  update() {
    // 改变hvue依赖的key的指向
    this.updateFn.call(this.vm, this.vm[this.key])
  }
}

class Dep {
  constructor() {
    this.deps = []
  }

  addDep(dep) {
    this.deps.push(dep)
  }

  notify() {
    this.deps.forEach(dep => {
      dep.update()
    })
  }
}

/**
 * 将传入的obj，动态的设置一个key，它的值是val
 * @param {Object} obj 要接收的对象
 * @param {String} key 要设置的键
 * @param {*} val 要设置的值
 */
function defineReactive(obj, key, val) {
  // * 如果原始对象的值是对象，那么还是需要递归遍历该值
  observe(val);

  const dep = new Dep()
  // - 要拦截的对象obj
  // - 要设置的属性名称
  // - descriptor属性描述器，是一个对象，里面有set和get方法
  Object.defineProperty(obj, key, {
    get() {
      // 返回的是最新的值
      console.log('get key', key); // sy-log
      // 依赖收集
      Dep.target && dep.addDep(Dep.target)
      return val;
    },
    set(v) {
      // 如果老的值与新传进来的值不相等 设置为最新的值。这样get里面拿到的就是最新的值
      if (val !== v) {
        console.log('set key', key); // sy-log
        // 因为传入的新值v可能还是一个对象， 所以需要遍历。
        observe(v);
        val = v;

        dep.notify()
      }
    },
  });
}

