import { Transform, TransformFnParams } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export const SNIPPET_TYPES = ['link', 'note', 'command'] as const;
export type SnippetType = (typeof SNIPPET_TYPES)[number];

export class CreateSnippetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(SNIPPET_TYPES)
  type: SnippetType;

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    if (value === undefined || value === null) {
      return [];
    }
    if (Array.isArray(value)) {
      return value as string[];
    }
    return String(value)
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  })
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  tags?: string[];
}
