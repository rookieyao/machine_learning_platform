const debug = true
// var prev_date = new Date()
const logInfo = function (...args: (any | null)[]) {
  // const date = new Date()
  if (debug) {
    console.log(args)
    // console.log(args, date.getTime(), date.getTime() - prev_date.getTime())
    // prev_date = date
  }
  return
}
export default logInfo
