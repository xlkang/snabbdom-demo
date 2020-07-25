import { init } from 'snabbdom/build/package/init';
import { classModule } from 'snabbdom/build/package/modules/class';
import { propsModule } from 'snabbdom/build/package/modules/props';
import { styleModule } from 'snabbdom/build/package/modules/style';
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners';
import { h } from 'snabbdom/build/package/h';

export default class LowFramworkApp {
  static _vdom = null
  constructor() {
    this._components = []
    // 初始化patch方法
    this._patch = init([ // Init patch function with chosen modules
      classModule, // makes it easy to toggle classes
      propsModule, // for setting properties on DOM elements
      styleModule, // handles styling on elements with support for animations
      eventListenersModule, // attaches event listeners
    ])
    this._h = h
  }

  // 挂载视图
  addView(instance) {
    this._instance = instance
  }

  start(containerSel) {
    LowFramworkApp._containerSel = containerSel
    const container = document.getElementById(containerSel);
    const vnode = this._instance.init()
    
    // LowFramworkApp._vdom = this._patch(container, vnode);
    LowFramworkApp._vdom = this._patch(container, this._wrapContainer(containerSel,vnode));
    // TODO: 强制重新渲染一次以重新计算offert，后续优化
    this._instance._renderMovie();
    this._instance._renderMovie();
  }

  // low版setState
  setState(key, value) {
    this.state[key] = value
  }

  // 重新渲染 --> patch
  render = (newVnode) => {
    // 更新_vdom
    LowFramworkApp._vdom = this._patch(LowFramworkApp._vdom, this._wrapContainer(newVnode));
  }

  _wrapContainer (childvnode) {
    return this._h(
      `div#${LowFramworkApp._containerSel}`, 
      [childvnode]
    )
  }
}