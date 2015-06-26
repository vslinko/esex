import NProgress from 'nprogress'

export default async function progressIndicator(executor) {
  NProgress.start()
  NProgress.set(0.3)

  const interval = setInterval(() => NProgress.inc(), 500)

  try {
    return await executor()
  } finally {
    clearInterval(interval)
    NProgress.done()
  }
}
