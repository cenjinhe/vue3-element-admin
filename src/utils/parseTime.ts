/**
 * 时间格式化工具函数（修复 ISO 格式解析问题）
 * @param time 要格式化的时间（时间戳/Date/字符串/ISO 8601 格式）
 * @param format 格式化模板，默认 '{y}-{m}-{d} {h}:{i}:{s}'
 * @returns 格式化后的时间字符串
 */
export function parseTime(
    time: number | string | Date | null | undefined,
    format = '{y}-{m}-{d} {h}:{i}:{s}'
): string {
    // 处理空值
    if (!time) return ''

    // 统一转换为 Date 对象
    let date: Date
    if (typeof time === 'number') {
        // 处理时间戳（兼容秒/毫秒级）
        date = new Date(time.toString().length === 10 ? time * 1000 : time)
    } else if (typeof time === 'string') {
        // 修复核心：区分处理 ISO 格式和普通日期字符串
        const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/
        if (isoRegex.test(time)) {
            // ISO 8601 格式（带 T/Z）：直接解析，不替换 -
            date = new Date(time)
        } else {
            // 普通日期字符串：替换 - 为 / 兼容 iOS
            date = new Date(time.replace(/-/g, '/'))
        }
    } else if (time instanceof Date) {
        // 直接使用 Date 对象
        date = time
    } else {
        return ''
    }

    // 额外防护：解析失败时返回空字符串
    if (isNaN(date.getTime())) {
        return ''
    }

    // 提取时间字段
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }

    // 替换模板中的占位符（补零）
    const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key as keyof typeof formatObj].toString()
        // 补零：月/日/时/分/秒 小于10时补0
        return key === 'y' ? value : (value.padStart(2, '0'))
    })

    return timeStr
}
