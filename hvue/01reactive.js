/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
// vue1和vue2中利用Object.defineProperty()这个api来实现数据的响应式。

/**
 * 将传入的obj，动态的设置一个key，它的值是val
 * @param {Object} obj 要接收的对象
 * @param {String} key 要设置的键
 * @param {*} val 要设置的值
 */
function defineReactive(obj, key, val) {
  // * 如果原始对象的值是对象，那么还是需要递归遍历该值
  observe(val);
  // - 要拦截的对象obj
  // - 要设置的属性名称
  // - descriptor属性描述器，是一个对象，里面有set和get方法
  Object.defineProperty(obj, key, {
    get() {
      // 返回的是最新的值
      console.log('get key', key); // sy-log
      return val;
    },
    set(v) {
      // 如果老的值与新传进来的值不相等 设置为最新的值。这样get里面拿到的就是最新的值
      if (val !== v) {
        console.log('set key', key); // sy-log
        // 因为传入的新值v可能还是一个对象， 所以需要遍历。
        observe(v);
        val = v;
      }
    },
  });
}

/**
 * 动态的设置值，使其变成响应式
 * @param {Object} obj 传入的对象
 * @param {String} key 要设置的键
 * @param {*} val 要设置的值
 */
function set(obj, key, val) {
  defineReactive(obj, key, val);
}

/**
 * 递归遍历传入的对象，动态拦截该对象上的所有的key
 * @param {Object} obj 要递归遍历的对象
 */
function observe(obj) {
  // 如果传入的不是对象 直接返回该值
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  Object.keys(obj).forEach((key) => {
    // 响应式的设置值。
    defineReactive(obj, key, obj[key]);
  });
}

const obj = {
  foo: 'foo',
  bar: 'bar',
  baz: {
    a: 1,
  },
};
// defineReactive(obj, 'name', 'henry');
observe(obj);
obj.name;
obj.name = 'foooooo';
set(obj, 'baz', { a: 10 });
console.log(obj.baz);
