export default function html([first, ...strings], ...values) {
  return values.reduce(
    (acc, cur) => acc.concat(cur, strings.shift()),
    [first]
  )
  .filter(x => x && x !== true || x === 0)
  .join('')
}

export function createStore(reducer) {
  let state = reducer() // use for dispatch() method
  const roots = new Map() // Map() is a special Object
  // update View
  function render() {
    for (const [root, component] of roots) {
      const output = component() // function component() { return html }
      root.innerHTML = output
    }
  }
  // return an object in order to work with Store
  return {
    // some method:
    // // attach method: get Views and push to "<div id="root"></div>"
    attach(component, root) {
      roots.set(root, component) // => roots will receive data
      render()                   // and then render() in order to update Views
    },
    // // connect method: "bridge" between Store and View
    connect(selector = state => state) {
      return component => (props, ...args) =>
        component(Object.assign({}, props, selector(state), ...args))
    },
    // // dispatch method: "bridge" between View and Actions and then push data to Reducer
    dispatch(action, ...args) {
      state = reducer(state, action, args) // modify state based on action
      render()                             // and then render() in order to update Views
    }
  }
}
