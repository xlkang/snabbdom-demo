
import LowFramworkApp from './LowFramworkApp'
import { originalData } from './utils/originalData'

export default class Movie extends LowFramworkApp {
  constructor(){
    super()
    this.state = {
      nextKey: 11,
      margin: 8,
      totalHeight: 0,
      sortBy: 'rank',
      data: [
        originalData[0], 
        originalData[1], 
        originalData[2], 
        originalData[3], 
        originalData[4], 
        originalData[5], 
        originalData[6], 
        originalData[7], 
        originalData[8], 
        originalData[9]
      ],
    }
    
    this._movieView = this._movieView.bind(this)
    this._add = this._add.bind(this)
    this._remove = this._remove.bind(this)
    this._view = this._view.bind(this)
    this._changeSort = this._changeSort.bind(this)
    this._renderMovie = this._renderMovie.bind(this)
  }

  // 初始化
  init() {
    return this._view(this.state.data);
  }

  // 排序
  _changeSort(sortBy) {
    const sorter = (a, b) => {
      const sortBy = this.state.sortBy;
      if (a[sortBy] > b[sortBy]) {
        return 1;
      }
      if (a[sortBy] < b[sortBy]) {
        return -1;
      }
      return 0;
    }

    const newData = [...this.state.data];
    this.setState('sortBy', sortBy);
    this.setState('data', newData.sort(sorter));
    
    // 手动渲染
    this._renderMovie();
  }

  // 添加
  _add() {
    const n = originalData[Math.floor(Math.random() * 10)];
    const { nextKey } = this.state;
    const newData = [{ rank: nextKey, title: n.title, desc: n.desc, elmHeight: 0 }].concat(this.state.data);
    // nextKey移动一位
    this.setState(
      'nextKey',
      nextKey + 1
    )
    this.setState(
      'data',
      newData
    )
    // 第一次将新添加的元素高度计算出来
    this._renderMovie();
    // 第二次重新渲染
    this._renderMovie();
  }

  // 删除
  _remove(movie) {
    const newData = this.state.data.filter(function (m) {
      return m !== movie;
    });

    this.setState('data', newData);
    this._renderMovie();
  }

  _view(newData) {
    const { _h, _changeSort, _add, sortBy, totalHeight }= this;

    const vnode = _h('div', 
      [
        _h('h1', 'Top 10 movies'), 
        _h('div', [
          _h('a.btn.add', { on: { click: _add } }, 'Add'), 
          'Sort by: ', 
          _h('span.btn-group', [
            _h('a.btn.rank', { 'class': { active: sortBy === 'rank' }, on: { click: [_changeSort, 'rank'] } }, 'Rank'), 
            _h('a.btn.title', { 'class': { active: sortBy === 'title' }, on: { click: [_changeSort, 'title'] } }, 'Title'), 
            _h('a.btn.desc', { 'class': { active: sortBy === 'desc' }, on: { click: [_changeSort, 'desc'] } }, 'Description')
          ])
        ]), 
        _h('div.list', { style: { height: totalHeight + 'px' } }, newData.map(this._movieView))
      ]);

    return vnode
  }

  // 电影列表视图
  _movieView(movie) {
    const { _h, _remove } = this
    const self = this

    return _h('div.row', {
      key: movie.rank,
      style: {
        opacity: '0', 
        transform: 'translate(-200px)',
        delayed: { transform: 'translateY(' + movie.offset + 'px)', opacity: '1' },
        remove: { opacity: '0', transform: 'translateY(' + movie.offset + 'px) translateX(200px)' } 
      },
      hook: { 
        insert: function insert(vnode) {
          movie.elmHeight = vnode.elm.offsetHeight;
          let newData = [...self.state.data]
          newData = newData.map(item => {
            if(item.rank === movie.rank) return {...item, elmHeight: vnode.elm.offsetHeight}
            return item
          })

          self.setState('data',
            newData
          )
        } 
      } 
    }, 
    [
      _h('div', { style: { fontWeight: 'bold' } }, movie.rank), 
      _h('div', movie.title), 
      _h('div', movie.desc), 
      _h('div.btn.rm-btn', { 
        on: { 
          click: [_remove, movie] 
        } 
      }, 'x')
    ]);
  }

  _renderMovie() {
    const { margin } = this.state;
    let newData = [...this.state.data];
    newData = newData.reduce(function (acc, m) {
      const last = acc[acc.length - 1];
      const newM = { ...m };
      // 计算offset
      newM.offset = last ? (last.offset + last.elmHeight + margin) : margin;
      return acc.concat(newM);
    }, []);

    const newTotalHeight = newData[newData.length - 1].offset + newData[newData.length - 1].elmHeight;

    this.setState('totalHeight', newTotalHeight)
    this.setState('data', newData);
    this.render(this._view(newData))
  }
}