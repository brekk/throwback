const ds = require(`dualshock-controller`)
const controller = ds({
  config: `dualShock4-alternate-driver`,
  accelerometerSmoothing: true
})
// const K = (x) => () => x
const Klog = (x) => (e) => console.log(`event: ${x}`, e)
const blog = (x) => ([x, Klog(x)])
const hog = (x) => {
  console.log(`adding ${x}`)
  controller.on.apply(controller, blog(x))
}

[
  `square:release`,
  `circle:release`,
  `triangle:release`,
  `x:release`,
  `left:move`,
  `right:move`,
  `dpadright:release`,
  `dpadleft:release`,
  `dpadup:release`,
  `dpaddown:release`
].map(hog)
