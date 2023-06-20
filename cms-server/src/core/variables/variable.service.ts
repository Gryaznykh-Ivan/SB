
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma-module/prisma.service';
import { UpdateVariablesDto } from './dto/updateVariables.dto';

@Injectable()
export class VariableService {
    constructor(
        private prisma: PrismaService
    ) { }

    async getVariablesByGroup(group: string) {
        const variables = await this.prisma.variable.findMany({
            where: { group },
            select: {
                id: true,
                group: true,
                key: true,
                value: true,
                createdAt: true,
                updatedAt: true
            }
        })

        return {
            success: true,
            data: variables
        }
    }

    async updateVariables(data: UpdateVariablesDto) {
        try {
            for (const variable of data.updateVariables) {
                await this.prisma.variable.upsert({
                    where: {
                        group_key: {
                            group: variable.group,
                            key: variable.key,
                        }
                    },
                    create: {
                        group: variable.group,
                        key: variable.key,
                        value: variable.value
                    },
                    update: {
                        value: variable.value
                    },
                })
            }

            return {
                success: true
            }
        } catch (e) {
            throw new HttpException("Произошла ошибка на стороне сервера", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}