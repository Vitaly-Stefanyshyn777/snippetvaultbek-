import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { QuerySnippetsDto } from './dto/query-snippets.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { Snippet, SnippetDocument } from './schemas/snippet.schema';

export interface PaginatedResult {
  data: Snippet[];
  total: number;
  page: number;
  limit: number;
}

interface SnippetFilter {
  $text?: { $search: string };
  tags?: string;
}

@Injectable()
export class SnippetsService {
  constructor(
    @InjectModel(Snippet.name)
    private readonly snippetModel: Model<SnippetDocument>,
  ) {}

  async create(createDto: CreateSnippetDto): Promise<Snippet> {
    const snippet = new this.snippetModel(createDto);
    return snippet.save();
  }

  async findAll(query: QuerySnippetsDto): Promise<PaginatedResult> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit =
      query.limit && query.limit > 0 ? Math.min(query.limit, 50) : 10;
    const filter: SnippetFilter = {};

    if (query.q) {
      filter.$text = { $search: query.q };
    }

    if (query.tag) {
      filter.tags = query.tag;
    }

    const [data, total] = await Promise.all([
      this.snippetModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.snippetModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Snippet> {
    const snippet = await this.snippetModel.findById(id).lean().exec();
    if (!snippet) {
      throw new NotFoundException('Snippet not found');
    }
    return snippet;
  }

  async update(id: string, updateDto: UpdateSnippetDto): Promise<Snippet> {
    const updated = await this.snippetModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException('Snippet not found');
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    const result = await this.snippetModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Snippet not found');
    }
  }
}
