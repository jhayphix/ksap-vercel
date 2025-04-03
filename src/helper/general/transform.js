export const toProperCase = (value) => {
  const output = value
    ?.split([" "])
    ?.map(
      (word) => word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase()
    )
    ?.join(" ");

  return output;
};

export const capitalizeFirstLetterOnly = (value) => {
  return value?.charAt(0)?.toUpperCase() + value?.slice(1)?.toLowerCase();
};
