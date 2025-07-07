import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employee } from './schemas/employee.schema';
import mongoose from 'mongoose';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel('Employee') readonly employeeModel: mongoose.Model<Employee>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(filters?: {}): Promise<{
    payload: Employee[];
    message: string;
  }> {
    const employees = await this.employeeModel
      .find({
        ...filters,
      })
      .exec();
    return {
      message: 'Employees have been fetched successfully',
      payload: employees,
    };
  }

  async findOne(id: string): Promise<{ message: string; payload: Employee }> {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error('Invalid employee ID');
    }
    const employee = await this.employeeModel.findById(id).exec();
    if (!employee) {
      throw new Error('Employee not found');
    }
    return { message: 'Employee found', payload: employee };
  }

  async create(
    data: CreateEmployeeDto,
    image: Express.Multer.File,
  ): Promise<{ message: string; payload: Employee } | undefined> {
    try {
      const { secure_url, public_id } =
        await this.cloudinaryService.uploadImage(image, 'employees');
      const employee = await this.employeeModel.create({
        ...data,
        image: secure_url,
        image_public_id: public_id,
      });
      return { message: 'Employee created successfully', payload: employee };
    } catch (error) {
      throw new Error('Error creating employee: ' + error.message);
    }
  }

  async update(
    id: string,
    data: UpdateEmployeeDto,
    image?: Express.Multer.File,
  ): Promise<{ message: string; payload: Employee | null } | undefined> {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('Invalid employee ID');
      }
      const existingEmployee = await this.employeeModel.findById(id);
      if (!existingEmployee) {
        throw new Error('Employee not found');
      }
      let secure_url: null | string = null;
      let public_id: null | string = null;
      if (image) {
        await this.cloudinaryService.deleteImage(
          existingEmployee.image_public_id,
        );
        const uploadResult = await this.cloudinaryService.uploadImage(
          image,
          'employees',
        );
        secure_url = uploadResult.secure_url;
        public_id = uploadResult.public_id;
      }
      const updatedEmployee = await this.employeeModel.findByIdAndUpdate(
        id,
        {
          $set: {
            ...data,
            ...(secure_url && public_id
              ? { image: secure_url, image_public_id: public_id }
              : {}),
          },
        },
        { new: true },
      );
      return {
        message: 'Employee updated successfully',
        payload: updatedEmployee,
      };
    } catch (error) {}
  }

  async delete(id: string): Promise<{ message: string; result: any }> {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error('Invalid employee ID');
    }
    const existingEmployee = await this.employeeModel.findById(id);
    if (!existingEmployee) throw new NotFoundException('Employee not found');

    const result = await this.employeeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new Error('Employee not found');
    }
    return { message: 'Employee deleted successfully', result };
  }

  async deleteAll(): Promise<{ message: string; result: any }> {
    const result = await this.employeeModel.deleteMany().exec();
    return { message: 'All employees have been deleted successfully', result };
  }
}
