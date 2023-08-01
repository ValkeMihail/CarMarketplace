import { Car } from "../../../types";





export interface SellOrEditPageProps {
  isSellPage: boolean;
  carDefault: Car | null;
  id: string | null;
  updateDefaultCar?: (car: Car) => void;
}


export type errorMessagesSellPage = {
  vin: string;
  milage: string;
  dayOfFirstRegistration: string;
  monthOfFirstRegistration: string;
  yearOfFirstRegistration: string;
  generation: string;
  condition: string;
  make: string;
  model: string;
  fuelType: string;
  madeYear: string;
  power: string;
  capacity: string;
  DoorNumber: string;
  transmission: string;
  images: string;
  driveTrain: string;
  color: string;
  price: string;
  shortDescription: string;
  version: string;
  EmmisionStandard: string;
  bodyWork: string;
  youtubeLink: string;
  longDescription?: string;
  countryOfOrigin: string;
  warrantyKm: string;
  country: string;
  city: string;
  c02Emission: string;
};
