import childProcess from 'child_process'

export const useIf = (condition, value) =>
  condition ? value : undefined

export const prepareArray = (array) =>
  array.filter(item => item !== undefined)

export const mergeArrays = (...arrays) =>
  arrays.reduce((left, right) => [...left, ...right])

export const mergeObjects = (...objects) =>
  Object.assign({}, ...objects)

export const webpackCallback = ({onReady, onChange}) => {
  let first = true

  return (error, stats) => {
    if (error) {
      console.log(error) // eslint-disable-line no-console
    } else {
      console.log(stats.toString()) // eslint-disable-line no-console
    }

    if (first) {
      first = false
      if (onReady) {
        onReady()
      }
    } else if (onChange) {
      onChange()
    }
  }
}

export const runCommand = (command, args, callback) => {
  const options = {
    stdio: 'inherit'
  }

  childProcess.spawn(command, args, options)
    .on('close', code =>
      code > 0
        ? callback(new Error(command + ' exited with code ' + code))
        : callback()
    )
}
