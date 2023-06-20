import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import { Camp, Donor } from '../models';
import { CampRepository, DonorRepository } from '../repositories';
import { hashSync, compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';

export class DonorController {
  @repository(CampRepository)
  public campRepository: CampRepository;
  constructor(
    @repository(DonorRepository)
    public donorRepository: DonorRepository,
  ) {}

  @post('/donors')
  @response(200, {
    description: 'Donor model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Donor) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Donor, {
            title: 'NewDonor',
            exclude: ['id','camps'],
          }),
        },
      },
    })
    donor: Omit<Donor, 'id' | 'camps'>,
  ): Promise<Donor> {
    // Encrypt the password
    const hashedPassword = hashSync(donor.password, 10);
    donor.password = hashedPassword;

    return this.donorRepository.create(donor);
  }

  @get('/donors/count')
  @response(200, {
    description: 'Donor model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Donor) where?: Where<Donor>,
  ): Promise<Count> {
    return this.donorRepository.count(where);
  }

  @get('/donors')
  @response(200, {
    description: 'Array of Donor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Donor, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Donor) filter?: Filter<Donor>,
  ): Promise<Donor[]> {
    return this.donorRepository.find(filter);
  }

  @patch('/donors')
  @response(200, {
    description: 'Donor PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Donor, { partial: true }),
        },
      },
    })
    donor: Donor,
    @param.where(Donor) where?: Where<Donor>,
  ): Promise<Count> {
    return this.donorRepository.updateAll(donor, where);
  }

  @get('/donors/{id}')
  @response(200, {
    description: 'Donor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Donor, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Donor, { exclude: 'where' }) filter?: FilterExcludingWhere<Donor>,
  ): Promise<Donor> {
    const donor = await this.donorRepository.findById(id, filter);

    if (!donor) {
      throw new HttpErrors.NotFound('Donor not found.');
    }

    return donor;
  }

  @patch('/donors/{id}')
  @response(204, {
    description: 'Donor PATCH success',
    // content: { 'application/json': {schema: {}} }
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Donor, { partial: true }),
        },
      },
    })
    donor: Donor,
  ): Promise<void> {
    await this.donorRepository.updateById(id, donor);
  }

  @put('/donors/{id}')
  @response(204, {
    description: 'Donor PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() donor: Donor,
  ): Promise<void> {
    const existingDonor = await this.donorRepository.findById(id);
    const updatedDonor = Object.assign(existingDonor, donor);
    await this.donorRepository.replaceById(id, updatedDonor);
  }

  @del('/donors/{id}')
  @response(204, {
    description: 'Donor DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.donorRepository.deleteById(id);
  }

  @post('/donors/login')
  @response(200, {
    description: 'Login successful',
    content: { 'application/json': { schema: { type: 'string' } } },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string', minLength: 6 },
            },
            required: ['email', 'password'],
          },
        },
      },
    })
    credentials: { email: string; password: string },
  ): Promise<{ token: string, id: number | undefined }> {
    const { email, password } = credentials;

    // Find the donor based on the email
    const donor = await this.donorRepository.findOne({
      where: { email },
      fields: { id: true, password: true },
    });

    if (!donor) {
      throw new HttpErrors.NotFound('Donor not found.');
    }

    if (!compareSync(password, donor.password)) {
      throw new HttpErrors.Unauthorized('Incorrect password.');
    }

    // generating a JWT token
    const token = sign({ donorId: donor.id }, 'your_secret_key', {
      expiresIn: '1h',
    });

    return { token, id: donor.id };
  }

  @get('/donors/{id}/camps')
  @response(200, {
    description: 'Array of Camps registered by the Donor',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Camp, { includeRelations: false }),
        },
      },
    },
  })
  async getDonorCamps(
    @param.path.number('id') id: number,
  ): Promise<object[]> {
    const donor = await this.donorRepository.findById(id);

    if (!donor) {
      throw new Error('Donor not found');
    }

    const camps = donor.camps ?? [];
    const campObjects: object[] = [];

    for (const campId of camps) {
      const camp = await this.campRepository.findById(campId);
      if (camp) {
        const campObject: any = {
          id: camp.id,
          name: camp.name,
          date: camp.date,
          location: camp.location,
          createdBy: camp.createdBy,
          startTime: camp.startTime,
          endTime: camp.endTime,
        };
        campObjects.push(campObject);
      }
    }

    return campObjects;
  }

  @post('/donors/isRegister')
  @response(200, {
    description: 'Check if the donor is registered for the camp',
    content: { 'application/json': { schema: { type: 'boolean' } } },
  })
  async isRegister(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              donorId: { type: 'number' },
              campId: { type: 'number' },
            },
            required: ['donorId', 'campId'],
          },
        },
      },
    })
    request: { donorId: number; campId: number },
  ): Promise<{ isRegistered: boolean }> {
    const donor = await this.donorRepository.findById(request.donorId);

    if (!donor) {
      throw new Error('Donor not found');
    }

    const isRegistered = donor.camps?.includes(request.campId) ?? false;

    return { isRegistered };
  }

}
