export interface Make {
  make_id: number;
  name: string;
}

export interface MakeInput {
  name: string;
}

export interface Model {
  model_id: number;
  name: string;
  make: Make;
}

export interface ModelInput {
  name: string;
  make_id: number;
}

export interface VehicleSpec {
  vehicle_id: number;
  model_id: number;
  year: number;
  engine: string;
  vehicle_type: string;
  fuel_type: string;
  drive_type: string;
  transmission: string;
  img_url?: string;
  model?: Model;
}

export interface VehicleSpecInput {
  model_id: number;
  year: number;
  engine: string;
  vehicle_type: string;
  fuel_type: string;
  drive_type: string;
  transmission: string;
}

export interface VehicleState {
  makes: Make[];
  models: Model[];
  vehicleSpecs: VehicleSpec[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}
