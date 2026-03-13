import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SnippetDocument = Snippet & Document;

@Schema({ timestamps: true })
export class Snippet {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  content: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true, enum: ['link', 'note', 'command'] })
  type: 'link' | 'note' | 'command';

  createdAt?: Date;
  updatedAt?: Date;
}

export const SnippetSchema = SchemaFactory.createForClass(Snippet);
SnippetSchema.index({ title: 'text', content: 'text' });
