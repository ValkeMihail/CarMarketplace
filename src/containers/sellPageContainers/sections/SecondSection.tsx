import { Car } from "../../../../types";
import { Tags } from "../../../components/Tags/Tags";
import { errorMessagesSellPage } from "../../../pages/SellPage/SellOrEditPageProps";


import { CarBodyContainer } from "../CarBodyContainer";
import { CarDescriptionContainer } from "../CarDescriptionContainer";
import { CarHistoryContainer } from "../CarHistoryContainer";
import { CarSellerContainer } from "../CarSellerContainer";
import { CarWarrantyContainer } from "../CarWarrantyContainer";
import { useState } from "react";
import ContinueButton from "../ContinueButton";
import CarImagesContainer from "../CarImagesContainer";

type SecondSectionProps = {
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  isSellPage: boolean;
  carDefault: Car | null;
  errorMessages: errorMessagesSellPage;
  setCar: React.Dispatch<React.SetStateAction<Car>>;
  car: Car;
  id: string | null;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  updateDefaultCar?: (car: Car) => void;
  setErrorMessages: React.Dispatch<React.SetStateAction<errorMessagesSellPage>>;
  isSecondSectionOverlayVisible: boolean;
};

const SecondSection = ({
  id,
  handleInputChange,
  handleSelectChange,
  isSellPage,
  carDefault,
  errorMessages,
  setErrorMessages,
  car,
  setCar,
  updateDefaultCar,
  isSecondSectionOverlayVisible,
  tags,
  setTags,
}: SecondSectionProps) => {


  const [selectedImages, setSelectedImages] = useState<File[]>([]);


  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    setCar((prevCar: Car) => ({ ...prevCar, tags: newTags }));
  };

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setCar((prevCar) => ({ ...prevCar, [name]: value }));
  };

  return (
    <div className="second-section" id="second-section">
      <CarBodyContainer
        handleInputChange={handleInputChange}
        errorMessages={{
          bodyWork: errorMessages.bodyWork,
          color: errorMessages.color,
        }}
        handleSelectChange={handleSelectChange}
        carDefault={{
          bodyWork: carDefault?.bodyWork,
          color: carDefault?.color,
          youtubeLink: carDefault?.youtubeLink,
        }}
        isSellPage={isSellPage}
      >
      <CarImagesContainer
        car={car}
        carDefault={carDefault}
        errorMessages={errorMessages}
        id={id}
        selectedImages={selectedImages}
        setCar={setCar}
        setSelectedImages={setSelectedImages}
        updateDefaultCar={updateDefaultCar}
      />
      </CarBodyContainer>

      <CarDescriptionContainer
        errorMessages={{
          shortDescription: errorMessages.shortDescription,
          longDescription: errorMessages.longDescription,
        }}
        handleInputChange={handleInputChange}
        handleTextAreaChange={handleTextAreaChange}
        carDefault={{
          shortDescription: carDefault?.shortDescription,
          longDescription: carDefault?.longDescription,
        }}
      />

      <div className="form-container car-equipment">
        <Tags onTagsChange={handleTagsChange} selectedTags={car?.tags ?? []} />
      </div>

      <CarHistoryContainer
        carDefault={{ countryOfOrigin: carDefault?.countryOfOrigin }}
        handleInputChange={handleInputChange}
        errorMessages={{ countryOfOrigin: errorMessages.countryOfOrigin }}
      />
      <CarWarrantyContainer
        handleInputChange={handleInputChange}
        carDefault={{ warrantyKm: carDefault?.warrantyKm }}
        errorMessages={{ warrantyKm: errorMessages.warrantyKm }}
      />
      <CarSellerContainer
        handleInputChange={handleInputChange}
        carDefault={{
          price: carDefault?.price,
          country: carDefault?.country,
          city: carDefault?.city,
        }}
        errorMessages={{
          price: errorMessages.price,
          country: errorMessages.country,
          city: errorMessages.city,
        }}
      />
      <ContinueButton
        car={car}
        carDefault={carDefault}
        id={id}
        isSellPage={isSellPage}
        selectedImages={selectedImages}
        setErrorMessages={setErrorMessages}
        tags={tags}
      />
      <div
        className={
          isSecondSectionOverlayVisible
            ? "secondOverlay"
            : "secondOverlay-hidden"
        }
      >
        <div className={isSecondSectionOverlayVisible ? "text" : "text-hidden"}>
          please complete the first section
        </div>
      </div>
    </div>
  );
};

export default SecondSection;
