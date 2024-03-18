/**
 * 创建本地缓存对象
 * @param {string=} prefixKey -
 * @param {object} [storage=localStorage] - sessionStorage | localStorage
 */

export default class Storage {
  private storage: globalThis.Storage
  private prefixKey?: string

  constructor(prefixKey = '', storage = localStorage) {
    this.storage = storage
    this.prefixKey = prefixKey
  }

  private getKey(key: string) {
    return `${this.prefixKey}${key}`.toUpperCase()
  }

  /**
   * @description 设置缓存
   * @param {string} key 缓存键
   * @param {*} value 缓存值
   */
  set(key: string, value: any) {
    const stringData = JSON.stringify({
      value,
    })
    this.storage.setItem(this.getKey(key), stringData)
  }

  /**
   * 读取缓存
   * @param {string} key 缓存键
   * @param {*=} def 默认值
   */
  get(key: string, def: any = null) {
    const item = this.storage.getItem(this.getKey(key))
    if (item) {
      try {
        const data = JSON.parse(item)
        const { value } = data
        return value
      }
      catch (e) {
        return def
      }
    }
    return def
  }

  /**
   * 从缓存删除某项
   * @param {string} key
   */
  remove(key: string) {
    this.storage.removeItem(this.getKey(key))
  }

  /**
   * 清空所有缓存
   * @memberOf Cache
   */
  clear(): void {
    this.storage.clear()
  }
}

export const storage = new Storage('')
