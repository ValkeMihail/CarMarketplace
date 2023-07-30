import tagsIcon from "/src/assets/tag.svg";

type TagsWrapContainerProps = {
  carDoc: {
    tags: string[];
  }
}

export function TagsWrapContainer({
  carDoc,
} : TagsWrapContainerProps) {
  return (
    <div className="tagsWrap">
      <div className="title">
        <h3>Tags</h3>
        <img src={tagsIcon} alt="tag" />
      </div>
      <div className="tags">
        {carDoc?.tags.map((tag: string) => <div className="tag" key={tag}>
            <h4>{tag}</h4>
          </div>)}
      </div>
    </div>
  );
}
  