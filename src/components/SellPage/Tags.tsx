import { useEffect, useState } from "react";
import tagSVG from "../../assets/tag.svg";
import enter_svg from "../../assets/enter.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export interface TagsProps {
    onTagsChange: (tags: string[]) => void;
    selectedTags: string[];
  }
//React.FC
export const Tags = ({ onTagsChange , selectedTags}: TagsProps) => {
    
    
    const [tags, setTags] = useState<string[]>([]);
    const [remainingTags, setRemainingTags] = useState<number>(5);

    useEffect(() => {
        if(selectedTags.length > 0){
            setTags(selectedTags);
            setRemainingTags(5 - selectedTags.length);
        }
        
    }, [selectedTags]);
    
    /**
     *  This function is used to add a tag to the list of tags.
     * @param e  The event that is triggered when a key is pressed.
     */
    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            let tag = e.currentTarget.value.replace(/\s+/g, " ");
            if (tag.length > 1 && !tags.includes(tag)) {
                if (tags.length < 5) {
                    tag.split(",").forEach((tag) => {
                        setTags((prevTags) => [...prevTags, tag]);
                        onTagsChange([...tags, tag]);
                        setRemainingTags((prevRemainingTags) => prevRemainingTags - 1);
                    });
                }
            }
            e.currentTarget.value = "";
        }
    };

    /**
     *  This function is used to remove a tag from the list of tags.
     * @param tag 
     */
    const handleRemoveTag = (tag: string) => {
        setTags((prevTags) => prevTags.filter((t) => t !== tag));
        onTagsChange(tags.filter((t) => t !== tag));
        setRemainingTags((prevRemainingTags) => prevRemainingTags + 1);
    };



    /**
     * This function is used to remove all tags from the list of tags.
     */
    const handleRemoveAllTags = () => {
        setTags([]);
        onTagsChange([]);
        setRemainingTags(5);
    };


    
  return (
    <div className="TagsWrapper">
      <div className="title">
        <h3>Tags</h3>
        <img src={tagSVG} alt="icon" />
      </div>
      <div className="content">
        <p>
          Press{" "}
          <img id="enterImage" src={enter_svg} alt="Enter key" /> or add ","
          after each tag
        </p>
        <ul>
          <div className="form-input">
            <input
              enterKeyHint="enter"
              type="text"
              spellCheck="false"
              onKeyDown={handleAddTag}
            />
          </div>
          {tags.map((tag, index) => (
            <li key={index}>
              {tag}
                <FontAwesomeIcon
                    icon={faXmark}
                    className="fontAwesomeIcon"
                    onClick={() => handleRemoveTag(tag)}
                />
            </li>
          ))}
        </ul>
      </div>
      <div className="details">
        <p>
          <span>{remainingTags}</span> tags remaining
        </p>
        <button className="btn btn-social" onClick={handleRemoveAllTags}>
          Remove All
        </button>
      </div>
    </div>
  );
};
