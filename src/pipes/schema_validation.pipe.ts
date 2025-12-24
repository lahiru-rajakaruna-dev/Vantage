import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export default class ZodSchemaValidationPipe implements PipeTransform {
  private schema: ZodSchema;

  constructor(schema: ZodSchema) {
    this.schema = schema;
  }

  transform(value: any, metadata: ArgumentMetadata): any {
    try {
      console.log(metadata);
      return this.schema.safeParse(value);
    } catch (e) {
      throw new BadRequestException(`[-] ${(e as Error).message}`);
    }
  }
}
