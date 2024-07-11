import puppeteer from 'puppeteer'
import { spawn } from 'child_process'

// 获取用户在终端输入的中文内容
const TEXTCONENT = process.argv[2]

// 创建浏览器
const brower = await puppeteer.launch({
  // 浏览器将以有头模式运行，显示在屏幕上，可以看到浏览器的用户界面
  headless: false,
})

// 创建页面
const page = await brower.newPage()

// 跳转页面
await page.setViewport({ width: 1366, height: 768 })
await page.goto('https://www.juejin.cn')

// 等待指定要操作的元素出现之后，再进行后续操作
await page.waitForSelector('.side-navigator-wrap')

// 获取元素
const elements = await page.$$('.side-navigator-wrap .nav-item-wrap span')
const collectFn = async () => {
  const titleList = []
  await page.waitForSelector('.entry-list')
  const elements = await page.$$('.entry-list .title-row a')
  for await (const el of elements) {
    const prop = await el.getProperty('innerText')
    const text = await prop.jsonValue()
    titleList.push(text)
  }
  const pyProcess = spawn('python', ['index.py', titleList.join(',')])
  pyProcess.stdout.on('data', (data) => {})

  pyProcess.stderr.on('data', (data) => {})

  pyProcess.on('close', (code) => {
    console.log(`子进程已退出，退出码 ${code}`)
  })
}
for await (const el of elements) {
  const prop = await el.getProperty('innerText')
  const text = await prop.jsonValue()
  if (text === (TEXTCONENT || '前端')) {
    await el.click()
    collectFn()
    break
  }
}
