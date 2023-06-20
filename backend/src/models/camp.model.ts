import {Entity, model, property} from '@loopback/repository';

@model()
export class Camp extends Entity {
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
  date: string;

  @property({
    type: 'string',
    required: true,
  })
  location: string;

  @property({
    type: 'string',
    required: true,
  })
  createdBy: string;

  @property({
    type: 'array',
    itemType: 'object',
    required: false,
  })
  donors: object[];

  @property({
    type: 'string',
    required: true,
  })
  startTime: string;

  @property({
    type: 'string',
    required: true,
  })
  endTime: string;


  constructor(data?: Partial<Camp>) {
    super(data);
  }
}

export interface CampRelations {
  // describe navigational properties here
}

export type CampWithRelations = Camp & CampRelations;
