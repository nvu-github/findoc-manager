export const formatParamsForAxios = (data: any) => {
  const { filters, page, pageSize } = data

  const formattedParams: any = {
    ...filters,
    page,
    pageSize
  }

  return formattedParams
}
