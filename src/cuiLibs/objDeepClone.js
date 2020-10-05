function deepClone(origin, target) {
  //target是否存在如果不存在创建空对象
  let tar = target || {},
    //判断是否为引用数据类型
    toStr = Object.prototype.toString,
    arrType = '[object Array]';
  for (let key in origin) {
    //剥离原型链的数据
    if (origin.hasOwnProperty(key)) {
      //判断是否为引用数据类型 对象或数组
      if (typeof (origin[key]) === 'object' && origin[key] !== null) {
        if (toStr.call(origin[key]) === arrType) {
          tar[key] = [];
        } else {
          tar[key] = {};
        }
        deepClone(origin[key], tar[key]);
      } else {
        tar[key] = origin[key];
      }
    }
  }
  return tar;
}
export default deepClone;
