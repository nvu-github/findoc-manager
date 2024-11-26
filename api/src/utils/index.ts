export const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase)
  } else if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.keys(obj).reduce((result: any, key: string) => {
      const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase())
      const value = obj[key]

      if (typeof value === 'string' && isValidDate(value)) {
        result[camelKey] = value
      } else {
        result[camelKey] = toCamelCase(value)
      }

      return result
    }, {})
  } else if (typeof obj === 'string' && isValidDate(obj)) {
    return new Date(obj)
  }

  return obj
}

const isValidDate = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/
  return regex.test(dateString)
}

export const toSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase)
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result: any, key: string) => {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      result[snakeKey] = toSnakeCase(obj[key])
      return result
    }, {})
  }
  return obj
}
