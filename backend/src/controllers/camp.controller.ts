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
} from '@loopback/rest';
import {Camp, CampRelations, Donor} from '../models';
import {CampRepository, DonorRepository} from '../repositories';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

class DateProvider {
  getCurrentDate(): string {
    // Get the current date
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getCurrentTime(): string {
    // Get the current time
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}

export class CampController {
  constructor(
    @repository(CampRepository)
    public campRepository : CampRepository,
    @repository(DonorRepository)
    public donorRepository : DonorRepository,
  ) {}

  @post('/camps')
  @response(200, {
    description: 'Camp model instance',
    content: {'application/json': {schema: getModelSchemaRef(Camp)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Camp, {
            title: 'NewCamp',
            exclude: ['id', 'donors'],
          }),
        },
      },
    })
    camp: Omit<Camp, 'id' | 'donors'>,
  ): Promise<Camp> {
    return this.campRepository.create(camp);
  }

  @get('/camps/count')
  @response(200, {
    description: 'Camp model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Camp) where?: Where<Camp>,
  ): Promise<Count> {
    return this.campRepository.count(where);
  }

  @get('/camps')
  @response(200, {
    description: 'Array of Camp model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Camp, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Camp) filter?: Filter<Camp>,
  ): Promise<Camp[]> {
    return this.campRepository.find(filter);
  }

  @patch('/camps')
  @response(200, {
    description: 'Camp PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Camp, {partial: true}),
        },
      },
    })
    camp: Camp,
    @param.where(Camp) where?: Where<Camp>,
  ): Promise<Count> {
    return this.campRepository.updateAll(camp, where);
  }

  @get('/camps/{id}')
  @response(200, {
    description: 'Camp model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Camp, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Camp, {exclude: 'where'}) filter?: FilterExcludingWhere<Camp>
  ): Promise<Camp> {
    return this.campRepository.findById(id, filter);
  }

  @patch('/camps/{id}')
  @response(204, {
    description: 'Camp PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Camp, {partial: true}),
        },
      },
    })
    camp: Camp,
  ): Promise<void> {
    await this.campRepository.updateById(id, camp);
  }

  @put('/camps/{id}')
  @response(204, {
    description: 'Camp PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() camp: Camp,
  ): Promise<void> {
    const existingCamp = await this.campRepository.findById(id);
    const updatedCamp = Object.assign(existingCamp, camp)
    await this.campRepository.replaceById(id, updatedCamp);
  }

  @del('/camps/{id}')
  @response(204, {
    description: 'Camp DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.campRepository.deleteById(id);
  }


  @post('/camps/register')
  @response(200, {
    description: 'Register a camp by a donor',
    content: { 'application/json': { schema: getModelSchemaRef(Camp) } },
  })
  @response(422, {
    description: 'Cannot register for past camps',
  })
  async registerCamp(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              campId: { type: 'number' },
              donorId: { type: 'number' },
            },
            required: ['campId', 'donorId'],
          },
        },
      },
    })
    registrationData: { campId: number; donorId: number },
  ): Promise<Camp> {
    const { campId, donorId } = registrationData;

    // Find the camp by ID
    const camp = await this.campRepository.findById(campId);

    if (!camp) {
      throw new Error('Camp not found');
    }

    // Check if the camp date and time have passed
    const dateProvider = new DateProvider();
    const currentDate = dateProvider.getCurrentDate();
    const currentTime = dateProvider.getCurrentTime();

    // Check if the donor is already registered for the camp
    // const isRegistered = (camp.donors as any[]).some((donor: any) => donor.id === donorId);
    const isRegistered = (camp.donors || []).some((donor: any) => donor.id === donorId);
    if (isRegistered) {
      throw Object.assign(new Error('Donor already registered for the camp'), {
        statusCode: 422,
      });
    }

    if (camp.date < currentDate || (camp.date === currentDate && camp.endTime < currentTime)) {
      throw Object.assign(new Error('Cannot register for past camps'), {
        statusCode: 422,
      });
    }

    // Find the donor by ID
    const donor = await this.donorRepository.findById(donorId);

    if (!donor) {
      throw new Error('Donor not found');
    }

    const donorWithoutPassword: any = {
      id: donor.id,
      name: donor.name,
      email: donor.email,
      gender: donor.gender,
      dob: donor.dob,
      medicalCondition: donor.medicalCondition,
      image: donor.image
    };

    // Save the donor information to the camp's donors property
    if (!camp.donors) {
      camp.donors = [];
    }

    // Add the donor if not already registered
    if (!isRegistered) {
      camp.donors.push(donorWithoutPassword);
    }

    // Update the camp with the new donor information
    await this.campRepository.update(camp);

    if (!donor.camps) {
      donor.camps = [];
    }
    donor.camps.push(campId);
    await this.donorRepository.update(donor);

    return camp;
  }

  @post('/camps/unregister')
  @response(200, {
    description: 'Unregister a camp by a donor',
    content: { 'application/json': { schema: getModelSchemaRef(Camp) } },
  })
  @response(422, {
    description: 'Cannot unregister for past camps',
  })
  async unregisterCamp(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              campId: { type: 'number' },
              donorId: { type: 'number' },
            },
            required: ['campId', 'donorId'],
          },
        },
      },
    })
    unregistrationData: { campId: number; donorId: number },
  ): Promise<Camp> {
    const { campId, donorId } = unregistrationData;

    // Find the camp by ID
    const camp = await this.campRepository.findById(campId);

    if (!camp) {
      throw new Error('Camp not found');
    }

    // Check if the camp date and time have passed
    const dateProvider = new DateProvider();
    const currentDate = dateProvider.getCurrentDate();
    const currentTime = dateProvider.getCurrentTime();

    if (camp.date < currentDate || (camp.date === currentDate && camp.endTime < currentTime)) {
      throw Object.assign(new Error('Cannot unregister for past camps'), {
        statusCode: 422,
      });
    }

    // Find the donor by ID
    const donor = await this.donorRepository.findById(donorId);

    if (!donor) {
      throw new Error('Donor not found');
    }

    // Check if the donor is registered for the camp
    const donorIndex = (camp.donors as any[]).findIndex((donor: any) => donor.id === donorId);

    if (donorIndex === -1) {
      throw new Error('Donor is not registered for the camp');
    }

    // Remove the donor from the camp's donors property
    camp.donors.splice(donorIndex, 1);

    // Update the camp with the updated donor information
    await this.campRepository.update(camp);

    // Remove the camp ID from the donor's camps property
    if (donor.camps) {
      const campIndex = donor.camps.indexOf(campId);
      if (campIndex !== -1) {
        donor.camps.splice(campIndex, 1);
      }
    }

    // Update the donor with the removed camp ID
    await this.donorRepository.update(donor);

    return camp;
  }

  @get('/camps/{id}/donors')
  @response(200, {
    description: 'Array of Donor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Donor),
        },
      },
    },
  })
  async getCampDonors(
    @param.path.number('id') campId: number
  ): Promise<object[]> {
    const camp = await this.campRepository.findById(campId, {
      fields: { donors: true },
    });

    if (!camp) {
      throw new Error('Camp not found');
    }

    return camp.donors ?? [];
  }


  @get('/camps/{id}/sendEmailsToDonors')
  async sendEmailsToDonors(
    @param.path.number('id') campId: number,
  ): Promise<string> {
    try {
      const camp = await this.campRepository.findById(campId);
      if (!camp) {
        throw new Error('Camp not found');
      }

      const donors = await this.donorRepository.find();
      if (!donors || donors.length === 0) {
        throw new Error('No donors found');
      }

      const em = "mohitgupta.mg2727@gmail.com";
      const passs = "hwclrtwudrcfnfvi";

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: em,
          pass: passs,
        },
      });

      const generateEmailBody = (camp: Camp & CampRelations) => {
        const mailGenerator = new Mailgen({
          theme: 'default',
          product: {
            name: 'Blood Bank 🩸',
            link: 'http://app.com',
          },
        });

        const email = {
          body: {
            greeting: 'Hello!',
            intro: `A new camp has been created. \n
            Please register yourself in this camp and save someone's life. \n
            Below are the camp details.
            `,
            table: {
              data: [
                {
                  key: 'Name:',
                  value: camp.name,
                },
                {
                  key: 'Date:',
                  value: camp.date,
                },
                {
                  key: 'Location:',
                  value: camp.location,
                },
                {
                  key: 'Start Time',
                  value: camp.startTime
                },
                {
                  key: 'End Time',
                  value: camp.endTime
                }
              ],
            },
            outro: 'Thank you for your support!',
            organiser: camp.createdBy
          },
        };

        const emailBody = mailGenerator.generate(email);

        return {
          body: emailBody,
          text: mailGenerator.generatePlaintext(email),
        };
      };

      const emailBody = generateEmailBody(camp);

      const emailPromises = donors.map((donor) => {
        const mailOptions = {
          from: em,
          to: 'jaxikig287@anomgo.com',
          subject: 'New Camp Created',
          html: emailBody.body,
          text: emailBody.text,
        };

        return transporter.sendMail(mailOptions);
      });

      await Promise.all(emailPromises);
      return 'Emails sent successfully to all donors';
    } catch (error) {
      console.error('Failed to send emails to donors:', error);
      throw new Error('Failed to send emails to donors');
    }
  }

}
