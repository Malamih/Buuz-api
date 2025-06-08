import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class PagesService {
  private filePath = path.join(process.cwd(), 'data', 'pages.json');

  async getContent() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      throw new InternalServerErrorException('Failed to read content file.');
    }
  }

  async updateContent(newData: Record<string, any>) {
    try {
      const existing = await this.getContent();
      const updated = { ...existing, ...newData };
      await fs.writeFile(
        this.filePath,
        JSON.stringify(updated, null, 2),
        'utf-8',
      );

      return {
        message: 'Page content updated successfully.',
        updated_data: updated,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update content file.');
    }
  }
}
