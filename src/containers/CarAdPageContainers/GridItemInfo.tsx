
type GridItemInfoProps = {
  value?: string | number;
  label: string;
  children?: React.ReactNode;
  optionalItem?: boolean;
}

export const GridItemInfo = ({ value ,label , children ,optionalItem }: GridItemInfoProps) => {
  return (
    <div className={optionalItem ? "optionalInfoItem" : "grid-item"}>
      <p>{label}:</p>
      { children ? (null) :
        <p>{value ? value : ""}</p>
      }
      {children}
    </div>
  );
}