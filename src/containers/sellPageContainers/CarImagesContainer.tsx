import { Car } from "../../../types";
import { errorMessagesSellPage } from "../../pages/SellPage/SellOrEditPageProps";
import { useRef, ChangeEvent } from "react";
import { showToolTip } from "../../utils/helpers";
import {
  deleteObject,
  ref,
  collection,
  getDoc,
  doc,
  updateDoc,
  db,
  storage,
} from "../../utils/firebase";

type CarImagesContainerProps = {
  carDefault: Car | null;
  errorMessages: errorMessagesSellPage;
  car: Car;
  setCar: React.Dispatch<React.SetStateAction<Car>>;
  selectedImages: File[];
  setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>;
  id: string | null;
  updateDefaultCar?: (car: Car) => void;
};

const CarImagesContainer = ({
  carDefault,
  errorMessages,
  setCar,
  selectedImages,
  id,
  car,
  setSelectedImages,
  updateDefaultCar,
}: CarImagesContainerProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleAdImagesClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && car?.images) {
      if (selectedImages.length + files.length > 15 - car?.images.length) {
        showToolTip(
          `You can only add up to ${15 - car?.images.length} images.`,
          "red"
        );
        return;
      }
      const newImages = Array.from(files);
      setSelectedImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const deleteImage = async (image: string) => {
    const CarsRef = collection(db, "cars");
    const imageRef = ref(storage, `${image}`);
    await deleteObject(imageRef);
    if (id) {
      const carDoc = await getDoc(doc(CarsRef, id));
      if (carDoc.exists()) {
        const car = carDoc.data() as Car;
        const newImages = car.images.filter((img) => img !== image);

        await updateDoc(doc(CarsRef, id), { images: newImages });

        setCar((prevCar) => ({ ...prevCar, images: newImages }));

        if (updateDefaultCar && carDefault) {
          updateDefaultCar({
            ...carDefault,
            images: newImages,
          });
        }
      }
    } else {
      showToolTip("Something went wrong while deleting the image", "red");
    }
  };

  return (
    <div className="form-container car-images">
      <h3>Images</h3>
      <output id="imageOutput">
        {carDefault?.images.map((image: string, index: number) => (
          <div className="image addedImage" key={image}>
            <img src={image} alt="carImage" loading="lazy" />
            <span onClick={() => deleteImage(car.images[index])}>&times;</span>
          </div>
        ))}
        {selectedImages?.map((image: File, index: number) => (
          <div className="image toAddImages" key={image.name}>
            <img
              src={URL.createObjectURL(image)}
              alt={image?.name}
              loading="lazy"
            />
            <span onClick={() => removeImage(index)}>&times;</span>
          </div>
        ))}
      </output>
      {errorMessages.images && (
        <div className="errorMessage">{errorMessages.images}</div>
      )}
      <div className="buttonwrap">
        <button onClick={handleAdImagesClick} className="btn btn-social">
          Add Images
        </button>
        <input
          id="imageInput"
          type="file"
          ref={imageInputRef}
          multiple={true}
          accept="image/jpeg, image/png, image/jpg"
          onChange={handleImageChange}
          maxLength={15 - (car?.images?.length || 0)}
        />
      </div>
      <p>You can add up to 15 images. JPG, PNG formats are accepted.</p>
      &nbsp;
    </div>
  );
};

export default CarImagesContainer;
