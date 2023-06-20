import {Entity, model, property} from '@loopback/repository';

@model()
export class Donor extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  gender: string;

  @property({
    type: 'string',
    required: true,
  })
  dob: string;

  @property({
    type: 'string',
    required: true,
  })
  medicalCondition: string;

  @property({
    type: 'string',
    required: true,
  })
  bloodGroup: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'array',
    itemType: 'number',
    required: false,
  })
  camps: number[]

  @property({
    type: 'string',
    required: false,
  })
  image: string;

  constructor(data?: Partial<Donor>) {
    super(data);
  }
}

export interface DonorRelations {
  // describe navigational properties here
}

export type DonorWithRelations = Donor & DonorRelations;
