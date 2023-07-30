import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

type CarInfoWrapProps = {
  faIcon: FontAwesomeIconProps["icon"]
  value: string | number
  id: string,
  children?: React.ReactNode
}


export function CarInfoWrap({
  faIcon,
  value,
  id,
  children
}: CarInfoWrapProps) {
  return (
    <div className="infoWrap">
      <FontAwesomeIcon className="fontAwesomeIcon" icon={faIcon} />
      <h4 id={id}>{value}</h4>
      {children}
    </div>
  );
}
  