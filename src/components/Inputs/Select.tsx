

type SelectProps = {
  classType: string;
  label: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  id: string;
  defaultValue?: string | number;
  children?: React.ReactNode;
};

export const Select: React.FC<SelectProps> = ({
  classType,
  label,
  name,
  onChange,
  id,
  defaultValue,
  children,
}) => {
  return (
    <div className={classType}>
      <label>{label}:</label>
      <select
        name={name}
        onChange={onChange}
        id={id}
        defaultValue={defaultValue}
      >
        {children}
      </select>
    </div>
  );
};
