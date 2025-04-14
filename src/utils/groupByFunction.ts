export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array?.reduce((result, item) => {
    const groupKey = item[key] as string;
    (result[groupKey] ||= []).push(item);
    return result;
  }, {} as Record<string, T[]>);
};

export const getOptionsByCategory = (
  grouped: Record<string, any[]>,
  categoryName: string
) => {
  return grouped?.[categoryName]?.map((item) => ({
    value: item.postCategory_name,
    label: item.postCategory_name,
  }));
};

export const getOptionsByAuthor = (
  grouped: Record<string, any[]>,
  categoryName: string
) => {
  return grouped?.[categoryName]?.map((item) => ({
    value: item.author_name,
    label: item.author_name,
  }));
};

