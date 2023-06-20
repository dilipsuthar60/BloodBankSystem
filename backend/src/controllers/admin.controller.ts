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
import {Admin} from '../models';
import {AdminRepository} from '../repositories';
import { hashSync, compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';

export class AdminController {
  constructor(
    @repository(AdminRepository)
    public adminRepository : AdminRepository,
  ) {}

  @post('/admins')
  @response(200, {
    description: 'Admin model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Admin) } },
  })
  async create(
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
    admin: Admin,
  ): Promise<Admin> {
    // Encrypt the password
    const hashedPassword = hashSync(admin.password, 10);
    admin.password = hashedPassword;

    return this.adminRepository.create(admin);
  }

  @get('/admins/count')
  @response(200, {
    description: 'Admin model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Admin) where?: Where<Admin>,
  ): Promise<Count> {
    return this.adminRepository.count(where);
  }

  @get('/admins')
  @response(200, {
    description: 'Array of Admin model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Admin, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Admin) filter?: Filter<Admin>,
  ): Promise<Admin[]> {
    return this.adminRepository.find(filter);
  }

  @patch('/admins')
  @response(200, {
    description: 'Admin PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, {partial: true}),
        },
      },
    })
    admin: Admin,
    @param.where(Admin) where?: Where<Admin>,
  ): Promise<Count> {
    return this.adminRepository.updateAll(admin, where);
  }

  @get('/admins/{id}')
  @response(200, {
    description: 'Admin model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Admin, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Admin, {exclude: 'where'}) filter?: FilterExcludingWhere<Admin>
  ): Promise<Admin> {
    return this.adminRepository.findById(id, filter);
  }

  @patch('/admins/{id}')
  @response(204, {
    description: 'Admin PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, {partial: true}),
        },
      },
    })
    admin: Admin,
  ): Promise<void> {
    await this.adminRepository.updateById(id, admin);
  }

  @put('/admins/{id}')
  @response(204, {
    description: 'Admin PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() admin: Admin,
  ): Promise<void> {
    await this.adminRepository.replaceById(id, admin);
  }

  @del('/admins/{id}')
  @response(204, {
    description: 'Admin DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.adminRepository.deleteById(id);
  }

  @post('/admin/login')
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
  ): Promise<{ token: string }> {
    const { email, password } = credentials;

    // Find the admin based on the email
    const admin = await this.adminRepository.findOne({
      where: { email },
      fields: { id: true, password: true },
    });

    if (!admin) {
      throw new HttpErrors.NotFound('Admin not found.');
    }

    if (!compareSync(password, admin.password)) {
      throw new HttpErrors.Unauthorized('Incorrect password.');
    }

    // Generate a JWT token
    const token = sign({ adminId: admin.id }, 'your_secret_key', {
      expiresIn: '1h',
    });

    return { token };
  }
}
