export const formatParamsForAxios = (data: any) => {
  const { filters, page, pageSize } = data

  const formattedParams: any = {
    ...filters,
    page,
    pageSize
  }

  return formattedParams
}

export const getLableConstant = (constArr: Array<any>, fieldValue: string) => {
  return constArr.find(({ value }: { value: string }) => value === fieldValue)?.label
}
